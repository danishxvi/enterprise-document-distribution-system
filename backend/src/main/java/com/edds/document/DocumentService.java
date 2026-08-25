package com.edds.document;

import com.edds.branch.Branch;
import com.edds.branch.BranchRepository;
import com.edds.common.BadRequestException;
import com.edds.common.NotFoundException;
import com.edds.common.PageResponse;
import com.edds.document.dto.DocumentResponse;
import com.edds.storage.FileStorageService;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * The business rules for documents. Controllers stay thin and delegate here so
 * the same logic could be reused by, say, a scheduled import without going
 * through HTTP.
 */
@Service
public class DocumentService {

    /** A hard ceiling so a caller can never request an unbounded page. */
    private static final int MAX_PAGE_SIZE = 50;

    private final DocumentRepository documents;
    private final BranchRepository branches;
    private final FileStorageService storage;

    public DocumentService(
        DocumentRepository documents,
        BranchRepository branches,
        FileStorageService storage
    ) {
        this.documents = documents;
        this.branches = branches;
        this.storage = storage;
    }

    @Transactional(readOnly = true)
    public PageResponse<DocumentResponse> search(
        String search,
        DocType type,
        Long branchId,
        LocalDate startDate,
        LocalDate endDate,
        int page,
        int size
    ) {
        // Newest first is the sensible default for a notice board.
        Pageable pageable = PageRequest.of(
            Math.max(page, 0),
            clampSize(size),
            Sort.by(Sort.Direction.DESC, "issueDate")
        );

        Specification<Document> spec = Specification
            .where(DocumentSpecifications.onlyActive())
            .and(DocumentSpecifications.subjectContains(search))
            .and(DocumentSpecifications.hasType(type))
            .and(DocumentSpecifications.hasBranch(branchId))
            .and(DocumentSpecifications.issuedFrom(startDate))
            .and(DocumentSpecifications.issuedUntil(endDate));

        Page<DocumentResponse> result = documents.findAll(spec, pageable)
            .map(DocumentResponse::from);
        return PageResponse.from(result);
    }

    @Transactional
    public DocumentResponse create(
        String subject,
        DocType type,
        Long branchId,
        LocalDate issueDate,
        MultipartFile file
    ) {
        if (subject == null || subject.isBlank()) {
            throw new BadRequestException("Subject is required.");
        }
        if (issueDate == null) {
            throw new BadRequestException("Issue date is required.");
        }
        Branch branch = branches.findById(branchId)
            .orElseThrow(() -> new BadRequestException("Unknown branch."));

        // The file is validated and written first; only then do we persist the
        // row, so we never record a document whose file failed to store.
        String storedName = storage.store(file);

        Document doc = new Document();
        doc.setSubject(subject.trim());
        doc.setDocType(type);
        doc.setBranch(branch);
        doc.setIssueDate(issueDate);
        doc.setFilePath(storedName);
        doc.setFileName(originalName(file));
        doc.setActive(true);

        return DocumentResponse.from(documents.save(doc));
    }

    @Transactional(readOnly = true)
    public Document getActiveEntity(Long id) {
        Document doc = documents.findById(id)
            .orElseThrow(() -> new NotFoundException("Document not found."));
        if (!doc.isActive()) {
            throw new NotFoundException("Document not found.");
        }
        return doc;
    }

    /**
     * Retires a document. This is a soft delete: the row is kept for audit and
     * the file is left in place, but it drops out of every reader facing query.
     */
    @Transactional
    public void retire(Long id) {
        Document doc = documents.findById(id)
            .orElseThrow(() -> new NotFoundException("Document not found."));
        doc.setActive(false);
        documents.save(doc);
    }

    private int clampSize(int size) {
        if (size <= 0) {
            return 9;
        }
        return Math.min(size, MAX_PAGE_SIZE);
    }

    private String originalName(MultipartFile file) {
        String name = file.getOriginalFilename();
        return (name == null || name.isBlank()) ? "document.pdf" : name;
    }
}
