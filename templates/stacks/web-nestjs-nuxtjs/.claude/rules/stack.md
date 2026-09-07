# stack rules — Web (NestJS + Nuxt 3)

Always loaded. The {{STACK_LABEL}} conventions for {{PROJECT_TITLE}}.

## Shape

```
apps/
  api/        # NestJS — business logic, REST endpoints
  web/        # Nuxt 3 — the frontend
packages/
  shared/     # types shared between api and web (the contract)
```

- Test: `{{TEST_COMMAND}}` · Build: `{{BUILD_COMMAND}}` · Run: `{{RUN_COMMAND}}`
- Package manager: pnpm workspaces. Node 20+.
- Database: **{{DATABASE}}**. Start it with `{{DEV_SERVICES}}` before running the app.

## Database (MySQL via Docker)

- `docker-compose.yml` at the project root runs MySQL 8 on `localhost:3306`. Only
  the DB runs in Docker; the app runs locally with `{{RUN_COMMAND}}`.
- Copy `.env.example` to `.env`; the API reads `DATABASE_URL` from it. `.env` is
  gitignored - never commit real credentials.
- Schema changes go through **migrations**, never `synchronize: true`. Data lives
  in the `mysql-data` volume; `docker compose down -v` wipes it for a clean slate.

## Backend (NestJS)

- **Layers stay separate:** controller (HTTP) → service (logic) → repository
  (data). No business logic in controllers; no HTTP objects in services.
- **DTOs validate at the boundary.** Every endpoint has a `class-validator` DTO.
  Never trust an unvalidated body.
- **Dependency injection, always.** Never `new` a dependency inside the class
  that uses it — inject it, so it can be tested.
- Every endpoint is authenticated by default; make the exception explicit.

## Frontend (Nuxt 3)

- Composition API + `<script setup>`. Composables for shared logic (`useX`).
- Data fetching through `useFetch` / `useAsyncData`, never raw `fetch` in
  components.
- State via `useState` / Pinia — not a global mutable object.
- Components are presentational; logic lives in composables.

## The contract

Types the API returns and the web consumes live in `packages/shared`. Change the
contract there first; both sides import it. A frontend that hand-redeclares an API
type will drift — don't.

## What not to reach for

- ORM `synchronize: true` in anything but throwaway local — it silently drops
  columns. Use migrations.
- Business logic in Nuxt server routes — that belongs in the NestJS API.
