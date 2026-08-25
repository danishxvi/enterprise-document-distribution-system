package com.edds.document;

import java.time.LocalDate;
import org.springframework.data.jpa.domain.Specification;

/**
 * Builds the dynamic search predicate. Each filter is optional: a null value
 * simply contributes no restriction. Composing them with {@code and} means one
 * endpoint handles any mix of type, branch, date range and free text without a
 * bespoke query for each case.
 */
public final class DocumentSpecifications {

    private DocumentSpecifications() {
    }

    public static Specification<Document> onlyActive() {
        return (root, query, cb) -> cb.isTrue(root.get("active"));
    }

    public static Specification<Document> hasType(DocType type) {
        if (type == null) {
            return null;
        }
        return (root, query, cb) -> cb.equal(root.get("docType"), type);
    }

    public static Specification<Document> hasBranch(Long branchId) {
        if (branchId == null) {
            return null;
        }
        return (root, query, cb) -> cb.equal(root.get("branch").get("id"), branchId);
    }

    public static Specification<Document> issuedFrom(LocalDate start) {
        if (start == null) {
            return null;
        }
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("issueDate"), start);
    }

    public static Specification<Document> issuedUntil(LocalDate end) {
        if (end == null) {
            return null;
        }
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("issueDate"), end);
    }

    public static Specification<Document> subjectContains(String search) {
        if (search == null || search.isBlank()) {
            return null;
        }
        String pattern = "%" + search.trim().toLowerCase() + "%";
        return (root, query, cb) -> cb.like(cb.lower(root.get("subject")), pattern);
    }
}
