const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Subscription Tracker API",
    version: "1.0.0",
    description: "Swagger/OpenAPI documentation for the current API routes.",
  },
  servers: [
    {
      url: "/api/v1",
      description: "Current host",
    },
  ],
  tags: [
    { name: "Users" },
    { name: "Sessions" },
    { name: "Subscriptions" },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: { type: "string", example: "Validation error" },
        },
      },
      AuthMiddlewareError: {
        type: "object",
        properties: {
          message: { type: "string", example: "Unauthorized" },
          error: { type: "string", example: "jwt malformed" },
        },
      },
      UserCreateRequest: {
        type: "object",
        required: ["name", "email", "password", "role"],
        properties: {
          name: { type: "string", example: "John Doe" },
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", example: "SecurePassword123" },
          role: { type: "string", enum: ["admin", "user"], example: "user" },
        },
      },
      SessionCreateRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", example: "SecurePassword123" },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "507f1f77bcf86cd799439011" },
          name: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john@example.com" },
          role: { type: "string", enum: ["admin", "user"], example: "user" },
        },
      },
      SubscriptionCreateRequest: {
        type: "object",
        required: [
          "name",
          "price",
          "currency",
          "frequency",
          "category",
          "paymentMethod",
          "startDate",
        ],
        properties: {
          name: { type: "string", example: "Netflix Premium" },
          price: { type: "number", example: 15.99 },
          currency: { type: "string", enum: ["USD", "EUR", "DOP"], example: "USD" },
          frequency: { type: "string", enum: ["daily", "weekly", "monthly", "yearly"], example: "monthly" },
          category: {
            type: "string",
            enum: ["sports", "news", "entertainment", "lifestyle", "technology", "finance", "politics", "other"],
            example: "entertainment",
          },
          paymentMethod: { type: "string", example: "credit card" },
          status: { type: "string", enum: ["active", "expired", "canceled"], example: "active" },
          startDate: { type: "string", format: "date", example: "2026-01-01" },
          renewalDate: { type: "string", format: "date", example: "2026-02-01" },
        },
      },
      SubscriptionUpdateRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          price: { type: "number" },
          currency: { type: "string", enum: ["USD", "EUR", "DOP"] },
          frequency: { type: "string", enum: ["daily", "weekly", "monthly", "yearly"] },
          category: {
            type: "string",
            enum: ["sports", "news", "entertainment", "lifestyle", "technology", "finance", "politics", "other"],
          },
          paymentMethod: { type: "string" },
          status: { type: "string", enum: ["active", "expired", "canceled"] },
          startDate: { type: "string", format: "date" },
          renewalDate: { type: "string", format: "date" },
        },
      },
      Subscription: {
        type: "object",
        properties: {
          _id: { type: "string", example: "507f1f77bcf86cd799439012" },
          name: { type: "string", example: "Netflix Premium" },
          price: { type: "number", example: 15.99 },
          currency: { type: "string", example: "USD" },
          frequency: { type: "string", example: "monthly" },
          category: { type: "string", example: "entertainment" },
          paymentMethod: { type: "string", example: "credit card" },
          status: { type: "string", example: "active" },
          startDate: { type: "string", format: "date-time" },
          renewalDate: { type: "string", format: "date-time" },
          user: { type: "string", example: "507f1f77bcf86cd799439011" },
        },
      },
    },
  },
  paths: {
    "/users": {
      post: {
        tags: ["Users"],
        summary: "Create user (sign up)",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UserCreateRequest" } } },
        },
        responses: {
          201: { description: "Created" },
          400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          409: { description: "User already exists", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      get: {
        tags: ["Users"],
        summary: "Get all users (admin only)",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "OK" },
          401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthMiddlewareError" } } } },
          403: { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get one user",
        security: [{ BearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "OK" },
          401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthMiddlewareError" } } } },
          404: { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      patch: {
        tags: ["Users"],
        summary: "Update user (owner or admin)",
        security: [{ BearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", additionalProperties: true } } } },
        responses: {
          200: { description: "Updated" },
          401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthMiddlewareError" } } } },
          403: { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          404: { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/users/{id}/subscriptions": {
      get: {
        tags: ["Users"],
        summary: "Get all subscriptions for one user (owner or admin)",
        security: [{ BearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "OK" },
          401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthMiddlewareError" } } } },
          403: { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete all subscriptions for one user (owner or admin)",
        security: [{ BearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Deleted" },
          401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthMiddlewareError" } } } },
          403: { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/sessions": {
      post: {
        tags: ["Sessions"],
        summary: "Create session (sign in)",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/SessionCreateRequest" } } },
        },
        responses: {
          200: { description: "Signed in" },
          401: { description: "Invalid password", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/sessions/current": {
      delete: {
        tags: ["Sessions"],
        summary: "Delete current session (sign out)",
        security: [],
        description: "Route exists but current controller implementation is a stub.",
        responses: {
          200: { description: "Expected response once implemented" },
        },
      },
    },
    "/subscriptions": {
      get: {
        tags: ["Subscriptions"],
        summary: "Get all subscriptions (admin only)",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "OK" },
          401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthMiddlewareError" } } } },
          403: { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      post: {
        tags: ["Subscriptions"],
        summary: "Create subscription",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/SubscriptionCreateRequest" } } },
        },
        responses: {
          201: { description: "Created" },
          400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthMiddlewareError" } } } },
        },
      },
    },
    "/subscriptions/{id}": {
      get: {
        tags: ["Subscriptions"],
        summary: "Get one subscription (owner or admin)",
        security: [{ BearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "OK" },
          401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthMiddlewareError" } } } },
          403: { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          404: { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      patch: {
        tags: ["Subscriptions"],
        summary: "Update subscription (owner only in current code)",
        security: [{ BearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/SubscriptionUpdateRequest" } } },
        },
        responses: {
          200: { description: "Updated" },
          401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthMiddlewareError" } } } },
          403: { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          404: { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Subscriptions"],
        summary: "Delete subscription (owner only in current code)",
        security: [{ BearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Deleted" },
          401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthMiddlewareError" } } } },
          403: { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          404: { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/subscriptions/{id}/reminders": {
      post: {
        tags: ["Subscriptions"],
        summary: "Trigger reminders workflow",
        description: "Workflow endpoint. Current handler expects `subscriptionId` in payload.",
        security: [{ BearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["subscriptionId"],
                properties: {
                  subscriptionId: { type: "string", example: "507f1f77bcf86cd799439012" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Accepted/executed by workflow handler" },
          401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthMiddlewareError" } } } },
        },
      },
    },
  },
};

export default openApiDocument;
