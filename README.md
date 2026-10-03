# Enterprise Document Distribution System

[![CI](https://github.com/danishxvi/enterprise-document-distribution-system/actions/workflows/ci.yml/badge.svg)](https://github.com/danishxvi/enterprise-document-distribution-system/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-007CC3.svg)](LICENSE)

A secure, searchable portal for distributing internal enterprise documents:
circulars, orders and notifications. It replaces scattered email threads and
shared drives with a single source of truth, where administrators publish
documents once and employees can always find them again.

**Live demo:** [ddep.netlify.app](https://ddep.netlify.app/) (runs on seeded demo
data, see [demo accounts](#demo-accounts) to sign in)

## Contents

- [What it does](#what-it-does)
- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [Run it locally](#run-it-locally)
- [Demo accounts](#demo-accounts)
- [Documentation](#documentation)
- [Contributing](#contributing)

## What it does

- **Publish** circulars, orders and notifications through a validated upload form.
- **Search** the whole library by free text, type, branch and date range, with
  server side pagination.
- **Read in place** through a document viewer, without downloading files or
  losing your position in the list.
- **Control access** with role based authentication: administrators publish and
  retire documents, employees read.
- **Stay secure** with JWT sessions, real file type verification, payload limits
  and documents streamed through authenticated endpoints rather than public urls.

The interface follows a clean corporate style built from one blue and white:
full width page banners, rounded bordered cards, and a split screen sign in.

## Tech stack

| Layer    | Technology                                               |
| -------- | -------------------------------------------------------- |
| Frontend | React 18, Vite, Tailwind CSS, React Query, React Router  |
| Backend  | Java 21, Spring Boot 3, Spring Security, Spring Data JPA |
| Data     | MySQL (H2 in memory for local runs and tests)            |
| Security | JWT, BCrypt, Apache Tika content detection               |
| Quality  | JUnit 5, MockMvc, ESLint, GitHub Actions CI              |
| Delivery | Docker, Docker Compose, Netlify, Render                  |

## Repository layout

```
enterprise-document-distribution-system/
├── .github/workflows/   CI: backend tests, frontend lint and build
├── backend/             Spring Boot REST API (Maven Wrapper included)
├── frontend/            React single page application
├── docs/                Problem, solution, architecture, API, setup, deployment
├── docker-compose.yml   MySQL, API and frontend in one command
├── netlify.toml         Frontend deploy config
└── render.yaml          Backend deploy blueprint
```

## Run it locally

There are three ways to run the project, from fastest to most complete. Pick
one; you do not need all three.

| Path | What you get | You need |
| ---- | ------------ | -------- |
| [A. Frontend only](#a-frontend-only-about-2-minutes) | The full interface on built in demo data | Node.js 20+ |
| [B. Frontend and backend](#b-frontend-and-backend) | Real API, real uploads, in memory database | Node.js 20+, Java 21 |
| [C. Docker Compose](#c-full-stack-with-docker) | Everything including MySQL, like production | Docker |

### Step 0: Clone the repository

```bash
git clone https://github.com/danishxvi/enterprise-document-distribution-system.git
cd enterprise-document-distribution-system
```

### A. Frontend only (about 2 minutes)

The web client ships with a mock API and seeded documents, so it runs with no
backend at all.

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 and continue with the [tour](#take-the-tour).

Uploads and deletes in this mode are saved in your browser's local storage, so
they survive a refresh. Clear site data to reset to the seeded documents.

### B. Frontend and backend

**1. Start the API.** It uses an in memory H2 database and seeds the branches
and demo accounts on startup, so nothing else needs installing. Maven is not
required either; the bundled wrapper downloads it on first run.

```bash
cd backend
./mvnw spring-boot:run        # on Windows: mvnw.cmd spring-boot:run
```

Wait for `Started EddsApplication` in the log. Check it is up:

```bash
curl http://localhost:8080/actuator/health
```

You should see `{"status":"UP"}`.

**2. Point the frontend at it.** In a second terminal:

```bash
cd frontend
cp .env.example .env.local    # on Windows: copy .env.example .env.local
```

Open `frontend/.env.local` and set:

```
VITE_USE_MOCK=false
```

**3. Start the frontend.**

```bash
npm install
npm run dev
```

The Vite dev server forwards `/api` to `http://localhost:8080`, so there is no
CORS setup to do. The H2 database starts empty of documents, so sign in as the
admin and publish a PDF first.

Data lives in memory and is cleared when the API stops. Uploaded files are
written to `backend/uploads/`.

### C. Full stack with Docker

Runs MySQL, the API and the nginx served frontend together:

```bash
docker compose up --build
```

Open http://localhost:8088. Data persists in Docker volumes between restarts.
Stop with `docker compose down`, or `docker compose down -v` to also wipe the
database and uploaded files.

### Take the tour

Once the app is running, this walks through every feature.

1. **Sign in as an employee.** On the sign in page, click the *Employee* demo
   account (or type the credentials below) and press *Sign in*. You land on the
   document library.
2. **Search and filter.** Type a word such as `safety` into the search box; the
   list updates once you stop typing. Narrow further with *Document type*,
   *Branch* and the date range. *Clear* resets everything.
3. **Read a document.** Click *View document* on any card. It opens in a viewer
   on top of the list. Close it with the X or the Escape key.
4. **Notice what is missing.** Employees have no *Admin* tab. Visiting
   `/admin` directly sends you back to the library, and the API would reject the
   request with `403` anyway.
5. **Sign out and sign in as the admin.** You land on the admin console.
6. **Publish a document.** Fill in a subject, type, issue date and branch,
   attach a PDF up to 10 MB, and press *Publish document*. Try attaching a non
   PDF to see it rejected. With the real backend, the server inspects the file
   bytes, so even a renamed file is caught.
7. **Retire a document.** Click the bin icon on a card and confirm. It disappears
   for every reader. The row is kept in the database for audit.

### Run the checks

These are the same checks CI runs on every push.

```bash
cd backend && ./mvnw verify          # 15 tests: auth, access rules, uploads, search
cd frontend && npm run lint && npm run build
```

### Troubleshooting

| Problem | Fix |
| ------- | --- |
| `Port 8080 is already in use` | Stop the other process, or run `./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8081` and change the proxy target in `frontend/vite.config.js` to match. |
| `Port 5173 is already in use` | Vite picks the next free port automatically; use the url it prints. |
| `./mvnw: Permission denied` | Run `chmod +x mvnw` once, or call `sh mvnw ...`. |
| `release version 21 not supported` | The backend needs Java 21. Check with `java -version`. |
| Frontend shows *Could not load documents* | The API is not running or `VITE_USE_MOCK` is still `true` while you expect real data. Restart `npm run dev` after editing `.env.local`. |
| Sign in works, then you are sent back to sign in | The token expired or the API restarted with a new in memory database. Sign in again. |

## Demo accounts

| Role     | Email               | Password    |
| -------- | ------------------- | ----------- |
| Admin    | admin@edds.local    | admin123    |
| Employee | employee@edds.local | employee123 |

These exist for evaluation only. Change them, or remove the seeder, before any
real deployment.

## Documentation

- [Problem statement](docs/PROBLEM_STATEMENT.md): why the system exists
- [Proposed solution](docs/PROPOSED_SOLUTION.md): the approach and design principles
- [Architecture](docs/ARCHITECTURE.md): request flows, package layout, design system
- [Database](docs/DATABASE.md): tables, indexes and reference SQL
- [API reference](docs/API.md): every endpoint, parameter and status code
- [Setup guide](docs/SETUP.md): environment variables and every run option
- [Deployment](docs/DEPLOYMENT.md): Netlify, Render and container hosting

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Released under the MIT License. See [LICENSE](LICENSE).
