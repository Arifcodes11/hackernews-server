import { Hono } from "hono";
import { openapi } from "../docs/openapi.js";
import { swaggerUI } from "@hono/swagger-ui";

export const swaggerRoutes = new Hono();

swaggerRoutes.get("/doc", (c) => c.json(openapi));
swaggerRoutes.get("/ui", swaggerUI({ url: "/doc" }));