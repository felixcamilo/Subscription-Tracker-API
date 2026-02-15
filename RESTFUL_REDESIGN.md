# RESTful API Redesign Map

This document outlines the transformation from action-based endpoints to fully RESTful resource-based endpoints.

## Current State → RESTful State

### Authentication & Sessions

**Current (Action-Based):**
```
POST /api/v1/auth/sign-up      → Create user account
POST /api/v1/auth/sign-in       → Authenticate and get token
POST /api/v1/auth/sign-out      → Logout (invalidate token)
```

**RESTful Design:**
```
POST /api/v1/users              → Create new user account (registration)
POST /api/v1/sessions           → Create session token (login)
DELETE /api/v1/sessions/current → Delete current session (logout)
```

**Controller Changes:**
- `signUp` → Merge into `createUser` (POST /users)
- `signIn` → Becomes `createSession` (POST /sessions)
- `signOut` → Becomes `deleteSession` (DELETE /sessions/current)

**Route Changes:**
- Remove `/api/v1/auth` prefix
- Users POST endpoint becomes multi-purpose (registration + admin user creation)
- New sessions router for token management

---

### Subscriptions - Cancel/Status Update

**Current (Mix of REST + Action):**
```
PATCH /api/v1/subscriptions/:id         → Full/partial update (✓ RESTful)
PATCH /api/v1/subscriptions/:id/status  → Action-like endpoint (✗)
```

**RESTful Design (Choose One):**

**Option A - Standard Partial Update (Recommended):**
```
PATCH /api/v1/subscriptions/:id
Body: { status: "canceled", reason: "no longer needed" }
```
- Uses existing `updateSubscription` controller
- HTTP semantics: PATCH = partial update
- Cleaner, fewer endpoints

**Option B - Sub-Resource (More Explicit):**
```
POST /api/v1/subscriptions/:id/cancellations
Body: { reason: "no longer needed" }
```
- New resource type: cancellation events
- Better for audit trails
- More endpoints but clearer intent

**Option C - State Transitions (Advanced):**
```
POST /api/v1/subscriptions/:id/state-transitions
Body: { newState: "canceled", reason: "..." }
```
- Most explicit about state changes
- Good for complex workflows

**Recommendation:** Use **Option A** (standard PATCH) since it's simplest and `cancelSubscription` just updates the status field.

---

### Workflow - Reminder Job Triggering

**Current (Action-Based):**
```
POST /api/v1/workflows/subscription/reminder
Body: { subscriptionId }
```

**RESTful Design (Choose One):**

**Option A - Reminder Resource (Recommended):**
```
POST /api/v1/subscriptions/:id/reminders
```
- Creates a "reminder" resource for a subscription
- More semantically correct
- Clear parent-child relationship

**Option B - Generic Workflow Runs:**
```
POST /api/v1/workflow-runs
Body: { type: "subscription.reminder", subscriptionId }
```
- If you'll add more workflows later
- More scalable for multiple workflow types

**Option C - Background Jobs:**
```
POST /api/v1/background-jobs
Body: { type: "send-reminder", subscriptionId }
```
- Generic job queue abstraction
- Most flexible for future operations

**Recommendation:** Use **Option A** (sub-resource under subscriptions) for simplicity and clarity.

---

## Complete RESTful Route Map

### Users (Authentication + Admin)
```javascript
// Registration (was /auth/sign-up)
POST /api/v1/users
Body: { name, email, password, role? }
Response: { success, data: { token, user } }

// Get all users (admin only)
GET /api/v1/users
Response: { success, data: [users] }

// Get single user
GET /api/v1/users/:id
Response: { success, data: user }

// Update user
PATCH /api/v1/users/:id
Body: { name?, email?, password? }
Response: { success, data: updatedUser }

// Delete user
DELETE /api/v1/users/:id
Response: { success, message }
```

### Sessions (Authentication)
```javascript
// Create session (was /auth/sign-in)
POST /api/v1/sessions
Body: { email, password }
Response: { success, data: { token, user } }

// Delete current session (was /auth/sign-out)
DELETE /api/v1/sessions/current
Response: { success, message }

// Optional: Delete specific session by ID
DELETE /api/v1/sessions/:id
Response: { success, message }
```

