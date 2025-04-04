import "dotenv/config";
import { serve } from "@hono/node-server";
import { allRoutes } from "./routes/routes.js";

serve(allRoutes, (info) => {
  console.log(`SERVER RUNNING ON PORT ${info.port}`);
});
