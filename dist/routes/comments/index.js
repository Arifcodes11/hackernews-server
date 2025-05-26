"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRoute = void 0;
const zod_1 = require("zod");
const session_middleware_1 = require("../middleware/session-middleware");
const zod_validator_1 = require("@hono/zod-validator");
const prisma_1 = require("../../integration/prisma");
exports.commentRoute = (0, session_middleware_1.createSecureRoute)();
exports.commentRoute.post("/:postId", (0, zod_validator_1.zValidator)("json", zod_1.z.object({
    content: zod_1.z.string().min(1, "only non-empty strings are allowed in text"),
})), async (context) => {
    const { postId } = context.req.param();
    const user = context.get("user");
    const { content } = context.req.valid("json");
    const comment = await prisma_1.prismaClient.comment.create({
        data: {
            content,
            userId: user.id,
            postId: postId, // ✅ assign postId as foreign key
        },
        include: {
            user: true,
        },
    });
    return context.json(comment, 201);
});
exports.commentRoute.get("/:postId", async (context) => {
    const { postId } = context.req.param();
    const post = await prisma_1.prismaClient.comment.findMany({
        where: {
            postId: postId,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: true,
        },
    });
    return context.json(post);
});
exports.commentRoute.delete("/:commentId", async (context) => {
    const { commentId } = context.req.param();
    const user = context.get("user");
    const comment = await prisma_1.prismaClient.comment.delete({
        where: {
            id: commentId,
            userId: user.id,
        },
        include: {
            user: true,
        },
    });
    return context.json(comment);
});
exports.commentRoute.patch("/:commentId", (0, zod_validator_1.zValidator)("json", zod_1.z.object({
    content: zod_1.z.string().min(1, "only non-empty strings are allowed in text"),
})), async (context) => {
    const { commentId } = context.req.param();
    const user = context.get("user");
    const { content } = context.req.valid("json");
    const comment = await prisma_1.prismaClient.comment.update({
        where: {
            id: commentId,
            userId: user.id,
        },
        data: {
            content,
        },
        include: {
            user: true,
        },
    });
    return context.json(comment);
});
//count of comment by based on postId
exports.commentRoute.get("/count/:postId", async (context) => {
    const { postId } = context.req.param();
    const count = await prisma_1.prismaClient.comment.count({
        where: {
            postId: postId,
        },
    });
    return context.json(count);
});
