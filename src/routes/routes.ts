import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";


import { usersRoutes } from "./users/users-routes.js";
import { postsRoutes } from "./posts/posts-routes.js";
import { likesRoutes } from "./likes/likes-routes.js";
import { commentsRoutes } from "./comments/comments-routes.js";

import { cors } from "hono/cors";
import { authRoute } from "./middlewares/session-middleware.js";
import { webClientUrl } from "../environment.js";
import { prismaClient as prisma } from "../integrations/prisma/index.js";
export const allRoutes = new Hono();

allRoutes.use(
  cors({
    origin: [webClientUrl],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization", "token"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);



allRoutes.route("/api/auth", authRoute);

allRoutes.route("/users", usersRoutes);
allRoutes.route("/posts", postsRoutes);
allRoutes.route("/likes", likesRoutes);
allRoutes.route("/comments", commentsRoutes);

allRoutes.get("/search", async (context) => {
  const { q: query = "", limit = "10", offset = "0" } = context.req.query();

  if (!query) {
    return context.json(
      { success: false, message: "Missing search query." },
      400
    );
  }

  try {
    const searchResults = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return context.json({
      success: true,
      data: searchResults,
      meta: {
        count: searchResults.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error("Search failed:", error);
    return context.json({ success: false, message: "Search failed." }, 500);
  }
});
