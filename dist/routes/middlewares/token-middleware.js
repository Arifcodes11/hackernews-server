import { createMiddleware } from "hono/factory";
import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../../environment.js";
export const tokenMiddleware = createMiddleware(async (context, next) => {
    const token = context.req.header("token");
    if (!token) {
        return context.json({ error: "Unauthorized" }, 401);
    }
    try {
        const payload = jwt.verify(token, jwtSecretKey);
        const userId = payload.sub;
        if (userId) {
            context.set("userId", userId);
        }
        await next();
    }
    catch (error) {
        return context.json({ error: "Unauthorized" }, 401);
    }
});