### Subscriptions
```javascript
// List all subscriptions (admin only)
GET /api/v1/subscriptions
Response: { success, data: [subscriptions] }

// Create subscription
POST /api/v1/subscriptions
Body: { name, amount, renewalDate, ... }
Response: { success, data: { subscription, workflowRunId } }

// Get single subscription
GET /api/v1/subscriptions/:id
Response: { success, data: subscription }

// Update subscription (partial update)
PATCH /api/v1/subscriptions/:id
Body: { status: "canceled", name?, amount?, ... }
Response: { success, message, data: updatedSubscription }

// Delete subscription
DELETE /api/v1/subscriptions/:id
Response: { success, message, data: deletedSubscription }

// Get all subscriptions for a user (sub-resource)
GET /api/v1/users/:userId/subscriptions
Response: { success, data: [subscriptions] }

// Create reminder job for subscription (sub-resource)
POST /api/v1/subscriptions/:id/reminders
Body: {} (or optional config)
Response: { success, message, data: { reminder, workflowRunId } }
```

### User Subscriptions (Bulk Operations)
```javascript
// Delete all subscriptions for a user
DELETE /api/v1/users/:userId/subscriptions
Response: { success, data: { deletedCount } }
```

---

## Summary of Changes

| Endpoint | Old Method | New Method | Controller |
|----------|-----------|-----------|-----------|
| User Creation | POST /auth/sign-up | POST /users | `createUser` (new) |
| Session Creation | POST /auth/sign-in | POST /sessions | `createSession` (new) |
| Session Deletion | POST /auth/sign-out | DELETE /sessions/current | `deleteSession` (new) |
| Cancel Subscription | PATCH /subscriptions/:id/status | PATCH /subscriptions/:id | `updateSubscription` (existing) |
| Trigger Reminder | POST /workflows/subscription/reminder | POST /subscriptions/:id/reminders | `createSubscriptionReminder` (new) |

---

## Route File Structure (After Refactor)

```javascript
// app.js changes
app.use('/api/v1/users', userRouter);           // +POST (registration)
app.use('/api/v1/sessions', sessionRouter);     // NEW
app.use('/api/v1/subscriptions', subscriptionRouter); // -reminderRouter

// users.routes.js
userRouter.post("/", signUp);              // Registration
userRouter.get("/", authorize, getUsers);  // Admin only
userRouter.get("/:id", authorize, getUser);
userRouter.patch("/:id", authorize, updateUser);
userRouter.delete("/:id", authorize, deleteUser); // NEW

// sessions.routes.js (NEW)
sessionRouter.post("/", createSession);              // Login
sessionRouter.delete("/current", authorize, deleteSession); // Logout

// subscriptions.routes.js
subscriptionRouter.get("/", authorize, getAllSubscriptions);
subscriptionRouter.post("/", authorize, createSubscription);
subscriptionRouter.get("/:id", authorize, getSubscription);
subscriptionRouter.patch("/:id", authorize, updateSubscription); // handles status change
subscriptionRouter.delete("/:id", authorize, deleteSubscription);
subscriptionRouter.post("/:id/reminders", authorize, createSubscriptionReminder); // NEW

// user.routes.js (for nested resources)
userRouter.get("/:userId/subscriptions", authorize, getUserSubscriptions);
userRouter.delete("/:userId/subscriptions", authorize, deleteUserSubscriptions);
```

---

## Implementation Order

1. **Create SessionsRouter** - Minimal change, new endpoints
2. **Update AuthController** - Split into `createUser`, `createSession`, `deleteSession`
3. **Update UserController** - Add `deleteUser`
4. **Update SubscriptionController** - Simplify `cancelSubscription` → use `updateSubscription`
5. **Create WorkflowController Update** - Convert to `createSubscriptionReminder`
6. **Update app.js** - Modify route mounting and prefixes
7. **Update Route Files** - Connect everything

---

## Backward Compatibility (Optional)

If you want to keep old endpoints working alongside new ones:

```javascript
// In app.js - mount both routers
app.use('/api/v1/users', userRouter);
app.use('/api/v1/sessions', sessionRouter);
app.use('/api/v1/auth', authRouter);        // Keep old endpoints
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter); // Keep for backward compat
```

This allows gradual migration without breaking existing clients.

---

## Benefits of This Design

✅ **Resource-Centric** - Nouns over verbs  
✅ **Hierarchical** - Parent-child relationships clear  
✅ **Self-Documenting** - Endpoints describe what they do  
✅ **Extensible** - Easy to add more sub-resources  
✅ **Standards-Compliant** - Follows REST conventions  
✅ **Scalable** - Same pattern applies to new features  
✅ **Testable** - Clear HTTP semantics for tests  
