# 📚 Subscription Tracker API - Complete Codebase Documentation

**Generated:** February 5, 2026  
**Purpose:** Complete understanding of the application architecture, data flow, and functionality

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture & Design](#architecture--design)
5. [Database Models](#database-models)
6. [API Endpoints](#api-endpoints)
7. [Authentication & Security](#authentication--security)
8. [Background Jobs & Workflows](#background-jobs--workflows)
9. [Email System](#email-system)
10. [Middleware & Error Handling](#middleware--error-handling)
11. [Configuration & Environment](#configuration--environment)
12. [Complete User Journey](#complete-user-journey)
13. [Key Features Explained](#key-features-explained)

---

## 🎯 Project Overview

**Subscription Tracker API** is a production-ready backend that helps users manage and track their subscriptions with automated renewal reminders. 

### Core Problem It Solves
Users often forget to cancel subscriptions before they renew, wasting money. This API:
- Stores subscription data (name, price, renewal date, etc.)
- Monitors renewal dates automatically
- Sends proactive email reminders at strategic intervals (7, 5, 3, 1 days before renewal)
- Allows users to manage their subscriptions via REST API

### Key Capabilities
✅ User authentication (signup/signin/signout with JWT)  
✅ Subscription CRUD operations (Create, Read, Update, Delete)  
✅ Automated reminder workflows triggered via Upstash QStash  
✅ Transactional email delivery via Resend  
✅ Security: Rate limiting, bot detection, SQL injection protection via Arcjet  
✅ Role-based access control (admin vs user)  
✅ MongoDB persistence with Mongoose ODM  

---

## 🔧 Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Runtime** | Node.js | JavaScript runtime environment |
| **Framework** | Express.js (v4.16) | HTTP server & routing |
| **Database** | MongoDB + Mongoose | Data persistence with schema validation |
| **Authentication** | JWT (jsonwebtoken) | Stateless user authentication |
| **Password Security** | bcryptjs | Password hashing & verification |
| **Queue/Jobs** | Upstash QStash | Serverless background job scheduling |
| **Email** | Resend | Transactional email delivery |
| **Security** | Arcjet | Rate limiting, bot detection, DDoS protection |
| **Utilities** | dayjs | Date/time manipulation |
| **Environment** | dotenv | Configuration management |
| **Dev Tools** | ESLint, Nodemon | Code quality & auto-reload |
| **Deployment** | Render | Production hosting |

### Key Dependencies Breakdown
```json
{
  "@arcjet/node": "Security middleware (rate limit, bot detection)",
  "@upstash/workflow": "Serverless workflow orchestration",
  "bcryptjs": "Password hashing algorithm",
  "cookie-parser": "Parse HTTP cookies",
  "dayjs": "Lightweight date library",
  "express": "HTTP server framework",
  "jsonwebtoken": "JWT token generation/verification",
  "mongodb": "MongoDB driver",
  "mongoose": "MongoDB object modeling",
  "morgan": "HTTP request logger",
  "resend": "Email delivery service"
}
```

---

## 📁 Project Structure

```
subscription-tracker/
│
├── app.js                          # Express app initialization & route mounting
├── package.json                    # Dependencies & scripts
├── README.md                       # Project documentation
├── eslint.config.js                # Code quality configuration
│
├── config/                         # ⚙️ Configuration Files
│   ├── env.js                      # Environment variables loader
│   ├── arcjet.js                   # Arcjet security configuration
│   └── upstash.js                  # Upstash QStash client initialization
│
├── database/                       # 🗄️ Database Layer
│   └── mongodb.js                  # MongoDB connection setup
│
├── models/                         # 📦 Mongoose Schemas
│   ├── user.model.js               # User data structure
│   └── subscription.model.js       # Subscription data structure
│
├── controllers/                    # 🎮 Business Logic (Request Handlers)
│   ├── auth.controller.js          # User signup/signin/signout logic
│   ├── user.controller.js          # User CRUD operations
│   ├── subscription.controller.js  # Subscription CRUD operations
│   └── workflow.controller.js      # Background job handlers
│
├── routes/                         # 🛣️ API Endpoints
│   ├── auth.routes.js              # Authentication endpoints
│   ├── user.routes.js              # User management endpoints
│   ├── subscription.routes.js      # Subscription endpoints
│   └── workflow.routes.js          # Workflow trigger endpoints
│
├── middlewares/                    # 🔐 Request Processing
│   ├── auth.middleware.js          # JWT verification & user extraction
│   ├── arcjet.middleware.js        # Security: rate limit, bot detection
│   └── error.middleware.js         # Global error handling
│
├── utils/                          # 🛠️ Helper Functions
│   ├── send-email.js               # Email sending logic
│   └── email-template.js           # HTML email templates
│
└── validations/                    # ✅ Validation Functions
    └── validations.js              # Permission checking helpers
```

---

## 🏗️ Architecture & Design

### Request Flow Diagram
```
HTTP Request
    ↓
app.js (Express initialization)
    ↓
arcjetMiddleware (Security checks: rate limit, bot detection)
    ↓
cookieParser (Extract cookies)
    ↓
express.json() (Parse JSON body)
    ↓
Route Handler (e.g., POST /api/v1/subscriptions)
    ↓
Optional: authorize middleware (JWT verification)
    ↓
Controller (Business logic)
    ↓
Model (Database operation via Mongoose)
    ↓
MongoDB (Data persistence)
    ↓
Response sent back to client
    ↓
errorMiddleware (Catches any errors and formats response)
```

### Layered Architecture Pattern
```
┌─────────────────────────────────────┐
│     Routes Layer (Routing)          │
│  Defines API endpoints & handlers   │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│   Middleware Layer (Processing)     │
│  Auth, Security, Error Handling     │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Controllers Layer (Business Logic) │
│  Request validation & processing    │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│   Models Layer (Data Mapping)       │
│  Mongoose schemas & validation      │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Database Layer (Persistence)       │
│  MongoDB operations via Mongoose    │
└─────────────────────────────────────┘
```

---

## 💾 Database Models

### 1. User Model (`models/user.model.js`)

**Purpose:** Stores user account information

```javascript
{
  _id: ObjectId,
  name: String,              // User's full name (2-50 chars)
  email: String,             // Unique email address
  password: String,          // Bcrypt hashed password (min 6 chars)
  role: String,              // 'admin' or 'user'
  createdAt: DateTime,       // Auto-generated
  updatedAt: DateTime        // Auto-generated
}
```

**Schema Rules:**
- `name`: Required, min 2 chars, max 50 chars, trimmed
- `email`: Required, unique, valid email format, lowercase, trimmed
- `password`: Required, min 6 characters (must be hashed before storage)
- `role`: Required, must be 'admin' or 'user'

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$...", // hashed with bcryptjs
  "role": "user",
  "createdAt": "2026-02-05T10:00:00Z",
  "updatedAt": "2026-02-05T10:00:00Z"
}
```

---

### 2. Subscription Model (`models/subscription.model.js`)

**Purpose:** Stores subscription information with automatic renewal tracking

```javascript
{
  _id: ObjectId,
  name: String,              // Subscription name (e.g., "Netflix")
  price: Number,             // Cost amount
  currency: String,          // 'USD', 'EUR', 'DOP'
  frequency: String,         // 'daily', 'weekly', 'monthly', 'yearly'
  category: String,          // sports, news, entertainment, lifestyle, etc.
  paymentMethod: String,     // How user pays (e.g., "credit card")
  status: String,            // 'active', 'expired', 'canceled'
  startDate: DateTime,       // When subscription began
  renewalDate: DateTime,     // When next renewal happens
  user: ObjectId,            // Reference to User model
  createdAt: DateTime,
  updatedAt: DateTime
}
```

**Schema Rules:**
- `name`: Required, 2-100 chars, trimmed
- `price`: Required, must be > 0
- `currency`: Required, enum: ['USD', 'EUR', 'DOP'], default: 'USD'
- `frequency`: Must be one of ['daily', 'weekly', 'monthly', 'yearly']
- `category`: Required, enum of 8 categories (sports, news, entertainment, etc.)
- `status`: Default 'active', enum: ['active', 'expired', 'canceled']
- `startDate`: Required, must be in the past (validation rule)
- `renewalDate`: Must be after startDate (validation rule)
- `user`: Required, references User model, indexed for fast queries

**Auto-Calculation (via Mongoose pre-save hook):**
1. If `renewalDate` is missing, it's auto-calculated based on `frequency`
   - daily: startDate + 1 day
   - weekly: startDate + 7 days
   - monthly: startDate + 30 days
   - yearly: startDate + 365 days

2. If `renewalDate` has passed, status is automatically set to 'expired'

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Netflix Premium",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "credit card",
  "status": "active",
  "startDate": "2025-12-05T00:00:00Z",
  "renewalDate": "2026-03-05T00:00:00Z",
  "user": "507f1f77bcf86cd799439011",
  "createdAt": "2025-12-05T10:00:00Z",
  "updatedAt": "2026-02-05T10:00:00Z"
}
```

---

## 🌐 API Endpoints

### Base URL
- Development: `http://localhost:{PORT}`
- Production: Deployed on Render
- API Version: v1 (`/api/v1/...`)

### 1. Authentication Routes (`/api/v1/auth`)

#### POST `/api/v1/auth/sign-up`
**Purpose:** Create new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"
}
```

**Response (201 Created):**
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

**Error Cases:**
- 409 Conflict: User already exists with that email
- 400 Bad Request: Validation errors (missing fields, invalid email, etc.)

**Notes:**
- Uses MongoDB transactions for data consistency
- Password is hashed with bcryptjs before storage
- JWT token generated with expiry (depends on JWT_EXPIRES_IN env var)

---

#### POST `/api/v1/auth/sign-in`
**Purpose:** Authenticate user and get JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User signed in successfully",
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

**Error Cases:**
- 404 Not Found: User doesn't exist
- 401 Unauthorized: Invalid password
- 400 Bad Request: Missing email or password

---

#### POST `/api/v1/auth/sign-out`
**Purpose:** Sign out user (currently a stub - JWT is stateless)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User signed out successfully"
}
```

**Notes:**
- JWT is stateless, so signout is mainly for client-side cleanup
- Could be extended to implement token blacklisting

---

### 2. User Routes (`/api/v1/users`)

#### GET `/api/v1/users`
**Purpose:** Get all users (admin only)

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  ]
}
```

**Error Cases:**
- 401 Unauthorized: No token provided or invalid token
- 401 Unauthorized: User not found
- 403 Forbidden: User is not admin

---

#### GET `/api/v1/users/:id`
**Purpose:** Get specific user by ID (requires authentication)

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Cases:**
- 401 Unauthorized: No valid token
- 404 Not Found: User doesn't exist with that ID
- 400 Bad Request: Invalid ObjectId format

**Notes:**
- Password field is excluded from response (`.select("-password")`)

---

#### PUT `/api/v1/users/:id`
**Purpose:** Update user information

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "admin"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "admin"
  }
}
```

**Permissions:**
- Users can only update their own profile
- Admins can update any user profile

**Error Cases:**
- 403 Forbidden: User trying to update another user's profile
- 404 Not Found: User doesn't exist

---

#### DELETE `/api/v1/users`
**Purpose:** Delete all users (admin only)

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "deletedCount": 5
  }
}
```

**Error Cases:**
- 403 Forbidden: User is not admin

---

### 3. Subscription Routes (`/api/v1/subscriptions`)

#### POST `/api/v1/subscriptions`
**Purpose:** Create new subscription and trigger automated reminder workflow

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Netflix Premium",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "credit card",
  "startDate": "2025-12-05",
  "renewalDate": "2026-03-05"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Netflix Premium",
      "price": 15.99,
      "currency": "USD",
      "frequency": "monthly",
      "category": "entertainment",
      "paymentMethod": "credit card",
      "status": "active",
      "startDate": "2025-12-05T00:00:00Z",
      "renewalDate": "2026-03-05T00:00:00Z",
      "user": "507f1f77bcf86cd799439011"
    },
    "workflowRunId": "wf_run_12345"
  }
}
```

**Special Behavior:**
- Creates Upstash QStash workflow that monitors renewal date
- Workflow will send email reminders 7, 5, 3, and 1 days before renewal
- Workflow ID is returned for tracking

**Error Cases:**
- 401 Unauthorized: No valid token
- 400 Bad Request: Validation errors (missing fields, invalid values, etc.)

---

#### GET `/api/v1/subscriptions`
**Purpose:** Get all subscriptions (admin only)

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Netflix Premium",
      "price": 15.99,
      "status": "active",
      "renewalDate": "2026-03-05T00:00:00Z",
      "user": "507f1f77bcf86cd799439011"
    }
  ]
}
```

**Error Cases:**
- 403 Forbidden: User is not admin

---

#### GET `/api/v1/subscriptions/:id`
**Purpose:** Get specific subscription by ID

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Netflix Premium",
    "price": 15.99,
    "currency": "USD",
    "frequency": "monthly",
    "category": "entertainment",
    "paymentMethod": "credit card",
    "status": "active",
    "startDate": "2025-12-05T00:00:00Z",
    "renewalDate": "2026-03-05T00:00:00Z",
    "user": "507f1f77bcf86cd799439011"
  }
}
```

**Permissions:**
- Users can only view their own subscriptions
- Admins can view any subscription

**Error Cases:**
- 403 Forbidden: User trying to access another user's subscription
- 404 Not Found: Subscription doesn't exist

---

#### PUT `/api/v1/subscriptions/:id`
**Purpose:** Update subscription details

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "price": 19.99,
  "paymentMethod": "debit card"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "has been updated succesfully!",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Netflix Premium",
    "price": 19.99,
    "paymentMethod": "debit card",
    "status": "active"
  }
}
```

**Permissions:**
- Only subscription owner can update

**Error Cases:**
- 403 Forbidden: Not owner of subscription
- 404 Not Found: Subscription doesn't exist

---

#### DELETE `/api/v1/subscriptions/:id`
**Purpose:** Delete a specific subscription

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "has been deleted succesfully!",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Netflix Premium",
    "deletedCount": 1
  }
}
```

