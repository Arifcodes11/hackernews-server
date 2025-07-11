// import { serve } from "@hono/node-server";
// import { Hono } from "hono";
// import { logger } from "hono/logger";
// import { authenticationsRoute } from "./routes/authentications";
// import { cors } from "hono/cors";
// import { webClientUrl } from "./utils/environment";
// import { feedRoute } from "./routes/posts/feed";
// import { userRoute } from "./routes/user";
// import { likesRoute } from "./routes/likes";
// import { commentRoute } from "./routes/comments";
// import { unSecurePostsRoute } from "./routes/UnsecurePost";
// import { postsRoute } from "./routes/posts";
// import { unSecureUserRoute } from "./routes/unSecureUser";
// import { searchRoute } from "./routes/posts/search";

// const allRoutes = new Hono();


// allRoutes.use(
//   cors({
//     origin: [webClientUrl, 'http://localhost:5173', 'http://localhost:3000'],
//     allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
//     allowHeaders: ["Authorization", "Content-Type"],
//     exposeHeaders: ["Content-Length"],
//     credentials: true,
//     maxAge: 600,
//   })
// );


// allRoutes.use("*", logger());
// allRoutes.route("/authentication", authenticationsRoute);
// allRoutes.route("/posts", unSecurePostsRoute);
// allRoutes.route("/users-profile", unSecureUserRoute);
// allRoutes.route("/feeds/search", searchRoute);
// allRoutes.route("/posts", postsRoute);
// allRoutes.route("/feeds", feedRoute);
// allRoutes.route("/profile", userRoute);
// allRoutes.route("/likes", likesRoute);
// allRoutes.route("/comments", commentRoute);

// serve(allRoutes, ({ port }) => {
//   console.log(`Running at http//:localhost:${port}`);
// });
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import { authenticationsRoute } from "./routes/authentications";
import { webClientUrl } from "./utils/environment";
import { feedRoute } from "./routes/posts/feed";
import { userRoute } from "./routes/user";
import { likesRoute } from "./routes/likes";
import { commentRoute } from "./routes/comments";
import { unSecurePostsRoute } from "./routes/UnsecurePost";
import { postsRoute } from "./routes/posts";
import { unSecureUserRoute } from "./routes/unSecureUser";
import { searchRoute } from "./routes/posts/search";

const app = new Hono();

// ✅ Optional test route for health check
app.get("/", (c) => c.text("✅ API is running"));

// ✅ CORS setup
app.use(
  cors({
    origin: (origin) => {
      const allowed = [webClientUrl, "http://localhost:5173", "http://localhost:3000"];
      if (allowed.includes(origin ?? "")) {
        return origin;
      }
      return null;
    },
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    exposeHeaders: ["Content-Length"],
    credentials: true,
    maxAge: 600,
  })
);

app.use("*", logger());

app.route("/authentication", authenticationsRoute);
app.route("/posts", unSecurePostsRoute);
app.route("/users-profile", unSecureUserRoute);
app.route("/feeds/search", searchRoute);
app.route("/posts", postsRoute);
app.route("/feeds", feedRoute);
app.route("/profile", userRoute);
app.route("/likes", likesRoute);
app.route("/comments", commentRoute);

// ✅ Bind to correct hostname and port for Azure
serve({
  fetch: app.fetch,
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  hostname: "0.0.0.0",
});
