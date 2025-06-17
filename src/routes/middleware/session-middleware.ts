import type { Session, User } from "better-auth";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { betterAuthClient } from "../../integration/better-auth";
import { Hono } from "hono";

export type SecureSession = {
  Variables: {
    user: User;
    session: Session;
  };
};

export const createUnsecureRoute = (): Hono => {
  const route = new Hono();
  return route;
};

export const createSecureRoute = (): Hono<SecureSession> => {
  const route = new Hono<SecureSession>();

  route.use(authenticationMiddleware);

  return route;
};

export const authenticationMiddleware = createMiddleware<SecureSession>(
  async (context, next) => {
    try {
      console.log("Authentication middleware called");
      const session = await betterAuthClient.api.getSession({
        headers: context.req.raw.headers,
      });

      if (!session) {
        console.log("No session found");
        throw new HTTPException(401, { message: "No session found" });
      }

      console.log("Session found for user:", session.user.id);
      context.set("user", session.user as User);
      context.set("session", session.session as Session);
      return await next();
    } catch (error) {
      console.error("Authentication error:", error);
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(401, { message: "Authentication failed" });
    }
  }
);
