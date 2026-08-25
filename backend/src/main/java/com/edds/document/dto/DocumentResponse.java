package com.edds.document.dto;

import com.edds.document.Document;
import java.time.LocalDate;

/**
 * The shape the frontend consumes. Mapping to a record here keeps JPA entities
 * out of the API layer, so lazy associations and internal fields never leak.
 */
public record DocumentResponse(
    Long id,
    String subject,
    String docType,
    Long branchId,
    String branchName,
    String branchCode,
    LocalDate issueDate,
    String fileName,
    boolean isActive
) {
    public static DocumentResponse from(Document doc) {
        return new DocumentResponse(
            doc.getId(),
            doc.getSubject(),
            doc.getDocType().name(),
            doc.getBranch().getId(),
            doc.getBranch().getName(),
            doc.getBranch().getCode(),
            doc.getIssueDate(),
            doc.getFileName(),
            doc.isActive()
        );
    }
}
