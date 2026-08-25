package com.edds.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * The specification executor is what lets a single query method serve every
 * combination of optional filters the search endpoint accepts.
 */
public interface DocumentRepository
    extends JpaRepository<Document, Long>, JpaSpecificationExecutor<Document> {
}