**Permissions:**
- Only subscription owner can delete

**Error Cases:**
- 403 Forbidden: Not owner
- 404 Not Found: Subscription doesn't exist

---

#### GET `/api/v1/subscriptions/user/:id`
**Purpose:** Get all subscriptions for a specific user

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Netflix Premium",
      "price": 15.99,
      "status": "active",
      "renewalDate": "2026-03-05T00:00:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Spotify Premium",
      "price": 10.99,
      "status": "active",
      "renewalDate": "2026-03-10T00:00:00Z"
    }
  ]
}
```

**Permissions:**
- Users can only view their own subscriptions
- Admins can view any user's subscriptions

**Error Cases:**
- 403 Forbidden: User trying to view another user's subscriptions

---

#### DELETE `/api/v1/subscriptions/user/:id`
**Purpose:** Delete all subscriptions for a specific user

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "deletedCount": 3
  }
}
```

**Permissions:**
- Only admin or the user themselves

**Error Cases:**
- 403 Forbidden: Unauthorized user

---

#### DELETE `/api/v1/subscriptions`
**Purpose:** Delete ALL subscriptions in database (admin only)

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "deletedCount": 50
  }
}
```

**Danger:** This deletes everything!

**Error Cases:**
- 403 Forbidden: User is not admin

---

### 4. Workflow Routes (`/api/v1/workflows`)

#### POST `/api/v1/workflows/subscription/reminder`
**Purpose:** Internal endpoint called by Upstash QStash to send reminder emails

**This is NOT meant to be called directly by clients.** It's automatically triggered by Upstash workflows.

**Request Body (from Upstash):**
```json
{
  "subscriptionId": "507f1f77bcf86cd799439012"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Reminder workflow executed"
}
```

---

## 🔐 Authentication & Security

### JWT Authentication Flow

**1. Signup/Signin Process:**
```
User submits credentials
        ↓
