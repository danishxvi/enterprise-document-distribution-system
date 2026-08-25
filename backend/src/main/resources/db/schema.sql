-- Reference schema for the Enterprise Document Distribution System.
--
-- The running application generates this structure from the JPA entities, so
-- this file is not executed automatically. It is here to document the schema
-- and to support manual database setup or review.

CREATE TABLE IF NOT EXISTS users (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS branches (
    id   BIGINT       NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20)  NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_branches_name (name),
    UNIQUE KEY uk_branches_code (code)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS documents (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    subject    VARCHAR(500) NOT NULL,
    doc_type   VARCHAR(20)  NOT NULL,
    branch_id  BIGINT       NOT NULL,
    issue_date DATE         NOT NULL,
    file_path  VARCHAR(255) NOT NULL,
    file_name  VARCHAR(255) NOT NULL,
    is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_documents_branch FOREIGN KEY (branch_id) REFERENCES branches (id)
) ENGINE = InnoDB;

-- The filters exposed by the search endpoint map directly to these indexes.
CREATE INDEX idx_documents_issue_date ON documents (issue_date);
CREATE INDEX idx_documents_branch ON documents (branch_id);
CREATE INDEX idx_documents_type ON documents (doc_type);
