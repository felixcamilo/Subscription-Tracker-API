import { LOCAL_URL, RENDER_URL } from "../config/env.js";

const localServer = LOCAL_URL ? `${LOCAL_URL}/api/v1` : "http://localhost:3000/api/v1";
const productionServer = RENDER_URL
  ? `${RENDER_URL}/api/v1`
  : "https://your-deployment-url.onrender.com/api/v1";

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Subscription Tracker API",
    version: "1.0.0",
    description:
      "REST API for authentication, user management, subscription tracking, and automated renewal reminders.",
  },
  servers: [
    { url: localServer, description: "Local development" },
    { url: productionServer, description: "Production deployment" },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Users", description: "User and user-subscription management endpoints" },
    { name: "Subscriptions", description: "Subscription management endpoints" },
    { name: "Workflows", description: "Internal workflow endpoints" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
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
          error: { type: "string", example: "Validation failed" },
          message: { type: "string", example: "Unauthorized" },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "65f7b6bd8f1b6ecbb1f9a7a1",
          },
          name: { type: "string", example: "Camilo Javier" },
          email: { type: "string", format: "email", example: "camilo@example.com" },
          role: { type: "string", enum: ["admin", "user"], example: "user" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      AuthSuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "User signed in successfully" },
          data: {
            type: "object",
            properties: {
              token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
              user: { $ref: "#/components/schemas/User" },
            },
          },
        },
      },
      SignUpRequest: {
        type: "object",
        required: ["name", "email", "password", "role"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 50, example: "Camilo Javier" },
          email: { type: "string", format: "email", example: "camilo@example.com" },
          password: { type: "string", minLength: 6, example: "strongPassword123" },
          role: { type: "string", enum: ["admin", "user"], example: "user" },
        },
      },
      SignInRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "camilo@example.com" },
          password: { type: "string", example: "strongPassword123" },
        },
      },
      UpdateUserRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Camilo Updated" },
          email: { type: "string", format: "email", example: "updated@example.com" },
          role: { type: "string", enum: ["admin", "user"], example: "user" },
        },
      },
      SubscriptionInput: {
        type: "object",
        required: ["name", "price", "currency", "category", "paymentMethod", "startDate"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100, example: "Netflix Premium" },
          price: { type: "number", minimum: 0, example: 19.99 },
          currency: { type: "string", enum: ["USD", "EUR", "DOP", "BTC"], example: "USD" },
          frequency: {
            type: "string",
            enum: ["daily", "weekly", "monthly", "yearly"],
            example: "monthly",
          },
          category: {
            type: "string",
            enum: [
              "sports",
              "news",
              "entertainment",
              "lifestyle",
              "technology",
              "finance",
              "politics",
              "education",
              "other",
            ],
            example: "entertainment",
          },
          paymentMethod: { type: "string", example: "Visa **** 4242" },
          status: {
            type: "string",
            enum: ["active", "expired", "canceled"],
            example: "active",
          },
          startDate: { type: "string", format: "date-time", example: "2026-01-01T00:00:00.000Z" },
          renewalDate: {
            type: "string",
            format: "date-time",
            example: "2026-02-01T00:00:00.000Z",
            description: "Optional. If omitted, it is auto-calculated from frequency.",
          },
        },
      },
      SubscriptionUpdateRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Netflix Standard" },
          price: { type: "number", example: 14.99 },
          currency: { type: "string", enum: ["USD", "EUR", "DOP", "BTC"], example: "USD" },
          frequency: {
            type: "string",
            enum: ["daily", "weekly", "monthly", "yearly"],
            example: "monthly",
          },
          category: {
            type: "string",
            enum: [
              "sports",
              "news",
              "entertainment",
              "lifestyle",
              "technology",
              "finance",
              "politics",
              "education",
              "other",
            ],
            example: "entertainment",
          },
          paymentMethod: { type: "string", example: "Mastercard **** 1133" },
          status: {
            type: "string",
            enum: ["active", "expired", "canceled"],
            example: "active",
          },
          startDate: { type: "string", format: "date-time" },
          renewalDate: { type: "string", format: "date-time" },
        },
      },
      Subscription: {
        type: "object",
        properties: {
          _id: { type: "string", example: "65f7b7558f1b6ecbb1f9a7b1" },
          name: { type: "string", example: "Netflix Premium" },
          price: { type: "number", example: 19.99 },
          currency: { type: "string", enum: ["USD", "EUR", "DOP", "BTC"], example: "USD" },
          frequency: {
            type: "string",
            enum: ["daily", "weekly", "monthly", "yearly"],
            example: "monthly",
          },
          category: {
            type: "string",
            enum: [
              "sports",
              "news",
              "entertainment",
              "lifestyle",
              "technology",
              "finance",
              "politics",
              "education",
              "other",
            ],
            example: "entertainment",
          },
          paymentMethod: { type: "string", example: "Visa **** 4242" },
          status: {
            type: "string",
            enum: ["active", "expired", "canceled"],
            example: "active",
          },
          startDate: { type: "string", format: "date-time" },
          renewalDate: { type: "string", format: "date-time" },
          user: { type: "string", example: "65f7b6bd8f1b6ecbb1f9a7a1" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateSubscriptionResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            properties: {
              subscription: { $ref: "#/components/schemas/Subscription" },
              workflowRunId: { type: "string", example: "wfr_2u32jm7akf..." },
            },
          },
        },
      },
      WorkflowReminderRequest: {
        type: "object",
        required: ["subscriptionId"],
        properties: {
          subscriptionId: { type: "string", example: "65f7b7558f1b6ecbb1f9a7b1" },
        },
      },
    },
  },
  paths: {
    "/auth/sign-up": {
      post: {
        tags: ["Auth"],
        summary: "Create a new user account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SignUpRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "User created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthSuccessResponse" },
              },
            },
          },
          409: { description: "User already exists" },
          400: { description: "Validation error" },
        },
      },
    },
    "/auth/sign-in": {
      post: {
        tags: ["Auth"],
        summary: "Authenticate user and return JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SignInRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "User authenticated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthSuccessResponse" },
              },
            },
          },
          401: { description: "Invalid credentials" },
          404: { description: "User not found" },
        },
      },
    },
    "/auth/sign-out": {
      post: {
        tags: ["Auth"],
        summary: "Sign out user",
        responses: {
          200: {
            description: "Sign out successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "User signed out successfully" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users (admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/users/current/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get one user by id (admin or owner)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "User id",
          },
        ],
        responses: {
          200: {
            description: "User returned",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          404: { description: "User not found" },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update user by id (admin or owner)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "User id",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUserRequest" },
            },
          },
        },
        responses: {
          200: { description: "User updated" },
          401: { description: "Unauthorized" },
          404: { description: "User not found" },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user by id (admin or owner)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "User id",
          },
        ],
        responses: {
          200: { description: "User deleted" },
          401: { description: "Unauthorized" },
          404: { description: "User not found" },
        },
      },
    },
    "/users/{id}/subscriptions": {
      get: {
        tags: ["Users"],
        summary: "Get all subscriptions for one user (admin or owner)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "User id",
          },
        ],
        responses: {
          200: {
            description: "Subscriptions returned",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Subscription" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete all subscriptions for one user (admin or owner)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "User id",
          },
        ],
        responses: {
          200: { description: "Subscriptions deleted" },
          401: { description: "Unauthorized" },
          404: { description: "No subscriptions found" },
        },
      },
    },
    "/subscriptions": {
      post: {
        tags: ["Subscriptions"],
        summary: "Create subscription and trigger reminder workflow",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SubscriptionInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Subscription created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateSubscriptionResponse" },
              },
            },
          },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
        },
      },
      get: {
        tags: ["Subscriptions"],
        summary: "Get all subscriptions (admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Subscriptions returned",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Subscription" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/subscriptions/upcoming-renewals": {
      get: {
        tags: ["Subscriptions"],
        summary: "Get subscriptions renewing in next 7 days (current user)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Upcoming renewals returned",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Subscription" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/subscriptions/{id}": {
      get: {
        tags: ["Subscriptions"],
        summary: "Get subscription by id (owner only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Subscription id",
          },
        ],
        responses: {
          200: {
            description: "Subscription returned",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Subscription" },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          404: { description: "Subscription not found" },
        },
      },
      put: {
        tags: ["Subscriptions"],
        summary: "Update subscription by id (owner only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Subscription id",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SubscriptionUpdateRequest" },
            },
          },
        },
        responses: {
          200: { description: "Subscription updated" },
          400: { description: "No valid fields to update" },
          401: { description: "Unauthorized" },
          404: { description: "Subscription not found" },
        },
      },
      delete: {
        tags: ["Subscriptions"],
        summary: "Delete subscription by id (owner only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Subscription id",
          },
        ],
        responses: {
          200: { description: "Subscription deleted" },
          401: { description: "Unauthorized" },
          404: { description: "Subscription not found" },
        },
      },
    },
    "/workflows/subscription/reminder": {
      post: {
        tags: ["Workflows"],
        summary: "Trigger subscription reminder workflow",
        description: "Internal endpoint used by Upstash Workflow to process reminder schedule.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/WorkflowReminderRequest" },
            },
          },
        },
        responses: {
          200: { description: "Workflow accepted" },
          400: { description: "Invalid payload" },
        },
      },
    },
  },
};

export default openApiSpec;
