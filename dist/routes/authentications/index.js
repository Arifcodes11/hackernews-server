"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationsRoute = void 0;
const better_auth_1 = require("../../integration/better-auth");
const session_middleware_1 = require("../middleware/session-middleware");
exports.authenticationsRoute = (0, session_middleware_1.createUnsecureRoute)();
exports.authenticationsRoute.use((context) => {
    return better_auth_1.betterAuthClient.handler(context.req.raw);
});