Controller verifies email/password
        ↓
JWT token generated: jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn})
        ↓
Token sent to client
        ↓
Client stores token (usually in localStorage)
```

**2. Protected Request Flow:**
```
Client sends request with Authorization header
        ↓
Header format: "Bearer {token}"
        ↓
authorize middleware extracts token
        ↓
jwt.verify(token, JWT_SECRET) validates signature & expiry
        ↓
User found in database via decoded userId
        ↓
req.user object populated with full user document
        ↓
Next handler (controller) executes with authenticated user
```

### JWT Token Structure

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "iat": 1707140400,
  "exp": 1707226800
}
```

**Example Token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE3MDcxNDA0MDAsImV4cCI6MTcwNzIyNjgwMH0.signature
```

### Role-Based Access Control (RBAC)

**Two roles exist:**

1. **Admin Role**
   - Can view all users
   - Can view all subscriptions
   - Can delete all users
   - Can delete all subscriptions
   - Can update any user/subscription

2. **User Role**
   - Can only view/edit their own profile
   - Can only view/manage their own subscriptions
   - Cannot access other users' data

**Example Permission Check:**
```javascript
// Only admin can see all subscriptions
if (req.user.role !== 'admin') {
    return res.status(403).json({message: "Unauthorized"});
}
```

### Arcjet Security Layer

**What it protects against:**

1. **Rate Limiting** (Token Bucket Algorithm)
   - 5 tokens refilled every 10 seconds
   - Bucket capacity: 10 tokens
   - Each request costs 1 token
   - Exceeding limit: 429 Too Many Requests

2. **Bot Detection**
   - Detects and blocks non-search-engine bots
   - Allows: Google, Bing, and other search engines
   - Blocks: Suspicious bot traffic
   - Returns: 403 Forbidden

3. **Shield Protection**
   - Protects against SQL injection
   - Detects common attack patterns
   - Returns: 403 Forbidden on attack detection

**Request Flow:**
```
HTTP Request arrives
        ↓
