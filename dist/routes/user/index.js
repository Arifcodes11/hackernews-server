"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const http_exception_1 = require("hono/http-exception");
const session_middleware_1 = require("../middleware/session-middleware");
const prisma_1 = require("../../integration/prisma");
exports.userRoute = (0, session_middleware_1.createSecureRoute)();
exports.userRoute.get("/me", async (context) => {
    const user = context.get("user");
    const getUser = await prisma_1.prismaClient.user.findUnique({
        where: { id: user.id },
        include: {
            posts: {
                include: { author: true },
                orderBy: { createdAt: "desc" },
            },
            Like: {
                include: {
                    post: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
            Comment: {
                include: {
                    post: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });
    if (!getUser) {
        throw new http_exception_1.HTTPException(404, {
            message: "User not found",
        });
    }
    const likedPosts = getUser.Like.map((like) => ({
        postId: like.post.id,
        title: like.post.title,
        likedAt: like.createdAt,
    }));
    const commentedPosts = getUser.Comment.map((comment) => ({
        postId: comment.post?.id,
        title: comment.post?.title,
        commentText: comment.content,
        commentedAt: comment.createdAt,
    }));
    return context.json({
        user: {
            id: getUser.id,
            name: getUser.name,
            email: getUser.email,
            about: getUser.about,
            image: getUser.image,
            createdAt: getUser.createdAt,
            posts: getUser.posts,
            likedPosts,
            commentedPosts,
        },
    });
});
exports.userRoute.patch("/me", async (context) => {
    const user = context.get("user");
    const data = await context.req.json();
    const updateUser = await prisma_1.prismaClient.user.update({
        where: {
            id: user.id
        },
        data: {
            name: data.name,
            about: data.about,
            image: data.image,
            email: data.email,
        }
    });
    return context.json({
        user: updateUser
    });
});
