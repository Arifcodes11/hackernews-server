"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const logger_1 = require("hono/logger");
const authentications_1 = require("./routes/authentications");
const cors_1 = require("hono/cors");
const environment_1 = require("./utils/environment");
const feed_1 = require("./routes/posts/feed");
const user_1 = require("./routes/user");
const likes_1 = require("./routes/likes");
const comments_1 = require("./routes/comments");
const UnsecurePost_1 = require("./routes/UnsecurePost");
const posts_1 = require("./routes/posts");
const unSecureUser_1 = require("./routes/unSecureUser");
const search_1 = require("./routes/posts/search");
const allRoutes = new hono_1.Hono();
allRoutes.use((0, cors_1.cors)({
    origin: environment_1.webClientUrl,
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    exposeHeaders: ["Content-Length"],
    credentials: true,
    maxAge: 600,
}));
allRoutes.use("*", (0, logger_1.logger)());
allRoutes.route("/authentication", authentications_1.authenticationsRoute);
allRoutes.route("/posts", UnsecurePost_1.unSecurePostsRoute);
allRoutes.route("/users-profile", unSecureUser_1.unSecureUserRoute);
allRoutes.route("/feeds/search", search_1.searchRoute);
allRoutes.route("/posts", posts_1.postsRoute);
allRoutes.route("/feeds", feed_1.feedRoute);
allRoutes.route("/profile", user_1.userRoute);
allRoutes.route("/likes", likes_1.likesRoute);
allRoutes.route("/comments", comments_1.commentRoute);
(0, node_server_1.serve)(allRoutes, ({ port }) => {
    console.log(`Running at http//:localhost:${port}`);
});