arcjetMiddleware.protect(req)
        ↓
Check: Rate limit exceeded? → 429
Check: Is bot? → 403
Check: SQL injection? → 403
        ↓
Request passes → next()
```

### Password Security

**bcryptjs Implementation:**
```javascript
// During signup
const salt = await bcrypt.genSalt(10);  // Generate salt (10 rounds)
const hashedPassword = await bcrypt.hash(password, salt);

// During signin
const isValid = await bcrypt.compare(incomingPassword, storedHashedPassword);
```

**Why bcryptjs?**
- Salting: Each password gets unique random salt
- Hashing: Converts password to irreversible hash
- Cost factor: 10 rounds = slow hashing = hard to brute force
- Never stores plaintext passwords

---

## ⏰ Background Jobs & Workflows

### Upstash QStash Workflow System

**What is Upstash QStash?**
- Serverless message queue & job scheduler
- Triggers long-running tasks asynchronously
- Reliable delivery with retries
- Perfect for sending reminder emails

### Subscription Reminder Workflow

**Flow Overview:**
```
1. User creates subscription
        ↓
2. Controller triggers Upstash workflow via workflowClient.trigger()
        ↓
3. Upstash calls /api/v1/workflows/subscription/reminder endpoint
        ↓
4. Workflow monitors renewal date in background
        ↓
5. At strategic times (7, 5, 3, 1 days before), sends email reminders
        ↓
6. Workflow completes after renewal date passes
```

**Step-by-Step Workflow Logic:**

```javascript
// From workflow.controller.js - sendReminders function

1. Fetch subscription from database
   ├─ Check if status is 'active'
   └─ If not, stop workflow

2. Calculate renewal date using dayjs

3. Check if renewal date has passed
   └─ If yes, stop (subscription already expired)

4. Loop through reminder intervals: [7, 5, 3, 1]
   For each interval:
   ├─ Calculate reminder date (e.g., 7 days before renewal)
   ├─ Sleep until that reminder date via context.sleepUntil()
   ├─ When reminder date arrives, trigger email send
   └─ Log completion
```

**Code Execution:**
```javascript
const REMINDERS = [7, 5, 3, 1]  // Send 4 reminders

