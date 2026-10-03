# API reference

Base path: `/api`

All endpoints except login require a bearer token:

```
Authorization: Bearer <token>
```

Errors share a single shape:

```json
{
  "timestamp": "2026-08-25T17:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Only PDF files are accepted. Detected type: text/plain",
  "path": "/api/documents"
}
```

## Authentication

### `POST /api/auth/login`

Public. Exchanges credentials for a token.

Request:

```json
{ "email": "admin@edds.local", "password": "admin123" }
```

Response `200`:

```json
{
  "token": "eyJhbGciOiJI...",
  "user": { "id": 1, "name": "Admin User", "email": "admin@edds.local", "role": "ADMIN" }
}
```

Wrong credentials return `401`.

## Documents

### `GET /api/documents`

Any authenticated user. Dynamic search with optional filters.

| Query param | Type   | Description                                  |
| ----------- | ------ | -------------------------------------------- |
| `search`    | string | Case insensitive match on subject            |
| `type`      | enum   | `CIRCULAR`, `ORDER` or `NOTIFICATION`        |
| `branch`    | number | Branch id                                    |
| `startDate` | date   | Inclusive lower bound, `YYYY-MM-DD`          |
| `endDate`   | date   | Inclusive upper bound, `YYYY-MM-DD`          |
| `page`      | number | Zero based page index, default `0`           |
| `size`      | number | Page size, default `9`, capped at `50`       |

Response `200`:

```json
{
  "content": [
    {
      "id": 12,
      "subject": "Revised guidelines for annual maintenance shutdown windows",
      "docType": "CIRCULAR",
      "branchId": 1,
      "branchName": "Operations",
      "branchCode": "OPS",
      "issueDate": "2026-08-20",
      "fileName": "OPS-CIRCULAR-12.pdf",
      "isActive": true
    }
  ],
  "page": 0,
  "size": 9,
  "totalElements": 24,
  "totalPages": 3
}
```

### `POST /api/documents`

Admin only. Multipart form upload.

| Field       | Type   | Notes                                 |
| ----------- | ------ | ------------------------------------- |
| `subject`   | string | Required                              |
| `docType`   | enum   | Required                              |
| `branchId`  | number | Required, must exist                  |
| `issueDate` | date   | Required, `YYYY-MM-DD`                |
| `file`      | file   | Required, must be a real PDF, max 10MB |

Response `201` returns the created document. Non PDF files return `400`. A non
admin caller returns `403`.

### `DELETE /api/documents/{id}`

Admin only. Retires a document via soft delete. Response `204`.

### `GET /api/documents/{id}/view`

Any authenticated user. Streams the file inline as `application/pdf`. Returns
`404` if the document is missing or has been retired.

## Branches

### `GET /api/branches`

Any authenticated user. Returns the branch master list.

```json
[
  { "id": 1, "name": "Operations", "code": "OPS" },
  { "id": 2, "name": "Human Resources", "code": "HR" }
]
```

## Health

### `GET /actuator/health`

Public. Returns `{"status":"UP"}` when the API and its database are reachable.
Used as the hosting platform's health check. No other actuator endpoints are
exposed, and no internal details are included.

## Status codes

| Code | Meaning                                                              |
| ---- | -------------------------------------------------------------------- |
| 200  | Success                                                              |
| 201  | Document created                                                     |
| 204  | Document retired                                                     |
| 400  | Invalid input: wrong file type, file over 10 MB, missing field, or an invalid parameter value such as `type=MEMO` |
| 401  | Missing, invalid or expired token, or bad credentials                |
| 403  | Authenticated but lacking the required role                          |
| 404  | Document not found or retired, or no endpoint at that path           |
| 405  | HTTP method not supported on that path                               |
| 413  | Request larger than the multipart limit                              |
| 500  | Unexpected server error; details are logged, not returned            |
