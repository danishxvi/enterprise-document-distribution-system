# Enterprise Document Distribution System

A secure, searchable portal for distributing internal enterprise documents:
circulars, orders and notifications. It replaces scattered email threads and
shared drives with a single source of truth, where administrators publish
documents once and employees can always find them again.

The interface uses a soft, tactile "neumorphic" design so a plain internal tool
still feels considered and calm to use.

## What it does

- **Publish** circulars, orders and notifications through a validated upload form.
- **Search** the whole library by free text, type, branch and date range, with
  fast pagination.
- **Read in place** through a document viewer, without downloading files or
  losing your position in the list.
- **Control access** with role based authentication: administrators publish and
  retire documents, employees read.
- **Stay secure** with JWT sessions, real file type verification, payload limits
  and documents streamed through authenticated endpoints rather than public urls.

## Tech stack

| Layer      | Technology                                             |
| ---------- | ------------------------------------------------------ |
| Frontend   | React, Vite, Tailwind CSS, React Query, React Router   |
| Backend    | Java 21, Spring Boot 3, Spring Security, Spring Data JPA |
| Data       | MySQL (H2 for local and tests)                         |
| Security   | JWT, BCrypt, Apache Tika content detection             |
| Delivery   | Docker, Docker Compose, Netlify, Render                |

## Repository layout

```
enterprise-document-distribution-system/
├── frontend/        React single page application
├── backend/         Spring Boot REST API
├── docs/            Problem, solution, architecture, API and setup docs
├── docker-compose.yml
├── netlify.toml     Frontend deploy config
└── render.yaml      Full stack deploy blueprint
```

## Quick start

The frontend runs on its own with built in mock data, so you can see the whole
interface without a backend or database.

### Frontend only (mock data)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Sign in with the demo buttons on the login screen.

### Full stack with Docker

Runs MySQL, the API and the frontend together:

```bash
docker compose up --build
```

Open http://localhost:8088.

### Backend on its own

```bash
cd backend
mvn spring-boot:run
```

The API starts on http://localhost:8080 using an in memory H2 database, seeded
with the branches and two demo accounts.

## Demo accounts

| Role     | Email                | Password     |
| -------- | -------------------- | ------------ |
| Admin    | admin@edds.local     | admin123     |
| Employee | employee@edds.local  | employee123  |

These are for evaluation only. Change them before any real deployment.

## Documentation

- [Problem statement](docs/PROBLEM_STATEMENT.md)
- [Proposed solution](docs/PROPOSED_SOLUTION.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Database](docs/DATABASE.md)
- [API reference](docs/API.md)
- [Setup guide](docs/SETUP.md)
- [Deployment](docs/DEPLOYMENT.md)

## License

Released under the MIT License. See [LICENSE](LICENSE).
