import { createLike, deleteLikeOnPost, getLikesOnPost, } from "../controllers/likes/like-controllers";
import { LikeStatus } from "../controllers/likes/like-types";
import { tokenMiddleware } from "./middlewares/token-middleware";
import { Hono } from "hono";
export const likeRoutes = new Hono();
likeRoutes.post("/on/:postId", tokenMiddleware, async (context) => {
    try {
        const userId = context.get("userId");
        const postId = context.req.param("postId");
        if (!userId) {
            return context.json({ error: "Unauthorized" }, 401);
        }
        const result = await createLike({ postId, userId });
        if (result.status === LikeStatus.POST_NOT_FOUND) {
            return context.json({ error: "Post not found" }, 404);
        }
        if (result.status === LikeStatus.ALREADY_LIKED) {
            return context.json({ message: "You have already liked this post" }, 200);
        }
        if (result.status === LikeStatus.UNKNOWN) {
            return context.json({ error: "Unknown error" }, 500);
        }
        return context.json({ message: "Post liked successfully" }, 201);
    }
    catch (error) {
        console.error(error);
        return context.json({ error: "Server error" }, 500);
    }
});
//Get all likes of specific users
likeRoutes.get("/on/:postId", tokenMiddleware, async (context) => {
    try {
        const postId = context.req.param("postId");
        const page = parseInt(context.req.query("page") || "1", 10);
        const limit = parseInt(context.req.query("limit") || "2", 10);
        const result = await getLikesOnPost({
            postId: postId,
            page: page,
            limit: limit,
        });
        if (result === LikeStatus.POST_NOT_FOUND) {
            return context.json({ error: "Post not found" }, 404);
        }
        if (result === LikeStatus.NO_LIKES_FOUND) {
            return context.json({ error: "No likes found on this post" }, 404);
        }
        if (result === LikeStatus.UNKNOWN) {
            return context.json({ error: "An unknown error occurred" }, 500);
        }
        return context.json(result, 200);
    }
    catch (error) {
        console.error(error);
        return context.json({ error: "Server error" }, 500);
    }
});
//Delete a like
likeRoutes.delete("/on/:postId", tokenMiddleware, async (context) => {
    try {
        const postId = context.req.param("postId");
        const userId = context.get("userId"); // Extract userId from JWT middleware
        if (!postId || !userId) {
            return context.json({ error: "Invalid postId or userId" }, 400);
        }
        const result = await deleteLikeOnPost({ postId, userId });
        if (result === LikeStatus.LIKE_NOT_FOUND) {
            return context.json({ error: "Like not found or not authored by you" }, 404);
        }
        if (result === LikeStatus.UNKNOWN) {
            return context.json({ error: "An unknown error occurred" }, 500);
        }
        return context.json({ message: "Like deleted successfully" }, 200);
    }
    catch (error) {
        console.error(error);
        return context.json({ error: "Server error" }, 500);
    }
});
