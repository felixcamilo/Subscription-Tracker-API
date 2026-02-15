# 🧪 REST API Testing Guide

This guide provides curl commands to test all endpoints of your fully RESTful Subscription Tracker API.

**Base URL:** `http://localhost:3000/api/v1`

---

## 📋 Test Scenarios

### 1. User Registration & Authentication

#### Register a new user
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123",
    "role": "user"
  }'
```

**Expected Response:** `201 Created`
```json
{
  "success": true,
  "message": "User signed up successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

---

#### Login (Create Session)
```bash
curl -X POST http://localhost:3000/api/v1/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "message": "User signed in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

**Save token for next requests:** `TOKEN="your_jwt_token_here"`

---

#### Logout (Delete Session)
```bash
curl -X DELETE http://localhost:3000/api/v1/sessions/current \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** `200 OK`

---

### 2. User Management (Admin & Self)

#### Get All Users (Admin Only)
```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** `200 OK` (admin only)

---

#### Get Single User
```bash
curl -X GET http://localhost:3000/api/v1/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** `200 OK`

---

#### Update User
```bash
curl -X PATCH http://localhost:3000/api/v1/users/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com"
  }'
```

**Expected Response:** `200 OK`

---

### 3. Subscriptions (Core Resource)

#### Create Subscription
```bash
curl -X POST http://localhost:3000/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Netflix Premium",
    "amount": 15.99,
    "currency": "USD",
    "renewalDate": "2026-03-14",
    "category": "Entertainment",
    "status": "active"
  }'
```

**Expected Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "subscription": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Netflix Premium",
      "amount": 15.99,
      "user": "507f1f77bcf86cd799439011",
      "renewalDate": "2026-03-14",
      "status": "active"
    },
    "workflowRunId": "run_123456"
  }
}
```

**Save subscription ID:** `SUBSCRIPTION_ID="507f1f77bcf86cd799439012"`

---

#### Get All Subscriptions (Admin Only)
```bash
curl -X GET http://localhost:3000/api/v1/subscriptions \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** `200 OK` (admin only, lists all)

---

#### Get Single Subscription
```bash
curl -X GET http://localhost:3000/api/v1/subscriptions/$SUBSCRIPTION_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** `200 OK`

---

#### Update Subscription (e.g., Change Amount)
```bash
curl -X PATCH http://localhost:3000/api/v1/subscriptions/$SUBSCRIPTION_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 19.99,
    "renewalDate": "2026-04-14"
  }'
```

**Expected Response:** `200 OK`

---

#### Cancel Subscription (Update Status)
```bash
curl -X PATCH http://localhost:3000/api/v1/subscriptions/$SUBSCRIPTION_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "canceled"
  }'
```

**Expected Response:** `200 OK`

---

#### Delete Subscription
```bash
curl -X DELETE http://localhost:3000/api/v1/subscriptions/$SUBSCRIPTION_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** `200 OK`

---

### 4. Subscription Sub-Resources

#### Create Reminder for Subscription
```bash
curl -X POST http://localhost:3000/api/v1/subscriptions/$SUBSCRIPTION_ID/reminders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{}'
```

**Expected Response:** `201 Created`

---

#### Get User's Subscriptions (Nested Resource)
```bash
curl -X GET http://localhost:3000/api/v1/users/507f1f77bcf86cd799439011/subscriptions \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** `200 OK`

---

#### Delete All User's Subscriptions
```bash
curl -X DELETE http://localhost:3000/api/v1/users/507f1f77bcf86cd799439011/subscriptions \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** `200 OK`

---

## 🔑 Full Testing Workflow

### Step 1: Register & Get Token
```bash
# Register
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123",
    "role": "user"
  }' | jq '.data.token'

# Copy the token and set it
TOKEN="your_token_here"
```

### Step 2: Test Resource Operations
```bash
# Create a subscription
curl -X POST http://localhost:3000/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Spotify",
    "amount": 9.99,
    "currency": "USD",
    "renewalDate": "2026-03-20",
    "category": "Music",
    "status": "active"
  }' | jq '.data.subscription._id'

# Get the subscription ID and save it
SUBSCRIPTION_ID="your_id_here"

# View the subscription
curl -X GET http://localhost:3000/api/v1/subscriptions/$SUBSCRIPTION_ID \
  -H "Authorization: Bearer $TOKEN" | jq

# Update the subscription
curl -X PATCH http://localhost:3000/api/v1/subscriptions/$SUBSCRIPTION_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"amount": 11.99}' | jq

# Delete the subscription
curl -X DELETE http://localhost:3000/api/v1/subscriptions/$SUBSCRIPTION_ID \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 📊 HTTP Status Codes Expected

| Code | Scenario |
|------|----------|
| `200` | GET, PATCH, DELETE successful |
| `201` | POST (resource created) successful |
| `400` | Bad request (validation error) |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden (permission denied) |
| `404` | Resource not found |
| `409` | Conflict (user already exists) |
| `500` | Server error |

---

## 🛠️ Using with Postman or Insomnia

### Create Environment
```json
{
  "BASE_URL": "http://localhost:3000/api/v1",
  "TOKEN": "your_jwt_token_here",
  "USER_ID": "507f1f77bcf86cd799439011",
  "SUBSCRIPTION_ID": "507f1f77bcf86cd799439012"
}
```

### Example Postman/Insomnia Requests

**POST /users** (Register)
```
URL: {{BASE_URL}}/users
Method: POST
Body (JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**POST /sessions** (Login)
```
URL: {{BASE_URL}}/sessions
Method: POST
Headers: 
  - Content-Type: application/json
Body (JSON):
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**POST /subscriptions** (Create)
```
URL: {{BASE_URL}}/subscriptions
Method: POST
Headers:
  - Authorization: Bearer {{TOKEN}}
  - Content-Type: application/json
Body (JSON):
{
  "name": "Netflix",
  "amount": 15.99,
  "renewalDate": "2026-03-14"
}
```

---

## ✅ RESTful API Verification Checklist

After testing, verify these RESTful principles:

- ✅ **Collection endpoints** use plural nouns: `/users`, `/subscriptions`
- ✅ **Resource endpoints** use singular concept: `/users/:id`
- ✅ **HTTP verbs** are correct: GET (retrieve), POST (create), PATCH (update), DELETE (remove)
- ✅ **Status codes** follow conventions
- ✅ **Sub-resources** are hierarchical: `/users/:id/subscriptions`, `/subscriptions/:id/reminders`
- ✅ **No action verbs** in URLs (no `/cancel`, `/send`, `/do-something`)
- ✅ **Consistent response format** across all endpoints

---

## 🐛 Troubleshooting

### "Cannot POST /api/v1/users"
- Verify server is running: `npm run dev`
- Check PORT in `.env` (default: 3000)

### "Unauthorized" (401)
- Token is missing or invalid
- Use token from registration or login response
- Add `Authorization: Bearer $TOKEN` header

### "Forbidden" (403)
- User doesn't have permission
- Check role requirements (admin for some endpoints)
- Verify user owns the resource

### "Not found" (404)
- Resource ID is incorrect
- Resource was already deleted
- Endpoint path is wrong

---

## 💡 Tips

1. Use `jq` to format JSON responses: `curl ... | jq`
2. Store tokens in terminal variables: `TOKEN="..."`
3. Use Postman collections for easier testing
4. Monitor server logs: `npm run dev` output
5. Check MongoDB to verify data persists

