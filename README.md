# Subscription Tracker API

Simple backend API for managing user subscriptions and sending renewal reminders.

## What Is Included

- JWT authentication (`/api/v1/sessions`)
- User management (`/api/v1/users`)
- Subscription CRUD (`/api/v1/subscriptions`)
- Reminder workflow trigger with Upstash (`/api/v1/subscriptions/:id/reminders`)
- Arcjet protection middleware (rate limit, bot detection, shield)
- Swagger UI and OpenAPI spec

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- bcrypt (`bcryptjs`)
- Upstash Workflow
- Resend
- Arcjet
- Swagger UI (`swagger-ui-express`)

## Project Structure

```text
config/
controllers/
database/
docs/
middlewares/
models/
permissions/
routes/
utils/
app.js
API_DOCUMENTATION.md
CODEBASE_DOCUMENTATION.md
```

## Environment Variables

The app loads:

- `.env.development.local` when `NODE_ENV` is not `production`
- `.env.production.local` when `NODE_ENV=production`

Variables used in code:

- `PORT`
- `NODE_ENV`
- `DB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ARCJET_KEY`
- `ARCJET_ENV`
- `QSTASH_URL`
- `QSTASH_TOKEN`
- `LOCAL_URL`
- `RENDER_URL`
- `RESEND_KEY`

## Installation

```bash
npm install
```

## Run

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## API Base URL

- `http://localhost:<PORT>/api/v1`

## Swagger and API Docs

- Swagger UI: `http://localhost:<PORT>/api-docs`
- OpenAPI JSON: `http://localhost:<PORT>/api-docs.json`
- OpenAPI source: `docs/openapi.js`
- Additional API reference: `API_DOCUMENTATION.md`

## Authentication

Use bearer token on protected routes:

```text
Authorization: Bearer <jwt_token>
```

Get a token from:

- `POST /api/v1/users` (sign up)
- `POST /api/v1/sessions` (sign in)

## Current Routes

### Sessions

- `POST /api/v1/sessions`
- `DELETE /api/v1/sessions/current` (route exists, controller is currently a stub)

### Users

- `POST /api/v1/users`
- `GET /api/v1/users` (admin only)
- `GET /api/v1/users/:id` (authenticated)
- `PATCH /api/v1/users/:id` (owner or admin)
- `GET /api/v1/users/:id/subscriptions` (owner or admin)
- `DELETE /api/v1/users/:id/subscriptions` (owner or admin)

### Subscriptions

- `GET /api/v1/subscriptions` (admin only)
- `POST /api/v1/subscriptions` (authenticated)
- `GET /api/v1/subscriptions/:id` (owner or admin)
- `PATCH /api/v1/subscriptions/:id` (owner only in current implementation)
- `DELETE /api/v1/subscriptions/:id` (owner only in current implementation)
- `POST /api/v1/subscriptions/:id/reminders` (workflow endpoint, authenticated)

## Notes

- On subscription creation, workflow trigger is attempted only when `QSTASH_TOKEN` is configured.
- Global error middleware returns errors in `{ success: false, error: "..." }` format.
- Auth middleware returns `401` with `message` fields for invalid or missing token.

## License

MIT
