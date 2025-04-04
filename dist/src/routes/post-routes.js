import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares/token-middleware";
import { createPost, deletePost, getAllPosts, getPostsByUser, } from "../controllers/posts/post-contoller";
import { DeletePostError, GetPostsError, PostStatus, } from "../controllers/posts/post-type";
export const postsRoutes = new Hono();
postsRoutes.post("/", tokenMiddleware, async (context) => {
    try {
        const userId = context.get("userId"); //From tokenMiddleware
        if (!userId) {
            return context.json({ error: "Unauthorized" }, 401);
        }
        const { title, content } = await context.req.json(); // Removed userId from here
        if (!title || !content) {
            return context.json({ error: "Title and Content are required" }, 400);
        }
        const result = await createPost({
            title,
            content,
            authorId: userId, //Use authenticated userId only
        });
        if (result === PostStatus.USER_NOT_FOUND) {
            return context.json({ error: "User not found" }, 404);
        }
        if (result === PostStatus.POST_CREATION_FAILED) {
            return context.json({ error: "Post creation failed" }, 500);
        }
        return context.json(result, 201); //  Post created
    }
    catch (error) {
        console.error(error);
        return context.json({ error: "Server error" }, 500);
    }
});
// GET /posts - Paginated, reverse chronological
postsRoutes.get("/", tokenMiddleware, async (context) => {
    try {
        const page = parseInt(context.req.query("page") || "1", 10);
        const limit = parseInt(context.req.query("limit") || "2", 10);
        const result = await getAllPosts({ page, limit });
        if (!result) {
            return context.json({ error: "Users not found" }, 404);
        }
        return context.json(result, 200);
    }
    catch (error) {
        if (error === GetPostsError.NO_POSTS_FOUND) {
            return context.json({ error: "No posts found" }, 404);
        }
        console.error(error);
        return context.json({ error: "Server error" }, 500);
    }
});
//Get all posts in reverse chronological order of the current user
postsRoutes.get("/me", tokenMiddleware, async (context) => {
    try {
        const userId = context.get("userId");
        const page = parseInt(context.req.query("page") || "1", 10);
        const limit = parseInt(context.req.query("limit") || "2", 10);
        const result = await getPostsByUser({ userId, page, limit });
        if (!result) {
            return context.json({ error: "No posts found" }, 404);
        }
        return context.json(result, 200);
    }
    catch (error) {
        console.error(error);
        return context.json({ error: "Server error" }, 500);
    }
});
//delete by userId
postsRoutes.delete("/:postId", tokenMiddleware, async (context) => {
    try {
        const userId = context.get("userId");
        const postId = context.req.param("postId");
        if (!userId) {
            return context.json({ error: "Unauthorized" }, 401);
        }
        const result = await deletePost({ postId, userId });
        if (result === DeletePostError.POST_NOT_FOUND) {
            return context.json({ error: "Post not found" }, 404);
        }
        if (result === DeletePostError.UNAUTHORIZED) {
            return context.json({ error: "You are not authorized to delete this post" }, 403);
        }
        if (result === DeletePostError.DELETE_FAILED) {
            return context.json({ error: "Failed to delete post" }, 500);
        }
        return context.json({ message: "Post deleted successfully" }, 200);
    }
    catch (error) {
        console.error(error);
        return context.json({ error: "Server error" }, 500);
    }
});
