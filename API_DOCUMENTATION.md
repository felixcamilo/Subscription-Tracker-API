# Subscription Tracker API Documentation

This is a straightforward reference for the API implemented in this repository.

## Base URL

- Local: `http://localhost:<PORT>`
- API prefix: `/api/v1`
- Full base URL: `http://localhost:<PORT>/api/v1`

## Swagger

- Swagger UI: `http://localhost:<PORT>/api-docs`
- OpenAPI JSON: `http://localhost:<PORT>/api-docs.json`

## Authentication

Protected routes require:

`Authorization: Bearer <jwt_token>`

Get a token from:
- `POST /api/v1/users` (sign up)
- `POST /api/v1/sessions` (sign in)

## Response Format

Typical success:

```json
{
  "success": true,
  "data": {}
}
```

Typical error (global error middleware):

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error message"
  }
}
```

## Resource Fields

### User

```json
{
  "name": "string (required, 2-50)",
  "email": "string (required, unique)",
  "password": "string (required, min 6)",
  "role": "admin | user (required)"
}
```

### Subscription

```json
{
  "name": "string (required, 2-100)",
  "price": "number (required)",
  "currency": "USD | EUR | DOP (required)",
  "frequency": "daily | weekly | monthly | yearly (required)",
  "category": "sports | news | entertainment | lifestyle | technology | finance | politics | other (required)",
  "paymentMethod": "string (required)",
  "status": "active | expired | canceled (optional, default active)",
  "startDate": "date (required, must be in the past)",
  "renewalDate": "date (optional, must be after startDate)"
}
```

Notes:
- If `renewalDate` is omitted, it is auto-calculated from `startDate + frequency`.
- Server sets `user` automatically from the authenticated request.

## Endpoint Summary

| Method | Path | Auth | Access |
|---|---|---|---|
| POST | `/users` | No | Public |
| GET | `/users` | Yes | Admin only |
| GET | `/users/:id` | Yes | Any authenticated user |
| PATCH | `/users/:id` | Yes | Owner or admin |
| GET | `/users/:id/subscriptions` | Yes | Owner or admin |
| DELETE | `/users/:id/subscriptions` | Yes | Owner or admin |
| POST | `/sessions` | No | Public |
| DELETE | `/sessions/current` | Yes | Authenticated |
| GET | `/subscriptions` | Yes | Admin only |
| POST | `/subscriptions` | Yes | Any authenticated user |
| GET | `/subscriptions/:id` | Yes | Owner or admin |
| PATCH | `/subscriptions/:id` | Yes | Owner only |
| DELETE | `/subscriptions/:id` | Yes | Owner only |
| POST | `/subscriptions/:id/reminder-jobs` | Yes | Owner or admin |
| POST | `/subscriptions/:id/reminder-jobs/run` | No | Internal workflow callback |

## Endpoints

### POST `/api/v1/users`
Create a user account.

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "user"
}
```

Success (`201`):

```json
{
  "success": true,
  "message": "User signed up successfully",
  "data": {
    "token": "<jwt>",
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

Response includes `Location: /api/v1/users/:id`.

### POST `/api/v1/sessions`
Create a session (login).

Request body:

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

Success (`201`): token + user in `data`.

Response includes `Location: /api/v1/sessions/current`.

### DELETE `/api/v1/sessions/current`
Delete current session (authenticated).

Success: `204 No Content`.

### GET `/api/v1/users`
Get all users (admin only).

### GET `/api/v1/users/:id`
Get one user by id (any authenticated user).

### PATCH `/api/v1/users/:id`
Update user (owner or admin).

### GET `/api/v1/users/:id/subscriptions`
Get all subscriptions for a user (owner or admin).

### DELETE `/api/v1/users/:id/subscriptions`
Delete all subscriptions for a user (owner or admin).

Success (`200`) example:

```json
{
  "success": true,
  "data": {
    "acknowledged": true,
    "deletedCount": 3
  }
}
```

### GET `/api/v1/subscriptions`
Get all subscriptions (admin only).

### POST `/api/v1/subscriptions`
Create a subscription.

Request body example:

```json
{
  "name": "Netflix Premium",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "credit card",
  "startDate": "2026-01-01"
}
```

Success (`201`) example:

```json
{
  "success": true,
  "data": {
    "subscription": {
      "_id": "...",
      "name": "Netflix Premium",
      "price": 15.99,
      "user": "..."
    },
    "workflowRunId": "..."
  }
}
```

`workflowRunId` may be `null` when Upstash is not configured.
Response includes `Location: /api/v1/subscriptions/:id`.

### GET `/api/v1/subscriptions/:id`
Get one subscription (owner or admin).

### PATCH `/api/v1/subscriptions/:id`
Update subscription (owner only).

Request body example:

```json
{
  "price": 19.99,
  "status": "canceled"
}
```

### DELETE `/api/v1/subscriptions/:id`
Delete subscription (owner only).

Success: `204 No Content`.

### POST `/api/v1/subscriptions/:id/reminder-jobs`
Create a reminder job run for a subscription (owner or admin).

Success (`201`) example:

```json
{
  "success": true,
  "data": {
    "workflowRunId": "wfr_abc123"
  }
}
```

Response includes:
- `Location: /api/v1/subscriptions/:id/reminder-jobs/:workflowRunId`

### POST `/api/v1/subscriptions/:id/reminder-jobs/run`
Internal Upstash callback endpoint used to execute the reminder workflow.
`subscriptionId` is resolved from the URL path (request body is optional).

## Status Codes Used

- `200` OK
- `201` Created
- `204` No Content
- `400` Validation / bad request
- `401` Unauthorized
- `403` Forbidden
- `404` Not found
- `409` Conflict
- `429` Rate limited (Arcjet)
- `500` Server error
- `503` Service unavailable

## Minimal cURL Flow

Sign up:

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"SecurePassword123","role":"user"}'
```

Sign in:

```bash
curl -X POST http://localhost:3000/api/v1/sessions \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePassword123"}'
```

Create subscription:

```bash
curl -X POST http://localhost:3000/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{"name":"Netflix Premium","price":15.99,"currency":"USD","frequency":"monthly","category":"entertainment","paymentMethod":"credit card","startDate":"2026-01-01"}'
```
