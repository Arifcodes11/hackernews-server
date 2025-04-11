import type { OpenAPIV3 } from "openapi-types";

export const openapi: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Hacker News API",
    version: "1.0.0",
    description: "API documentation for the HackerNews backend server",
  },
  components: {
    securitySchemes: {
      TokenAuth: {
        type: "apiKey",
        in: "header",
        name: "token", 
      },
    },
    schemas: {
      AuthInput: {
        type: "object",
        properties: {
          username: { type: "string" },
          password: { type: "string" },
        },
        required: ["username", "password"],
      },
      PostInput: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          content: { type: "string" },
        },
        required: ["title", "description", "content"],
      },
      CommentInput: {
        type: "object",
        properties: {
          content: { type: "string" },
        },
        required: ["content"],
      },
    },
  },
  paths: {
    "/auth/sign-up": {
      post: {
        summary: "Sign up a user",
        description: "Signs up a user and returns a JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthInput" },
            },
          },
        },
        responses: {
          "200": { description: "User signed up successfully" },
        },
      },
    },
    "/auth/log-in": {
      post: {
        summary: "Log in a user",
        description: "Logs in a user and returns a JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthInput" },
            },
          },
        },
        responses: {
          "200": { description: "Login successful" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/users/me": {
      get: {
        summary: "Get current user info",
        description: "Returns user details based on JWT token",
        security: [{ TokenAuth: [] }],
        responses: {
          "200": { description: "Current user data" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/users": {
      get: {
        summary: "Get all users",
        description: "Returns users in alphabetical order (paginated)",
        security: [{ TokenAuth: [] }],
        responses: {
          "200": { description: "List of users" },
        },
      },
    },
    "/posts": {
      get: {
        summary: "Get all posts",
        description: "Returns posts in reverse chronological order (paginated)",
        security: [{ TokenAuth: [] }],
        responses: {
          "200": { description: "List of posts" },
        },
      },
      post: {
        summary: "Create a post",
        description: "Creates a new post authored by the current user",
        security: [{ TokenAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PostInput" },
            },
          },
        },
        responses: {
          "201": { description: "Post created" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/posts/me": {
      get: {
        summary: "Get current user posts",
        description:
          "Returns current user posts in reverse chronological order",
        security: [{ TokenAuth: [] }],
        responses: {
          "200": { description: "List of user posts" },
        },
      },
    },
    "/posts/{postId}": {
      delete: {
        summary: "Delete a post",
        description: "Deletes the post if it belongs to the current user",
        security: [{ TokenAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Post deleted" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/likes/on/{postId}": {
      get: {
        summary: "Get likes on a post",
        description: "Returns likes in reverse chronological order (paginated)",
        security: [{ TokenAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "List of likes" },
        },
      },
      post: {
        summary: "Like a post",
        description: "Likes a post if not already liked by the current user",
        security: [{ TokenAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "201": { description: "Like added" },
        },
      },
      delete: {
        summary: "Remove like from a post",
        description: "Deletes the user's like on a post if it exists",
        security: [{ TokenAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Like deleted" },
        },
      },
    },
    "/comments/on/{postId}": {
      get: {
        summary: "Get comments on a post",
        description:
          "Returns comments in reverse chronological order (paginated)",
        security: [{ TokenAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "List of comments" },
        },
      },
      post: {
        summary: "Add comment to a post",
        description: "Adds a new comment on a post by the current user",
        security: [{ TokenAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CommentInput" },
            },
          },
        },
        responses: {
          "201": { description: "Comment created" },
        },
      },
    },
    "/comments/{commentId}": {
      delete: {
        summary: "Delete a comment",
        description: "Deletes a comment if authored by the current user",
        security: [{ TokenAuth: [] }],
        parameters: [
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Comment deleted" },
        },
      },
      patch: {
        summary: "Edit a comment",
        description: "Updates comment text if it belongs to current user",
        security: [{ TokenAuth: [] }],
        parameters: [
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CommentInput" },
            },
          },
        },
        responses: {
          "200": { description: "Comment updated" },
        },
      },
    },
  },
};