import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes.js";
import { usersRoutes } from "./user-routes.js";
import { postsRoutes } from "./post-routes.js";
import { likeRoutes } from "./likes-routes.js";
import { commentRoutes } from "./comments-routes.js";
import { openapi } from "../docs/openapi.js";
import { swaggerUI } from "@hono/swagger-ui";
import { logger } from "hono/logger";

export const allRoutes = new Hono();
allRoutes.use(logger());

allRoutes.route("/auth", authenticationRoutes);
allRoutes.route("/users", usersRoutes);
allRoutes.route("/posts", postsRoutes);
allRoutes.route("/likes", likeRoutes);
allRoutes.route("/comments", commentRoutes);
allRoutes.get("/doc", (c) => c.json(openapi));
allRoutes.get("/ui", swaggerUI({ url: "/doc" }));
