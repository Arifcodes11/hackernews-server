"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedRoute = void 0;
const prisma_1 = require("../../../integration/prisma");
const session_middleware_1 = require("../../middleware/session-middleware");
const pagination_1 = require("../../../extras/pagination");
exports.feedRoute = (0, session_middleware_1.createSecureRoute)();
exports.feedRoute.get("", async (context) => {
    const user = context.get("user");
    // Get pagination parameters
    const { page, limit, skip } = (0, pagination_1.getPagination)(context);
    const latestPosts = await prisma_1.prismaClient.post.findMany({
        include: {
            author: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: limit,
        skip: skip,
    });
    return context.json({
        page,
        limit,
        data: latestPosts,
    });
});
exports.feedRoute.delete("/:postId", async (context) => {
    const { postId } = context.req.param();
    const user = context.get("user");
    const post = await prisma_1.prismaClient.post.delete({
        where: {
            id: postId,
            authorId: user.id,
        },
        include: {
            author: true,
        },
    });
    return context.json(post);
});