for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'days');
    
    if (reminderDate.isAfter(dayjs())) {
        // Date is in future, sleep until then
        await context.sleepUntil(label, reminderDate.toDate());
    }
    
    if (dayjs().isSame(reminderDate, 'days')) {
        // It's reminder time! Send email
        await triggerReminder(context, label, subscription);
    }
}
```

**Example Timeline:**
```
Today: Feb 5, 2026
Renewal Date: Mar 5, 2026

Day 26 (Feb 26): 7-day reminder email sent
Day 28 (Feb 28): 5-day reminder email sent
Day Mar 2: 3-day reminder email sent
Day Mar 4: 1-day reminder email sent
Day Mar 5: Renewal date passes, workflow ends
```

**Key Concepts:**
- **context.run()**: Executes a named task within workflow
- **context.sleepUntil()**: Pauses workflow until specific date/time
- **.isBefore()/.isAfter()/.isSame()**: dayjs date comparisons
- **Reliable**: Upstash retries failed sends, guarantees delivery

---

## 📧 Email System

### Email Infrastructure

**Email Provider:** Resend API
- Service: Transactional email delivery
- Cost: Pay per email sent
- Features: Templates, tracking, deliverability

### Email Sending Flow

```javascript
// send-email.js

1. Fetch email template based on type
   Types: "7 days before", "5 days before", "3 days before", "1 days before"

2. Prepare email data
   ├─ userName: From subscription.user.name
   ├─ subscriptionName: From subscription.name
   ├─ renewalDate: Formatted via dayjs
   ├─ price: subscription.currency + subscription.price
   ├─ paymentMethod: subscription.paymentMethod
   └─ daysLeft: How many days until renewal

3. Generate subject & body via template
   ├─ Subject: Dynamic based on reminder type
   └─ Body: HTML email formatted with data

4. Send via Resend API
   ├─ From: "Acme <info@subscriptiontracking.cloud>"
   ├─ To: subscription.user.email
   ├─ Subject: Generated subject
   └─ HTML: Generated HTML body

5. Handle response
   ├─ If error: Log error to console
   └─ If success: Email sent
```

### Email Templates

**Base Template (generateEmailTemplate function):**
- Responsive HTML design with inline CSS
- Branding: "SubDub" header (blue background)
- Sections:
  - Greeting with user name
  - Subscription renewal info
  - Plan details table (name, price, payment method)
  - Call-to-action to manage subscription
  - Footer with links (unsubscribe, privacy, terms)

**Four Reminder Types:**

1. **7 Days Before Reminder**
   - Subject: "📅 Reminder: Your {name} Subscription Renews in 7 Days!"
   - Message: Professional reminder tone

2. **5 Days Before Reminder**
   - Subject: "⏳ {name} Renews in 5 Days – Stay Subscribed!"
   - Message: Gentle push tone

3. **3 Days Before Reminder**
   - Subject: "🚀 3 Days Left! {name} Subscription Renewal"
   - Message: Urgent tone

4. **1 Day Before Reminder**
   - Subject: "⚡ Final Reminder: {name} Renews Tomorrow!"
   - Message: Last chance tone

### Email Variables

```javascript
{
  userName: "John Doe",
  subscriptionName: "Netflix Premium",
  renewalDate: "03-05-2026",
  planName: "Netflix Premium",
  price: "USD$15.99 monthly",
  paymentMethod: "credit card",
  daysLeft: 7
}
```

**Example Email HTML (simplified):**
```html
<div>
  <p>Hello <strong>John Doe</strong>,</p>
  <p>Your <strong>Netflix Premium</strong> subscription is set to renew on
     <strong>03-05-2026</strong> (7 days from today).</p>
  <table>
    <tr><td>Plan: Netflix Premium</td></tr>
    <tr><td>Price: USD$15.99 monthly</td></tr>
    <tr><td>Payment Method: credit card</td></tr>
  </table>
  <p>If you'd like to make changes or cancel, visit your account settings.</p>
</div>
```

---

## 🔄 Middleware & Error Handling

### 1. Auth Middleware (`authorize`)

**Location:** `middlewares/auth.middleware.js`

**Purpose:** Verify JWT token and extract user information

**Execution Order:**
```javascript
1. Check for Authorization header
   └─ Format: "Bearer {token}"
   └─ If missing: Return 401

2. Extract token from header
   └─ Split "Bearer token" → get token part

3. Verify token signature with JWT_SECRET
   └─ If invalid/expired: Return 401

4. Decode token to get userId
   └─ Payload: {userId: "..."}

5. Query database for user by userId
   └─ If not found: Return 401

6. Attach user to request object
   └─ req.user = {_id, name, email, role, ...}

7. Call next() to proceed
```

**Used In:**
- All user routes (except signup/signin)
- All subscription routes
- All admin routes

**Example Usage:**
```javascript
// In controller, you can access authenticated user via:
req.user._id          // MongoDB ObjectId
req.user.email        // User's email
req.user.role         // 'admin' or 'user'
req.user.name         // User's name
```

---

### 2. Arcjet Middleware

**Location:** `middlewares/arcjet.middleware.js`

**Purpose:** Security enforcement (rate limiting, bot detection, DDoS protection)

**Execution:**
```javascript
1. Get decision from arcjet.protect(req)

