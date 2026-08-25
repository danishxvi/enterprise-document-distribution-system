# Database

The schema is intentionally small: three tables that cover accounts, the branch
master list, and the documents themselves. Hibernate generates it from the JPA
entities, and the reference SQL below documents the same structure for anyone
reading the database directly.

## Tables

### `users`

Accounts that can sign in. Passwords are stored only as BCrypt hashes.

| Column          | Type         | Notes                          |
| --------------- | ------------ | ------------------------------ |
| `id`            | BIGINT       | Primary key, auto increment    |
| `name`          | VARCHAR      | Display name                   |
| `email`         | VARCHAR      | Unique, used to sign in        |
| `password_hash` | VARCHAR      | BCrypt hash, never plain text  |
| `role`          | VARCHAR(20)  | `ADMIN` or `EMPLOYEE`          |

### `branches`

The department master list that documents are filed under.

| Column | Type        | Notes                       |
| ------ | ----------- | --------------------------- |
| `id`   | BIGINT      | Primary key, auto increment |
| `name` | VARCHAR     | Unique department name      |
| `code` | VARCHAR(20) | Unique short code           |

### `documents`

One row per distributed document. Only the file path is stored, never the file
bytes.

| Column       | Type         | Notes                                       |
| ------------ | ------------ | ------------------------------------------- |
| `id`         | BIGINT       | Primary key, auto increment                 |
| `subject`    | VARCHAR(500) | Document title                              |
| `doc_type`   | VARCHAR(20)  | `CIRCULAR`, `ORDER` or `NOTIFICATION`       |
| `branch_id`  | BIGINT       | Foreign key to `branches`                   |
| `issue_date` | DATE         | The date printed on the document            |
| `file_path`  | VARCHAR      | Stored file name on disk or object storage  |
| `file_name`  | VARCHAR      | Original file name, shown to users          |
| `is_active`  | BOOLEAN      | False once retired via soft delete          |
| `created_at` | TIMESTAMP    | When the row was created                    |

## Indexes

The filters offered by the search endpoint map directly to these indexes, which
keeps queries fast as the table grows:

- `idx_documents_issue_date` on `issue_date`
- `idx_documents_branch` on `branch_id`
- `idx_documents_type` on `doc_type`

## Why a single documents table

Circulars, orders and notifications share identical metadata. A single table
with a `doc_type` enum, rather than three separate tables, means:

- one endpoint and one query path serve every document type,
- filtering by type is a simple indexed column comparison,
- adding a fourth document type later is a one line enum change.

## Reference SQL

The same schema, written out for MySQL, is in
[`backend/src/main/resources/db/schema.sql`](../backend/src/main/resources/db/schema.sql).
It is provided for documentation and manual setup; the running application does
not require it, since JPA manages the schema.
