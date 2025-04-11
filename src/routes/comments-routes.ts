import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares/token-middleware.js";
import {
  createComment,
  deleteComment,
  getCommentsOnPost,
  updateComment,
 
} from "../controllers/comments/comments-controller.js";

export const commentsRoutes = new Hono();

commentsRoutes.get("/on/:postId", tokenMiddleware, async (context) => {
  const postId = context.req.param("postId");
  const page = Number(context.req.query("page")) || 1;

  try {
    const comments = await getCommentsOnPost({ postId, page });
    return context.json({ data: comments });
  } catch (e) {
    return context.json({ error: "Failed to fetch comments" }, 500);
  }
});

commentsRoutes.post("/on/:postId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const postId = context.req.param("postId");
  const { content } = await context.req.json();
  try {
    const comment = await createComment({ userId, postId, content });
    return context.json({
      data: comment,
    });
  } catch (e) {
    return context.json({
      error: "Failed to create comment",
    });
  }
});


commentsRoutes.patch("/:commentId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const commentId = context.req.param("commentId");
  const { content } = await context.req.json();
  try {
    const comment = await updateComment({ userId, commentId, content });
    return context.json({ data: comment });
  } catch (e) {
    return context.json(
      {
        error: "Failed to update comment",
      },
      500
    );
  }
});


commentsRoutes.delete("/:commentId", tokenMiddleware, async (context) => {
  const commentId = context.req.param("commentId");
  const userId = context.get("userId");

  try {
    const result = await deleteComment({ commentId, userId });
    return context.json({ status: result }, 200);
  } catch (error) {
    return context.json({ status: error }, 403);
  }
});