2. Check if request is denied
   ├─ Is it rate limit? → Return 429
   ├─ Is it a bot? → Return 403
   └─ Other reason? → Return 403

3. If allowed, call next()
```

**Applied To:** All routes (global middleware in app.js)

---

### 3. Error Middleware

**Location:** `middlewares/error.middleware.js`

**Purpose:** Catch and format all errors in consistent way

**Error Handling Flow:**
```javascript
1. Catch any error from controller/model

2. Identify error type:
   ├─ CastError (invalid MongoDB ID)
   │  └─ Convert to "Resource not found" with 404
   ├─ ValidationError (Mongoose validation failed)
   │  └─ Compile messages and return 400
   ├─ Duplicate Key Error (unique field violated)
   │  └─ Return "Duplicate field" with 400
   └─ Custom errors (thrown by controller)
      └─ Use provided statusCode or default 500

3. Log error to console for debugging

4. Send formatted JSON response
   └─ Format: {success: false, error: message}
```

**Example Error Response:**
```json
{
  "success": false,
  "error": "User already exists"
}
```

---

## ⚙️ Configuration & Environment

### Environment Variables (`config/env.js`)

**Purpose:** Load configuration from .env files based on NODE_ENV

**File Selection Logic:**
```javascript
if (NODE_ENV === "production")
    Load: .env.production.local
else
    Load: .env.development.local
```

**Required Variables:**

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development/production |
| `DB_URI` | MongoDB connection | mongodb+srv://user:pass@cluster... |
| `JWT_SECRET` | Token signing key | your-secret-key-min-32-chars |
| `JWT_EXPIRES_IN` | Token expiry | 24h, 7d, etc. |
| `ARCJET_KEY` | Arcjet API key | (from Arcjet dashboard) |
| `ARCJET_ENV` | Arcjet environment | production/staging |
| `QSTASH_URL` | Upstash QStash URL | https://qstash.upstash.io |
| `QSTASH_TOKEN` | Upstash auth token | (from Upstash console) |
| `LOCAL_URL` | Dev callback URL | http://localhost:3000 |
| `RENDER_URL` | Production callback URL | https://app-name.onrender.com |
| `RESEND_KEY` | Resend email API key | re_xxxx... |

### Arcjet Configuration

**File:** `config/arcjet.js`

**Rules Configured:**

1. **Shield (SQL Injection Protection)**
   - Mode: LIVE (blocks attacks)
   - Detects: SQL injection, XSS, command injection

2. **Bot Detection**
   - Mode: LIVE (blocks bots)
   - Allows: Search engine bots (Google, Bing)
   - Blocks: All other bots

3. **Rate Limiting**
   - Algorithm: Token Bucket
   - Capacity: 10 tokens
   - Refill Rate: 5 tokens per 10 seconds
   - Tracked By: IP address

### Upstash Configuration

**File:** `config/upstash.js`

**Client Setup:**
```javascript
const workflowClient = new WorkflowClient({
    baseURL: QSTASH_URL,        // "https://qstash.upstash.io"
    token: QSTASH_TOKEN         // Authentication token
})
```

**Usage:**
```javascript
// Trigger a workflow
const {workflowRunId} = await workflowClient.trigger({
    url: "https://...api/v1/workflows/subscription/reminder",
    body: {subscriptionId: "..."},
    headers: {'content-type': 'application/json'},
    retries: 0
})
```

### MongoDB Configuration

**File:** `database/mongodb.js`

**Connection Process:**
```javascript
1. Check if DB_URI is provided
   └─ If not, throw error and exit

2. Connect to MongoDB via mongoose.connect()

3. Log success message with NODE_ENV

4. On error: Log and exit process (fail fast)
```

**Connected Models:**
- Automatically loads all Mongoose models
- Mongoose maintains connection pool
- Connection persists across requests

---

## 👤 Complete User Journey

### Scenario: John's subscription management journey

#### Step 1: Signup
```
User visits app → clicks "Sign Up"
    ↓
Submits: {name: "John Doe", email: "john@example.com", password: "secure123", role: "user"}
    ↓
POST /api/v1/auth/sign-up
    ↓
Auth Controller:
    - Check if user exists with email → No
    - Hash password: "secure123" → "$2a$10$..."
    - Save new user to MongoDB
    - Generate JWT token
    ↓
Response (201):
{
  "success": true,
  "data": {
    "token": "eyJ...",
    "user": {_id: "abc123", name: "John Doe", email: "john@example.com"}
  }
}
    ↓
Client stores token in localStorage
```

#### Step 2: Signin
```
User returns next day, signs in
    ↓
Submits: {email: "john@example.com", password: "secure123"}
    ↓
POST /api/v1/auth/sign-in
    ↓
Auth Controller:
    - Find user by email → Found
    - Compare password with bcrypt → Match
    - Generate new JWT token
    ↓
Response (200): Token + User data
```

#### Step 3: Add Netflix Subscription
```
User clicks "Add Subscription"
    ↓
Submits:
{
  "name": "Netflix Premium",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "credit card",
  "startDate": "2025-12-05",
  "renewalDate": "2026-03-05"
}
    ↓
