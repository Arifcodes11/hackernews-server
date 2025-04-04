import { Hono } from "hono";
import { CommentStatus } from "../controllers/comments/comments-type";
import { tokenMiddleware } from "../routes/middlewares/token-middleware";
import { createComment, deleteComment, getAllComments, updateComment, } from "../controllers/comments/comments-controller";
export const commentRoutes = new Hono();
commentRoutes.post("/on/:postId", tokenMiddleware, async (c) => {
    try {
        const postId = c.req.param("postId");
        const userId = c.get("userId");
        const { content } = await c.req.json();
        const result = await createComment({ content, postId, userId });
        return c.json(result);
    }
    catch (error) {
        if (error === CommentStatus.POST_NOT_FOUND) {
            return c.json({ message: "Post not found" }, 404);
        }
        if (error === CommentStatus.COMMENT_CREATION_FAILED) {
            return c.json({ message: "Comment creation failed" }, 500);
        }
        return c.json({ message: "Unknown error" }, 500);
    }
});
//get all comments for a post
commentRoutes.get("/on/:postId", tokenMiddleware, async (c) => {
    const postId = c.req.param("postId");
    const page = Number(c.req.query("page")) || 1;
    const limit = Number(c.req.query("limit")) || 10;
    try {
        const result = await getAllComments({ postId, page, limit });
        return c.json({ status: "SUCCESS", comments: result.comments }, 200);
    }
    catch (error) {
        return c.json({ status: error }, 404);
    }
});
//delete
commentRoutes.delete("/:commentId", tokenMiddleware, async (c) => {
    const commentId = c.req.param("commentId");
    const userId = c.get("userId");
    try {
        const result = await deleteComment({ commentId, userId });
        return c.json({ status: result }, 200);
    }
    catch (error) {
        return c.json({ status: error }, 403);
    }
});
//update the comment
commentRoutes.patch("/:commentId", tokenMiddleware, async (c) => {
    const commentId = c.req.param("commentId");
    const userId = c.get("userId");
    const { content } = await c.req.json();
    try {
        const result = await updateComment({ commentId, userId, content });
        return c.json({ status: result }, 200);
    }
    catch (error) {
        return c.json({ status: error }, 403);
    }
});
