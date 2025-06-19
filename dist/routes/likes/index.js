"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likesRoute = void 0;
const http_exception_1 = require("hono/http-exception");
const prisma_1 = require("../../integration/prisma");
const session_middleware_1 = require("../middleware/session-middleware");
exports.likesRoute = (0, session_middleware_1.createSecureRoute)();
// Update the POST route handler
exports.likesRoute.post("/:postId", async (context) => {
    const { postId } = context.req.param();
    const user = context.get("user");
    // Check if post exists
    const post = await prisma_1.prismaClient.post.findUnique({
        where: { id: postId }
    });
    if (!post) {
        throw new http_exception_1.HTTPException(404, { message: "Post not found" });
    }
    // Check for existing like first
    const existingLike = await prisma_1.prismaClient.like.findUnique({
        where: {
            postId_userId: {
                postId,
                userId: user.id
            }
        }
    });
    if (existingLike) {
        throw new http_exception_1.HTTPException(409, {
            message: "You've already liked this post"
        });
    }
    // Create new like if it doesn't exist
    const like = await prisma_1.prismaClient.like.create({
        data: {
            postId,
            userId: user.id
        }
    });
    return context.json(like);
});
exports.likesRoute.get("/:postId", async (context) => {
    const { postId } = context.req.param();
    const user = context.get("user");
    const post = await prisma_1.prismaClient.post.findUnique({
        where: { id: postId },
        include: { author: true },
    });
    if (!post) {
        throw new http_exception_1.HTTPException(404, { message: "Post not found" });
    }
    const like = await prisma_1.prismaClient.like.findFirst({
        where: {
            postId,
            userId: user.id,
        },
    });
    const totalLikes = await prisma_1.prismaClient.like.count({
        where: { postId },
    });
    return context.json({
        liked: !!like,
        count: totalLikes,
    });
});
// Update the DELETE route handler
exports.likesRoute.delete("/:postId", async (context) => {
    const { postId } = context.req.param();
    const user = context.get("user");
    // Simplified check - no need to fetch full post
    const existingLike = await prisma_1.prismaClient.like.findUnique({
        where: {
            postId_userId: {
                postId,
                userId: user.id
            }
        }
    });
    if (!existingLike) {
        return context.json({
            success: false,
            message: "Like not found"
        }, 404); // Return proper 404 status
    }
    await prisma_1.prismaClient.like.delete({
        where: {
            postId_userId: {
                postId,
                userId: user.id
            }
        }
    });
    return context.json({
        success: true,
        message: "Like removed"
    });
});