POST /api/v1/subscriptions
Headers: Authorization: Bearer {token}
    ↓
Auth Middleware:
    - Extract & verify token
    - Load user from database
    - Set req.user = user
    ↓
Subscription Controller (createSubscription):
    - Create subscription with req.body
    - Attach user ID: subscription.user = req.user._id
    - Save to MongoDB
    - Trigger Upstash workflow
    ↓
Upstash Workflow Created:
    - ID: wf_run_12345
    - Scheduled to run until Mar 5, 2026
    ↓
Response (201):
{
  "success": true,
  "data": {
    "subscription": {_id: "sub123", name: "Netflix Premium", ...},
    "workflowRunId": "wf_run_12345"
  }
}
```

#### Step 4: Background Workflow Runs

**Timeline:**
```
Feb 26, 2026 (7 days before):
    ├─ Workflow executes
    ├─ Calls /api/v1/workflows/subscription/reminder with subscriptionId
    ├─ Fetches subscription from DB
    ├─ Sends email via Resend
    ├─ Subject: "📅 Reminder: Your Netflix Premium Subscription Renews in 7 Days!"
    └─ Email delivered to john@example.com

Feb 28, 2026 (5 days before):
    ├─ Workflow wakes up from sleep
    ├─ Sends second reminder email
    └─ Subject: "⏳ Netflix Premium Renews in 5 Days – Stay Subscribed!"

Mar 2, 2026 (3 days before):
    ├─ Sends third reminder
    └─ Subject: "🚀 3 Days Left! Netflix Premium Subscription Renewal"

Mar 4, 2026 (1 day before):
    ├─ Sends final reminder
    └─ Subject: "⚡ Final Reminder: Netflix Premium Renews Tomorrow!"

Mar 5, 2026 (Renewal date):
    └─ Workflow ends
```

#### Step 5: User Updates Subscription

```
User wants to change payment method
    ↓
Submits: {paymentMethod: "debit card"}
    ↓
PUT /api/v1/subscriptions/sub123
Headers: Authorization: Bearer {token}
    ↓
Auth Middleware: Verify token → user extracted
    ↓
Subscription Controller (updateSubscription):
    - Fetch subscription from DB
    - Check ownership: subscription.user._id === req.user._id
    - Update with new data
    - Save to MongoDB
    ↓
Response (200):
{
  "success": true,
  "message": "has been updated succesfully!",
  "data": {_id: "sub123", paymentMethod: "debit card", ...}
}
```

#### Step 6: User Views All Their Subscriptions

```
User wants dashboard of all subscriptions
    ↓
GET /api/v1/subscriptions/user/abc123
Headers: Authorization: Bearer {token}
    ↓
Auth Middleware: Verify token → user extracted
    ↓
Subscription Controller (getUserAllSubscriptions):
    - Check permission: user.id === req.params.id OR user.role === 'admin'
    - Query MongoDB: find({user: req.params.id})
    - Return all subscriptions
    ↓
Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "sub123",
      "name": "Netflix Premium",
      "price": 15.99,
      "status": "active",
      "renewalDate": "2026-03-05"
    },
    {
      "_id": "sub124",
      "name": "Spotify Premium",
      "price": 10.99,
      "status": "active",
      "renewalDate": "2026-03-10"
    }
  ]
}
```

#### Step 7: Admin Views All Users

```
Admin user wants to see all accounts
    ↓
GET /api/v1/users
Headers: Authorization: Bearer {admin-token}
    ↓
Auth Middleware: Verify token → admin user extracted
    ↓
User Controller (getUsers):
    - Check permission: req.user.role === 'admin'
    - Query MongoDB: find({})
    - Return all users
    ↓
Response (200):
{
  "success": true,
  "data": [
    {_id: "abc123", name: "John Doe", email: "john@example.com", role: "user"},
    {_id: "xyz789", name: "Admin User", email: "admin@example.com", role: "admin"}
  ]
}
```

---

## 🎯 Key Features Explained

### Feature 1: Automated Reminder Emails

**Problem:** Users forget subscription renewal dates and get charged unexpectedly.

**Solution:**
1. When subscription created, Upstash workflow triggered
2. Workflow monitors renewal date
3. Sends 4 reminder emails (7, 5, 3, 1 days before)
4. Emails personalized with subscription details

**Benefits:**
- Proactive notifications
- Multiple reminders (not just one)
- User gets control back before charge
- Can cancel or update payment method

---

### Feature 2: Role-Based Access Control

**Problem:** Users should only see their data; admins need management access.

**Solution:**
- Two roles: 'admin' and 'user'
- Permission checks in controllers
- Middleware validates before processing

**Examples:**
```javascript
// Only admins can see all users
if (req.user.role !== 'admin') {
    return 403 Forbidden
}

