"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unSecurePostsRoute = void 0;
const http_exception_1 = require("hono/http-exception");
const prisma_1 = require("../../integration/prisma");
const session_middleware_1 = require("../middleware/session-middleware");
exports.unSecurePostsRoute = (0, session_middleware_1.createUnsecureRoute)();
exports.unSecurePostsRoute.get("/:postId", async (context) => {
    const { postId } = context.req.param();
    const post = await prisma_1.prismaClient.post.findUnique({
        where: {
            id: postId,
        },
        include: {
            author: true,
        },
    });
    if (!post) {
        throw new http_exception_1.HTTPException(404);
    }
    return context.json(post);
});
