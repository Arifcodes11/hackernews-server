import "dotenv/config";
import { serve } from "@hono/node-server";
import { allRoutes } from "./routes/routes.js";
import { Hono } from "hono";


const app = new Hono();

app.route("/", allRoutes);
serve(app);


console.log("server is running at http://localhost:3000");