// Users can only access own subscriptions
if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return 403 Forbidden
}
```

---

### Feature 3: Automatic Status Updates

**Problem:** Subscriptions show as "active" even after renewal date passed.

**Solution:** Mongoose pre-save hook auto-updates status:
```javascript
// Before saving subscription
if (renewalDate < new Date()) {
    subscription.status = 'expired'
}
```

---

### Feature 4: Automatic Renewal Date Calculation

**Problem:** User might forget to specify renewal date for monthly subscription.

**Solution:** Pre-save hook calculates based on frequency:
```javascript
if (!renewalDate) {
    renewalDate = startDate + frequency_period
}
// monthly = startDate + 30 days
// yearly = startDate + 365 days
```

---

### Feature 5: Security Layers

**Rate Limiting:** Prevents abuse
- 5 tokens per 10 seconds
- Max 10 concurrent requests
- Returns 429 if exceeded

**Bot Detection:** Blocks malicious bots
- Only allows search engine bots
- Blocks all others
- Returns 403 for bots

**SQL Injection Protection:** Arcjet Shield
- Detects attack patterns
- Blocks suspicious requests
- Returns 403 if detected

---

### Feature 6: MongoDB Transactions

**Used in signup:**
```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
    const newUser = await User.create([userData], {session});
    const token = jwt.sign(...);
    await session.commitTransaction();
    return success response
} catch (error) {
    await session.abortTransaction();
    return error response
}
```

**Why?** Ensures data consistency - either user is created AND token sent, or neither happens.

---

## 📊 Data Flow Diagram

```
┌──────────────────┐
│  Client/Frontend │
│  (Browser, App)  │
└────────┬─────────┘
         │ HTTP Request
         │ + Authorization Header
         ↓
┌──────────────────────────────────┐
│     Express App (app.js)         │
└────────┬────────────────────────┘
         │
         ├→ arcjetMiddleware (Rate limit, Bot check)
         │
         ├→ cookieParser (Extract cookies)
         │
         ├→ express.json() (Parse JSON body)
         │
         ├→ Route Handler (Match URL pattern)
         │
         └→ Specific Router (auth/user/subscription/workflow)
            │
            ├→ authorize middleware (JWT verification)
            │  ├─ Extract token from header
            │  ├─ Verify signature
            │  ├─ Load user from DB
            │  └─ Set req.user
            │
            ├→ Controller (Business logic)
            │  ├─ Validate data
            │  ├─ Check permissions
            │  ├─ Call Model methods
            │  └─ Prepare response
            │
            ├→ Model (Mongoose schema)
            │  ├─ Run validations
            │  ├─ Pre/post hooks
            │  └─ Prepare for database
            │
            └→ MongoDB (Persistence)
               ├─ Insert/Update/Delete/Query
               └─ Return result
                  │
                  ↓
            Response generated
                  │
                  ├→ Success: 2xx status + data
                  └→ Error: errorMiddleware catches → formatted error response
                           │
                           ↓
                  HTTP Response sent to client
                           │
                           ↓
                  Client receives JSON
```

---

## 🔗 External Service Integrations

### 1. MongoDB Atlas
- **Purpose:** Database hosting
- **Connection:** Via mongoose.connect(DB_URI)
- **Data:** Users, Subscriptions
- **Features:** Auto-indexing, backups, replication

### 2. Upstash QStash
- **Purpose:** Serverless message queue & workflow
- **Trigger:** When subscription created
- **Action:** Monitors renewal date, sends reminders
- **Advantage:** No server needed, auto-scales

### 3. Resend
- **Purpose:** Email delivery service
- **Trigger:** Via workflow when reminder date reached
- **Content:** Personalized HTML emails
- **Advantage:** High deliverability, tracking

### 4. Arcjet
- **Purpose:** Security middleware
- **Protections:** Rate limiting, bot detection, DDoS
- **Decision:** Allow/Deny request
- **Mode:** LIVE (production) / DRY_RUN (testing)

### 5. Render
- **Purpose:** Production deployment
- **What runs:** Node.js server
- **Environment:** NODE_ENV=production
- **RENDER_URL:** Webhook callback URL for Upstash

---

## 🚀 Deployment Notes

### Development
```bash
npm install
npm run dev
# Runs with nodemon on http://localhost:3000
# Uses .env.development.local
```

### Production
```bash
npm start
# NODE_ENV=production node app.js
# Uses .env.production.local
# Deployed on Render
```

### Environment Variables
```
Development:  .env.development.local
Production:   .env.production.local

Both must contain:
- PORT, DB_URI, JWT_SECRET, ARCJET_KEY, QSTASH_URL/TOKEN, RESEND_KEY
```

---

## 📝 Summary

**Your app is a complete, production-ready subscription management system with:**

1. ✅ User authentication (JWT)
2. ✅ CRUD operations for subscriptions
3. ✅ Automated background workflows (Upstash)
4. ✅ Transactional emails (Resend)
5. ✅ Security protections (Arcjet)
6. ✅ Role-based access control
7. ✅ Error handling & validation
8. ✅ MongoDB persistence
9. ✅ Scalable architecture

**Key Technologies:**
- Express.js for HTTP routing
- MongoDB + Mongoose for data
- JWT for stateless auth
- Upstash for async workflows
- Resend for emails
- Arcjet for security

**The main workflow loop:**
User creates subscription → Upstash workflow triggered → Monitors renewal date → Sends 4 reminder emails → User gets notified before charge.

---

*End of Documentation*

