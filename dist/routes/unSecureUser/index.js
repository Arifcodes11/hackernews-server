"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unSecureUserRoute = void 0;
const http_exception_1 = require("hono/http-exception");
const session_middleware_1 = require("../middleware/session-middleware");
const prisma_1 = require("../../integration/prisma");
exports.unSecureUserRoute = (0, session_middleware_1.createUnsecureRoute)();
exports.unSecureUserRoute.get("/:userId", async (context) => {
    const userId = context.req.param("userId");
    const getUser = await prisma_1.prismaClient.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            posts: {
                include: {
                    author: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });
    if (!getUser) {
        throw new http_exception_1.HTTPException(404, {
            message: "User not found",
        });
    }
    return context.json({
        user: getUser,
    });
});
