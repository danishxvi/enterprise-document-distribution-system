# Contributing

Thanks for taking an interest in the project. Issues and pull requests are
welcome.

## Getting set up

Follow the [local walkthrough](README.md#run-it-locally) to get the frontend and
backend running on your machine.

## Before opening a pull request

Run the same checks that CI runs. Both must pass.

```bash
# Backend: compile and run the test suite
cd backend
./mvnw verify          # on Windows: mvnw.cmd verify

# Frontend: lint with zero warnings, then build
cd frontend
npm run lint
npm run build
```

## Conventions

- **Branches:** create a branch from `main` with a short descriptive name, for
  example `fix-upload-size-check`.
- **Commits:** write the subject in the imperative mood ("Add", "Fix",
  "Update"), keep it under about 70 characters, and explain the why in the body
  when it is not obvious.
- **Backend:** keep controllers thin and put business rules in services. New
  endpoints need a test in `backend/src/test`.
- **Frontend:** build on the shared components in `src/components/ui` and the
  `brand` colour tokens in `tailwind.config.js`. The design uses blue and white
  only, so please do not introduce new hues.
- **Docs:** if a change affects behaviour, configuration or the API, update the
  matching file in `docs/` in the same pull request.

## Reporting a security issue

Please do not open a public issue for security problems. Email the maintainer
listed on the [About the developer](frontend/src/pages/AboutDeveloperPage.jsx)
page instead.
