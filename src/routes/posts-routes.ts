import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares/token-middleware.js";
import { createPost, deletePost, getAllPosts, getMePosts } from "../controllers/posts/posts-controller.js";

export const postsRoutes = new Hono();

postsRoutes.get("", tokenMiddleware, async (context) => {
  try {
    const page = Number(context.req.query("page")) || 1;
    const posts = await getAllPosts({ page });

    return context.json({ data: posts });
  } catch (e) {
    return context.json(
      {
        error: "Failed to fetch posts",
      },
      500
    );
  }
});

postsRoutes.get("/me", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  try {
    const userPosts = await getMePosts({ userId });

    return context.json({
      data: userPosts,
    });
  } catch (e) {
    return context.json(
      {
        error: "Failed to fetch user's posts",
      },
      500
    );
  }
});

postsRoutes.post("", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const { title, description, content } = await context.req.json();
  try {
    const newPost = await createPost({ userId, title, description, content });
    return context.json(
      {
        data: newPost,
      },
      201
    );
  } catch (e) {
    return context.json({
      error: "Failed to create post",
    });
  }
});

postsRoutes.delete("/:postId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const postId = context.req.param("postId");

  try {
    await deletePost({ userId, postId });
    return context.json({ message: "deleted the post successfully" });
  } catch (e) {
    return context.json({
      error: "failed to delete post",
    });
  }
});