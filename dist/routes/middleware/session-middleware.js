"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationMiddleware = exports.createSecureRoute = exports.createUnsecureRoute = void 0;
const factory_1 = require("hono/factory");
const http_exception_1 = require("hono/http-exception");
const better_auth_1 = require("../../integration/better-auth");
const hono_1 = require("hono");
const createUnsecureRoute = () => {
    const route = new hono_1.Hono();
    return route;
};
exports.createUnsecureRoute = createUnsecureRoute;
const createSecureRoute = () => {
    const route = new hono_1.Hono();
    route.use(exports.authenticationMiddleware);
    return route;
};
exports.createSecureRoute = createSecureRoute;
exports.authenticationMiddleware = (0, factory_1.createMiddleware)(async (context, next) => {
    console.log("Authentication middleware called");
    const session = await better_auth_1.betterAuthClient.api.getSession({
        headers: context.req.raw.headers,
    });
    if (!session) {
        throw new http_exception_1.HTTPException(401);
    }
    context.set("user", session.user);
    context.set("session", session.session);
    return await next();
});
