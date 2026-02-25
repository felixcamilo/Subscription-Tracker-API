# Subscription Tracker API

A production-style backend API that helps users avoid missed renewals and recurring-cost surprises.

## Problem
People often forget subscription renewal dates, leading to unexpected charges and poor visibility into upcoming payments.

## Impact
- Centralized subscription management with authenticated CRUD endpoints.
- `GET /api/v1/subscriptions/upcoming-renewals` surfaces what renews in the next 7 days.
- Automated email reminders are scheduled for 7, 5, 3, and 1 day before renewal.
- Users can act early to cancel, downgrade, or change payment methods.

## Engineering Quality
- Modular MVC-style codebase with versioned routes under `/api/v1`.
- Security controls: JWT authentication, role/ownership permissions, Arcjet rate limiting and bot protection.
- Data integrity with Mongoose schema validation and lifecycle rules for renewal date and status.
- Centralized error middleware for cast errors, duplicate keys, and validation failures.
- Event-driven workflow orchestration using Upstash Workflow for reminder scheduling.
- OpenAPI 3.0 specification with Swagger UI for fast API onboarding.

## Proof
- Interactive docs: `http://localhost:<PORT>/api-docs`
- OpenAPI JSON: `http://localhost:<PORT>/api-docs.json`
- OpenAPI source: `docs/openapi.js`
- Core implementation references:
  - `controllers/subscription.controller.js`
  - `controllers/workflow.controller.js`
  - `middlewares/auth.middleware.js`
  - `middlewares/arcjet.middleware.js`
  - `permissions/permissions.js`
- Demo GIF placeholder:

![Subscription Tracker API Demo](./docs/demo.gif)

Add your screen recording to `docs/demo.gif` to show real usage in GitHub and LinkedIn.

## Tech Stack
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Upstash Workflow
- Resend
- Arcjet
- Swagger UI + OpenAPI 3.0

## API Capabilities
- Auth: `POST /api/v1/auth/sign-up`, `POST /api/v1/auth/sign-in`, `POST /api/v1/auth/sign-out`
- Users: `GET /api/v1/users`, `GET /api/v1/users/current/:id`, `PUT /api/v1/users/current/:id`, `DELETE /api/v1/users/current/:id`
- User subscriptions: `GET /api/v1/users/:id/subscriptions`, `DELETE /api/v1/users/:id/subscriptions`
- Subscriptions: `POST /api/v1/subscriptions`, `GET /api/v1/subscriptions`, `GET /api/v1/subscriptions/upcoming-renewals`, `GET /api/v1/subscriptions/:id`, `PUT /api/v1/subscriptions/:id`, `DELETE /api/v1/subscriptions/:id`

## Run In 60 Seconds
1. Install dependencies:

```bash
npm install
```

2. Create `.env.development.local`:

```env
PORT=3000
NODE_ENV=development
DB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=7d
ARCJET_KEY=<your_arcjet_key>
ARCJET_ENV=development
QSTASH_URL=<your_qstash_url>
QSTASH_TOKEN=<your_qstash_token>
LOCAL_URL=http://localhost:3000
RENDER_URL=<your_deployment_url_or_leave_empty>
RESEND_KEY=<your_resend_api_key>
```

3. Start the server:

```bash
npm run dev
```

4. Open:

```text
http://localhost:<PORT>/api-docs
```

5. Test protected routes in Swagger:
- Call `POST /api/v1/auth/sign-in`
- Copy the JWT token
- Click `Authorize` and set `Bearer <token>`

## Folder Structure
```text
config/        environment, Arcjet, Upstash
controllers/   route handlers and business logic
database/      MongoDB connection
docs/          OpenAPI specification
middlewares/   auth, error handling, Arcjet protection
models/        Mongoose schemas
permissions/   access-control rules
routes/        API route definitions
utils/         email sending and templates
```
