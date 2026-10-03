# Architecture

## System overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (React)                       │
│   Login · Employee dashboard · Admin console · Info pages    │
└───────────────┬─────────────────────────────────────────────┘
                │  HTTPS, JWT bearer token
                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Spring Boot REST API                       │
│                                                              │
│  Security filter → Controllers → Services → Repositories     │
│                                                              │
│   AuthController      DocumentController     BranchController │
│   JwtAuthFilter       DocumentService        FileStorage     │
└───────────────┬───────────────────────────┬─────────────────┘
                │                           │
                ▼                           ▼
        ┌───────────────┐          ┌──────────────────┐
        │  MySQL         │          │  File storage    │
        │  users         │          │  uploads/*.pdf   │
        │  branches      │          └──────────────────┘
        │  documents     │
        └───────────────┘
```

## Request flow

### Signing in

1. The browser posts email and password to `POST /api/auth/login`.
2. Spring Security authenticates against the BCrypt hash in the `users` table.
3. On success the API returns a signed JWT and a small user profile.
4. The frontend stores the token and attaches it as a bearer header on every
   later request.

### Reading documents

1. The employee dashboard calls `GET /api/documents` with the active filters.
2. `JwtAuthenticationFilter` validates the token and sets the security context.
3. `DocumentService` composes the optional filters into a JPA Specification and
   runs a paginated, sorted query.
4. Results are mapped to `DocumentResponse` records and returned as a compact
   page envelope.
5. React Query caches the result per filter and page combination.

### Publishing a document

1. The admin console submits a multipart form to `POST /api/documents`.
2. Method security confirms the caller has the `ADMIN` role.
3. `FileStorageService` reads the real file header with Apache Tika, rejects
   anything that is not a PDF, checks the size, and writes the file under a
   random name.
4. `DocumentService` persists the metadata row referencing the stored file.

### Viewing a file

1. The viewer requests `GET /api/documents/{id}/view`.
2. The request passes through the security filter, so only authenticated users
   reach it.
3. The service loads the file as a resource, confined to the storage directory,
   and streams it back as `application/pdf`.

## Backend package structure

```
com.edds
├── EddsApplication            Application entry point
├── auth                       Login endpoint and DTOs
├── branch                     Branch entity, repository, controller
├── common                     Shared DTOs and exception handling
├── config                     Startup data seeding
├── document                   Document entity, search, service, controller
│   └── dto                    API response shapes
├── security                   JWT, filters, user details, security config
├── storage                    File validation, storage and streaming
└── user                       User entity, role, repository
```

Tests live under `backend/src/test` and mirror the same packages:
`security/JwtServiceTest` for token handling, and
`document/DocumentApiIntegrationTest`, which drives the real HTTP layer with
MockMvc against H2.

### Error handling

`GlobalExceptionHandler` turns every failure into the same JSON shape
(`timestamp`, `status`, `error`, `message`, `path`). Client mistakes such as an
unknown path, an invalid enum value or a missing form field map to 4xx codes.
Only unexpected failures return 500, and those are logged with a stack trace
because the response body deliberately hides internal detail.

## Frontend structure

```
src
├── components
│   ├── ui                     Button, Card, Input, Select, Badge, Modal, Notice, ...
│   ├── layout                 Navbar, Footer, Layout, Logo, Container, PageHero
│   ├── documents              DocumentCard, FilterBar, Pagination, PdfViewerModal
│   └── RouteGuards.jsx        Protected and admin only routes
├── context                    AuthContext (session state)
├── lib                        api client, constants, mock data, hooks, helpers
└── pages                      Home, Login, dashboards, info pages, 404
```

`lib/api.js` exposes the same functions in two implementations, a mock one
backed by local storage and a real one backed by axios, and the
`VITE_USE_MOCK` flag picks one at build time. The real client attaches the
bearer token on each request and, on a 401 from an expired session, clears it
and returns the user to sign in.

## Design system

The interface uses a corporate style built from exactly two colours: one blue
and white. Every value in the `brand` palette in `tailwind.config.js` is a tint
or shade of the same blue (`brand-500`, `#007CC3`), used for text, borders and
backgrounds alike, so no other hue appears anywhere.

- **Page banners.** Each page opens with a full width blue `PageHero`. On the
  dashboards, the first white panel overlaps the bottom of the banner to tie the
  header to the content.
- **Rounded, boxy surfaces.** Content sits in white cards with a thin blue
  border and large corner radius. Interactive cards firm their border and lift
  slightly on hover.
- **Type without extra colours.** The three document types are distinguished by
  fill: circulars are solid blue, orders are a blue tint, notifications are
  outlined.
- **Errors without red.** Error notices use a stronger blue border, bold text and
  an icon, so problems stand out while staying inside the palette.

Shared recipes such as `.field` (inputs and selects) and `.icon-tile` live in
`src/index.css`, and `buttonClasses()` lets router links render exactly like
buttons.

## Key decisions and trade offs

- **JWT over server sessions.** Keeps the API stateless and easy to scale, at the
  cost of not being able to revoke a token before it expires. Acceptable for the
  session lengths used here.
- **Soft delete for documents.** Retiring a document sets a flag rather than
  removing the row, preserving an audit trail. The file is kept but drops out of
  every reader facing query.
- **Files on disk, not in the database.** Faster and cheaper than blobs, at the
  cost of needing a persistent volume or object store in production.
- **Mock mode in the frontend.** The client ships with seeded data and a mock API
  so it can be demoed and deployed without a backend, then switched to the real
  API with one environment variable.
