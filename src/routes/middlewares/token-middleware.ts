import { createMiddleware } from "hono/factory";
import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../../environment.js";

export const tokenMiddleware = createMiddleware<{
  Variables: {
    userId: string;
  };
}>(async (context, next) => {
  const authHeader = context.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return context.json({ message: "missing Token" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, jwtSecretKey) as jwt.JwtPayload;
    const userId = payload.sub;

    if (userId) {
      context.set("userId", userId);
    }

    await next();
  } catch (e) {
    return context.json({ message: "Unauthorized token" }, 401);
  }
});
