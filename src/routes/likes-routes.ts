import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares/token-middleware.js";

import {
  createLike,
  deleteLike,
  getLikesOnPost,
} from "../controllers/likes/likes-controller.js";

export const likesRoutes = new Hono();

likesRoutes.get("/on/:postId", tokenMiddleware, async (context) => {
  const postId = context.req.param("postId");
  const page = Number(context.req.query("page")) || 1;
  try {
    const likes = await getLikesOnPost({ postId, page });
    return context.json(
      {
        data: likes,
      },
      200
    );
  } catch (e) {
    context.json(
      {
        error: "failed to fetch likes",
      },
      500
    );
  }
});

likesRoutes.post("/on/:postId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const postId = context.req.param("postId");

  try {
    const like = await createLike({ userId, postId });

    return context.json(
      {
        data: like,
      },
      201
    );
  } catch (e) {
    context.json(
      {
        error: "failed to like post",
      },
      500
    );
  }
});

likesRoutes.delete("/on/:postId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const postId = context.req.param("postId");
  try {
    await deleteLike({ userId , postId });
    return context.json({ message: "Like removed" });
  } catch (e) {
    context.json({ error: "failed to unlike post" }, 500);
  }
});