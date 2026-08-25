# Proposed solution

## Overview

The Enterprise Document Distribution System is a web application with a clear
separation between a React frontend, a Spring Boot REST API and a MySQL
database. Every document, whatever its type, is published once into a single
library and retrieved through one dynamic search. Security is enforced at the
layer that can actually be trusted: the server.

## Design principles

### One model for three document types

Circulars, orders and notifications share the same shape: a subject, a branch,
an issue date and a file. Rather than three near identical tables, the system
uses a single `documents` table with a `doc_type` enum. That one decision makes
search simpler, keeps indexes effective, and lets a single endpoint serve every
kind of document.

### The server is the authority

The backend never trusts the client blindly. Roles are checked on the server,
uploads are validated on the server, and documents are streamed by the server.
The frontend enforces the same rules for a good experience, but it is never the
last line of defence.

### One dynamic search, not many queries

A single `GET /api/documents` endpoint accepts optional filters for text, type,
branch and date range. It is built with Spring Data JPA Specifications, so any
combination of filters composes into one query without a bespoke method for each
case. Results are always paginated.

### Files on disk, paths in the database

PDF binaries are stored on disk or object storage; only the file path is kept in
the database. This keeps the table small and queries fast, and it avoids the
performance cost of storing large blobs in MySQL.

### Documents are streamed, not exposed

There are no public file urls. A document is fetched through
`GET /api/documents/{id}/view`, which passes through the security filter and
streams the file back as `application/pdf`. Only authenticated users reach it,
and paths are never guessable.

## Security measures

- **Role based access.** Stateless JWT sessions carry the user role. Publish and
  delete endpoints are restricted to administrators with method level security.
- **Real file type verification.** Apache Tika inspects the actual file header
  bytes to confirm a PDF, so a renamed script cannot slip through.
- **Payload limits.** Uploads are capped, both in Spring's multipart config and
  again in the service, to prevent oversized files from exhausting storage.
- **Strict pagination.** Page size is clamped to a maximum, so a caller can never
  request an unbounded result set.
- **Hashed passwords.** Credentials are stored as BCrypt hashes, never in the
  clear.

## Architecture at a glance

| Layer        | Responsibility                                            | Technology                    |
| ------------ | -------------------------------------------------------- | ----------------------------- |
| Presentation | Responsive UI, caching, client routing                   | React, Vite, Tailwind, React Query |
| Application  | REST endpoints, authentication, business rules           | Spring Boot, Spring Security  |
| Domain       | Entities, dynamic search, pagination                     | Spring Data JPA               |
| Storage      | Indexed metadata and file persistence                    | MySQL, file storage           |

For the detailed component and data design, see
[ARCHITECTURE.md](ARCHITECTURE.md) and [DATABASE.md](DATABASE.md).

## Why these choices

- **React with Vite** gives fast local development and a small, fast production
  bundle.
- **React Query** caches document lists and deduplicates requests, so paging and
  revisiting feels instant.
- **Spring Boot** provides a mature, well understood platform for secure REST
  services.
- **JPA Specifications** keep the search flexible without hand written SQL.
- **MySQL with targeted indexes** on date, branch and type keeps filters quick
  even as the library grows into tens of thousands of records.
