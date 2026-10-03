# Setup guide

This is the reference for configuring and running the project. For a guided,
step by step first run, start with the
[local walkthrough in the README](../README.md#run-it-locally).

## Prerequisites

| Tool | Version | Needed for |
| ---- | ------- | ---------- |
| Node.js and npm | 20 or newer | The frontend |
| Java (JDK) | 21 | The backend |
| Docker and Docker Compose | Recent | Optional, for the full stack |
| MySQL | 8 | Optional, to run the backend against MySQL directly |

Maven does not need to be installed. The backend includes the Maven Wrapper
(`mvnw` on macOS and Linux, `mvnw.cmd` on Windows), which downloads the right
Maven version on first use. Examples below use `./mvnw`; on Windows substitute
`mvnw.cmd`.

## Run options

### Frontend only, on mock data

```bash
cd frontend
npm install
npm run dev
```

Serves http://localhost:5173 with a built in mock API and seeded documents.

### Backend on H2

```bash
cd backend
./mvnw spring-boot:run
```

Serves the API at http://localhost:8080 using an in memory H2 database. On
startup it seeds six branches and the two demo accounts. Data is lost when the
process stops.

Quick check:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@edds.local","password":"admin123"}'
```

### Frontend against the local backend

With the backend running, create `frontend/.env.local` from `.env.example` and
set `VITE_USE_MOCK=false`, then run `npm run dev`. The Vite dev server proxies
`/api` to `http://localhost:8080`, so no CORS configuration is needed.

### Full stack with Docker

```bash
docker compose up --build
```

| Service  | Address                 |
| -------- | ----------------------- |
| Frontend | http://localhost:8088   |
| API      | http://localhost:8080   |
| MySQL    | localhost:3307          |

`docker compose down -v` removes the database and uploaded files.

### Backend on a local MySQL

Create the database and user:

```sql
CREATE DATABASE edds;
CREATE USER 'edds'@'%' IDENTIFIED BY 'edds';
GRANT ALL PRIVILEGES ON edds.* TO 'edds'@'%';
```

Run with the `mysql` profile:

```bash
cd backend
SPRING_PROFILES_ACTIVE=mysql \
DB_URL="jdbc:mysql://localhost:3306/edds?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true" \
DB_USERNAME=edds DB_PASSWORD=edds \
./mvnw spring-boot:run
```

Hibernate creates the tables on first start. The reference schema is in
[DATABASE.md](DATABASE.md).

## Environment variables

### Backend

| Variable                 | Default                 | Purpose                                     |
| ------------------------ | ----------------------- | ------------------------------------------- |
| `SPRING_PROFILES_ACTIVE` | `h2`                    | `h2` (in memory) or `mysql`                 |
| `PORT`                   | `8080`                  | HTTP port; set automatically by Render      |
| `DB_URL`                 | local MySQL url         | JDBC url, used by the `mysql` profile       |
| `DB_USERNAME`            | `edds`                  | Database user                               |
| `DB_PASSWORD`            | `edds`                  | Database password                           |
| `EDDS_JWT_SECRET`        | development value       | JWT signing secret, at least 32 characters  |
| `EDDS_JWT_EXPIRATION_MS` | `86400000` (24 hours)   | Token lifetime in milliseconds              |
| `EDDS_STORAGE_LOCATION`  | `uploads`               | Directory where PDF files are written       |
| `EDDS_CORS_ORIGINS`      | `http://localhost:5173` | Comma separated list of allowed origins     |

The maximum upload size is 10 MB, set by `edds.storage.max-file-size` and the
Spring multipart limits in `application.yml`.

### Frontend

These are read at build time, so restart `npm run dev` or rebuild after
changing them.

| Variable            | Default | Purpose                                   |
| ------------------- | ------- | ----------------------------------------- |
| `VITE_USE_MOCK`     | `true`  | Use the built in mock API instead of the backend |
| `VITE_API_BASE_URL` | `/api`  | Base url of the REST API                  |

## Tests and checks

```bash
# Backend: compiles and runs all tests on H2, no external services needed
cd backend
./mvnw verify

# Frontend: lint with zero warnings allowed, then a production build
cd frontend
npm run lint
npm run build
```

The backend suite covers:

- **JWT** issuing and validation, including expired, tampered and foreign tokens.
- **Authentication**: successful login, wrong password, missing token.
- **Authorisation**: employees blocked from uploading and retiring.
- **Upload validation**: a renamed non PDF rejected by content inspection.
- **Lifecycle**: publish, find through search and filters, stream the file,
  retire, and confirm it is gone.
- **Input handling**: invalid filter values return 400, page size is capped.

GitHub Actions runs the same commands on every push and pull request.

## Production builds

```bash
cd frontend && npm run build            # static files in frontend/dist
cd backend && ./mvnw clean package      # runnable jar at backend/target/edds-backend.jar
```
