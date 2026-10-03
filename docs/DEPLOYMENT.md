# Deployment

The frontend and backend deploy independently:

| Part | Host | Config file |
| ---- | ---- | ----------- |
| Frontend | Netlify | [`netlify.toml`](../netlify.toml) |
| Backend API | Render (Docker web service) | [`render.yaml`](../render.yaml) |
| Database | Any MySQL 8 host, for example Aiven's free tier | Environment variables on Render |

Render's own managed database is PostgreSQL, so MySQL is provided externally.

The frontend works on its own in mock mode, so the usual order is: deploy the
frontend first, then add the backend and switch the frontend over to it.

## 1. Frontend on Netlify

`netlify.toml` sets the base directory (`frontend`), the build command and the
single page app redirect. Note that `publish` is resolved relative to `base`, so
it is `dist`, not `frontend/dist`.

1. In Netlify choose **Add new site, Import an existing project**, and select
   this repository.
2. Netlify reads `netlify.toml`; no build settings need entering by hand.
3. Deploy. The site runs in mock mode with the demo accounts.

## 2. Database

Any reachable MySQL 8 server works. With Aiven:

1. Create a **MySQL** service on the free plan and wait until it shows
   **Running**.
2. Under **Databases**, create a database named `edds`. If the same service
   already holds another project, this keeps the two sets of tables apart; the
   application only ever creates tables inside the database named in its url.
3. Under the service's **Allowed IP addresses**, make sure `0.0.0.0/0` is
   allowed. Render's free web services do not have fixed outbound addresses, so
   a narrower allowlist blocks them.
4. From **Connection information**, note the host, port, user and password.
   Aiven uses a non standard port, not 3306.

## 3. Backend on Render

`render.yaml` describes a single Docker web service built from
`backend/Dockerfile`, with a generated JWT secret and CORS pre-set to the
Netlify site.

1. In Render choose **New, Blueprint**, select this repository and branch `main`.
2. Render prompts for the three database values:

   | Variable | Value |
   | -------- | ----- |
   | `DB_URL` | `jdbc:mysql://<host>:<port>/edds?useSSL=true&requireSSL=true&verifyServerCertificate=false&serverTimezone=UTC&allowPublicKeyRetrieval=true` |
   | `DB_USERNAME` | the database user, for example `avnadmin` |
   | `DB_PASSWORD` | the database password |

   Replace `<host>` and `<port>` with real values; the placeholders themselves
   are not valid.
3. Apply. The first build takes a few minutes. A healthy start logs
   `Started EddsApplication`, and `https://<service>.onrender.com/actuator/health`
   returns `{"status":"UP"}`.
4. If the frontend lives somewhere other than `https://ddep.netlify.app`, update
   `EDDS_CORS_ORIGINS` on the service to that origin.

The service listens on the `PORT` Render provides. Free services sleep after a
period of inactivity, so the first request after a pause can take around 30
seconds.

## 4. Point the frontend at the backend

In Netlify, under **Site configuration, Environment variables**, add:

```
VITE_USE_MOCK = false
VITE_API_BASE_URL = https://<service>.onrender.com/api
```

Then **Deploys, Trigger deploy, Clear cache and deploy site**. Vite reads these
values at build time, so saving them is not enough without a rebuild.

## Troubleshooting

These are the failures seen while setting up this deployment, and what fixed
them.

| Log message | Cause | Fix |
| ----------- | ----- | --- |
| `Deploy directory 'frontend/frontend/dist' does not exist` (Netlify) | `publish` was written relative to the repo root while `base` was also set | Use `publish = "dist"` |
| `Failed to parse the host:port pair 'HOST:PORT'` (Render) | The template `DB_URL` was saved without real values | Put the actual host and port into `DB_URL` |
| `Communications link failure ... Connect timed out` (Render) | The database is unreachable: wrong port, the service is not running, or the IP allowlist blocks Render | Use the provider's exact port, confirm the service is running, and allow `0.0.0.0/0` |
| `No open ports detected` (Render) | Shown after the app exits on a startup error | Fix the error above it; the port binding itself is correct |
| CORS error in the browser console | `EDDS_CORS_ORIGINS` does not match the frontend origin exactly | Set it to the full origin, with `https://` and no trailing slash |

## Running the backend container elsewhere

```bash
cd backend
docker build -t edds-backend .
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=mysql \
  -e DB_URL="jdbc:mysql://<host>:3306/edds?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true" \
  -e DB_USERNAME=edds -e DB_PASSWORD=<password> \
  -e EDDS_JWT_SECRET="<a long random secret>" \
  -e EDDS_CORS_ORIGINS="https://<your-frontend>" \
  -v edds-uploads:/app/uploads \
  edds-backend
```

## File storage

Uploaded PDFs are written to the backend's local disk. Render's free web
services have an ephemeral filesystem, so files uploaded there disappear on the
next deploy or restart while their database rows remain, and viewing them then
returns an error. For anything beyond a demo, attach a persistent disk to the
service (a paid Render feature) mounted at `/app/uploads`, or adapt
`FileStorageService` to write to an object store such as S3. Only the file path
is stored in the database, so changing the storage backend is a contained
change.

## Production checklist

- [ ] Set a long, random `EDDS_JWT_SECRET` (the blueprint generates one).
- [ ] Change or remove the seeded demo accounts.
- [ ] Restrict `EDDS_CORS_ORIGINS` to the real frontend origin.
- [ ] Give uploads persistent storage, as described above.
- [ ] Use a MySQL host with backups enabled.
- [ ] Serve everything over HTTPS.
- [ ] Set `VITE_USE_MOCK=false` and a real `VITE_API_BASE_URL` on the frontend.
