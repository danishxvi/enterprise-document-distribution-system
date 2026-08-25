# Setup guide

## Prerequisites

- Node.js 20 or newer, and npm
- Java 21 (JDK)
- Maven 3.9 or newer
- Optional: Docker and Docker Compose for the full stack
- Optional: MySQL 8 if you want to run against MySQL directly

## Option 1: Frontend only (fastest)

The frontend ships with mock data, so no backend is needed to see everything.

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 and use the demo login buttons.

## Option 2: Backend on H2

The default profile uses an in memory H2 database, seeded on startup.

```bash
cd backend
mvn spring-boot:run
```

The API runs at http://localhost:8080. Try it:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@edds.local","password":"admin123"}'
```

## Option 3: Frontend against the live backend

Run the backend (option 2), then point the frontend at it:

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:

```
VITE_USE_MOCK=false
VITE_API_BASE_URL=/api
```

The Vite dev server proxies `/api` to `http://localhost:8080`, so no CORS setup
is needed for local development. Start the frontend with `npm run dev`.

## Option 4: Full stack with Docker

Runs MySQL, the API and the nginx served frontend together:

```bash
docker compose up --build
```

Open http://localhost:8088. Stop with `docker compose down`, or
`docker compose down -v` to also clear the database and uploaded files.

## Option 5: Backend on a real MySQL

Create the database and user, then run with the `mysql` profile:

```sql
CREATE DATABASE edds;
CREATE USER 'edds'@'%' IDENTIFIED BY 'edds';
GRANT ALL PRIVILEGES ON edds.* TO 'edds'@'%';
```

```bash
cd backend
SPRING_PROFILES_ACTIVE=mysql \
DB_URL="jdbc:mysql://localhost:3306/edds?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true" \
DB_USERNAME=edds DB_PASSWORD=edds \
mvn spring-boot:run
```

## Environment variables

### Backend

| Variable                | Default                       | Purpose                          |
| ----------------------- | ----------------------------- | -------------------------------- |
| `SPRING_PROFILES_ACTIVE`| `h2`                          | `h2` or `mysql`                  |
| `DB_URL`                | local MySQL url               | JDBC url (mysql profile)         |
| `DB_USERNAME`           | `edds`                        | Database user                    |
| `DB_PASSWORD`           | `edds`                        | Database password                |
| `EDDS_JWT_SECRET`       | dev value                     | JWT signing secret, set in prod  |
| `EDDS_JWT_EXPIRATION_MS`| `86400000`                    | Token lifetime in milliseconds   |
| `EDDS_STORAGE_LOCATION` | `uploads`                     | Where PDF files are written      |
| `EDDS_CORS_ORIGINS`     | `http://localhost:5173`       | Allowed frontend origins         |

### Frontend

| Variable             | Default | Purpose                                  |
| -------------------- | ------- | ---------------------------------------- |
| `VITE_USE_MOCK`      | `true`  | Use built in mock data instead of the API |
| `VITE_API_BASE_URL`  | `/api`  | Base url for the REST API                |

## Running the tests

```bash
cd backend
mvn test
```

This runs a context load smoke test on the H2 profile, needing no external
services.

## Building for production

```bash
# Frontend static bundle
cd frontend && npm run build   # output in frontend/dist

# Backend runnable jar
cd backend && mvn clean package  # output at backend/target/edds-backend.jar
```
