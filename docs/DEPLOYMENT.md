# Deployment

The frontend and backend deploy independently. The simplest path is the
frontend on Netlify in mock mode, with the backend added later on Render.

## Frontend on Netlify

The repository includes `netlify.toml`, which sets the base directory, build
command and single page app redirect.

1. In Netlify, create a new site from this Git repository.
2. Netlify reads `netlify.toml` automatically. No manual build settings needed.
3. The site deploys in mock mode, so it works immediately with no backend.

To connect it to a live backend later, set these in the Netlify site settings
and redeploy:

```
VITE_USE_MOCK = false
VITE_API_BASE_URL = https://your-backend-url/api
```

## Full stack on Render

The repository includes `render.yaml`, a blueprint that provisions the API, a
MySQL database and the static frontend together.

1. In Render, choose "New" then "Blueprint" and point it at this repository.
2. Render creates the database, backend and frontend from `render.yaml`.
3. Fill in the two values marked `sync: false`:
   - Backend `EDDS_CORS_ORIGINS`: the deployed frontend url.
   - Frontend `VITE_API_BASE_URL`: the deployed backend url followed by `/api`.
4. `EDDS_JWT_SECRET` is generated automatically.

## Deploying the backend as a container anywhere

The backend has a self contained Dockerfile.

```bash
cd backend
docker build -t edds-backend .
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=mysql \
  -e DB_URL="jdbc:mysql://host:3306/edds?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true" \
  -e DB_USERNAME=edds -e DB_PASSWORD=secret \
  -e EDDS_JWT_SECRET="a-long-random-production-secret" \
  -e EDDS_CORS_ORIGINS="https://your-frontend-url" \
  -v edds-uploads:/app/uploads \
  edds-backend
```

## Production checklist

- [ ] Set a long, random `EDDS_JWT_SECRET`.
- [ ] Change or remove the seeded demo accounts.
- [ ] Point `EDDS_CORS_ORIGINS` at the real frontend origin only.
- [ ] Mount a persistent volume or object store for `uploads`.
- [ ] Use managed MySQL with regular backups.
- [ ] Serve everything over HTTPS.
- [ ] Set `VITE_USE_MOCK=false` and a real `VITE_API_BASE_URL` on the frontend.

## Notes on file storage

Uploaded PDFs live on the backend's local disk by default. On platforms with
ephemeral filesystems, mount a persistent volume for the uploads directory, or
adapt `FileStorageService` to write to an object store such as S3. Only the file
path is kept in the database, so switching the storage backend is a contained
change.
