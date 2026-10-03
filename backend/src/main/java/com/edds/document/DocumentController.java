package com.edds.document;

import com.edds.common.PageResponse;
import com.edds.document.dto.DocumentResponse;
import com.edds.storage.FileStorageService;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * The document REST surface.
 *
 * Reads are open to any authenticated user. Writes ({@code POST}, {@code
 * DELETE}) are gated to admins with method security, so the rule is enforced
 * right at the endpoint rather than relying only on the URL config.
 */
@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService service;
    private final FileStorageService storage;

    public DocumentController(DocumentService service, FileStorageService storage) {
        this.service = service;
        this.storage = storage;
    }

    /** Dynamic search. Every filter is optional. */
    @GetMapping
    public PageResponse<DocumentResponse> list(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) DocType type,
        @RequestParam(required = false) Long branch,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "9") int size
    ) {
        return service.search(search, type, branch, startDate, endDate, page, size);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public DocumentResponse create(
        @RequestParam String subject,
        @RequestParam DocType docType,
        @RequestParam Long branchId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate issueDate,
        @RequestParam("file") MultipartFile file
    ) {
        return service.create(subject, docType, branchId, issueDate, file);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.retire(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Streams the PDF back inline. Because this passes through the security
     * filter, only authenticated users reach it, and the file itself is never
     * served from a public, guessable url.
     */
    @GetMapping("/{id}/view")
    public ResponseEntity<Resource> view(@PathVariable Long id) {
        Document doc = service.getActiveEntity(id);
        Resource resource = storage.loadAsResource(doc.getFilePath());
        // The file name comes from the uploader, so it is encoded by Spring
        // rather than concatenated into the header by hand.
        ContentDisposition disposition = ContentDisposition.inline()
            .filename(doc.getFileName(), StandardCharsets.UTF_8)
            .build();
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_PDF)
            .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
            .body(resource);
    }
}
