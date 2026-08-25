package com.edds.storage;

import com.edds.common.BadRequestException;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Owns everything to do with the PDF bytes: verifying an upload is genuinely a
 * PDF, writing it to disk under a random name, and reading it back for the
 * streaming endpoint.
 *
 * The type check reads the actual file header with Apache Tika rather than
 * trusting the client supplied content type or the file extension, so a
 * renamed script cannot slip through as a PDF.
 */
@Service
public class FileStorageService {

    private static final String PDF_MIME = "application/pdf";

    private final Tika tika = new Tika();
    private final Path root;

    public FileStorageService(@Value("${edds.storage.location:uploads}") String location) {
        this.root = Paths.get(location).toAbsolutePath().normalize();
    }

    @PostConstruct
    void init() {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new IllegalStateException("Could not create the storage directory", e);
        }
    }

    /**
     * Validates and stores an uploaded PDF, returning the relative path to save
     * against the document row.
     */
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("A file is required.");
        }

        String detected;
        try (InputStream in = file.getInputStream()) {
            // Tika sniffs the leading bytes, so this reflects the real content.
            detected = tika.detect(in);
        } catch (IOException e) {
            throw new BadRequestException("The uploaded file could not be read.");
        }

        if (!PDF_MIME.equalsIgnoreCase(detected)) {
            throw new BadRequestException(
                "Only PDF files are accepted. Detected type: " + detected);
        }

        String storedName = UUID.randomUUID() + ".pdf";
        Path target = root.resolve(storedName);
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store the file.", e);
        }
        return storedName;
    }

    /**
     * Loads a stored file as a readable resource for streaming. The path is
     * resolved and confined to the storage root so a crafted value cannot
     * escape the directory.
     */
    public Resource loadAsResource(String storedName) {
        Path target = root.resolve(storedName).normalize();
        if (!target.startsWith(root)) {
            throw new BadRequestException("Invalid file path.");
        }
        try {
            Resource resource = new UrlResource(target.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new BadRequestException("The file is missing from storage.");
            }
            return resource;
        } catch (IOException e) {
            throw new BadRequestException("The file could not be loaded.");
        }
    }

    public void delete(String storedName) {
        try {
            Path target = root.resolve(storedName).normalize();
            if (target.startsWith(root)) {
                Files.deleteIfExists(target);
            }
        } catch (IOException e) {
            // A missing file on delete is not worth failing the request over.
        }
    }
}
