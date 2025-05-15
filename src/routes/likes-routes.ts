import { Hono } from "hono";
import { sessionMiddleware } from "./middlewares/session-middleware.js";

import {
  DeleteLikeError,
  GetLikesError,
  GetLikesOnMeError,
  LikePostError,
  GetLikesOnUserError,
} from "../controllers/likes/likes-types.js";
import { getPagination } from "../extras/pagination.js";
import { CreateLike, DeleteLike, GetLikes, GetLikesOnMe, GetLikesOnUser } from "../controllers/likes/likes-controller.js";


export const likesRoutes = new Hono();

likesRoutes.get("/on/:postId", async (c) => {
  try {
    const postId = c.req.param("postId");
    const { page, limit } = getPagination(c);
    const result = await GetLikes({ postId, page, limit });
    return c.json(result, 200);
  } catch (error) {
    if (error === GetLikesError.POST_NOT_FOUND) {
      return c.json({ error: "Post not found" }, 404);
    }
    if (error === GetLikesError.LIKES_NOT_FOUND) {
      return c.json({ error: "No likes found on this post" }, 404);
    }
    if (error === GetLikesError.PAGE_NOT_FOUND) {
      return c.json({ error: "No likes found on the requested page" }, 404);
    }
    return c.json({ error: "Unknown error" }, 500);
  }
});



// likesRoutes.get("/on/:postId", sessionMiddleware, async (c) => {
//   try {
//     const postId = c.req.param("postId");
//     const { page, limit } = getPagination(c);
//     const userId = c.get("user")?.id; // Get logged in user ID

//     const result = await GetLikes({ postId, page, limit });

//     const likedByCurrentUser = result.likes.some((like: any) => like.userId === userId);

//     return c.json(
//       {
//         likes: result.likes,
//         likedByCurrentUser, // <-- return true/false
//       },
//       200
//     );
//   } catch (error) {
//     if (error === GetLikesError.POST_NOT_FOUND) {
//       return c.json({ error: "Post not found" }, 404);
//     }
//     if (error === GetLikesError.LIKES_NOT_FOUND) {
//       return c.json({ error: "No likes found on this post" }, 404);
//     }
//     if (error === GetLikesError.PAGE_NOT_FOUND) {
//       return c.json({ error: "No likes found on the requested page" }, 404);
//     }
//     return c.json({ error: "Unknown error" }, 500);
//   }
// });








likesRoutes.post("/on/:postId", sessionMiddleware, async (c) => {
  try {
    const postId = c.req.param("postId");
    const userId = c.get("user").id;
    const result = await CreateLike({ postId, userId });
    return c.json(result, 201);
  } catch (error) {
    if (error === LikePostError.POST_NOT_FOUND) {
      return c.json({ error: "Post not found" }, 404);
    }
    if (error === LikePostError.ALREADY_LIKED) {
      return c.json({ error: "You have already liked this post" }, 400);
    }
    return c.json({ error: "Unknown error" }, 500);
  }
});

likesRoutes.delete("/on/:postId", sessionMiddleware, async (c) => {
  try {
    const postId = c.req.param("postId");
    const userId = c.get("user").id;
    const result = await DeleteLike({ postId, userId });
    return c.json(result, 200);
  } catch (error) {
    if (error === DeleteLikeError.POST_NOT_FOUND) {
      return c.json({ error: "Post not found" }, 404);
    }
    if (error === DeleteLikeError.LIKE_NOT_FOUND) {
      return c.json({ error: "Like not found" }, 404);
    }
    if (error === DeleteLikeError.USER_NOT_FOUND) {
      return c.json({ error: "You can only remove your own likes" }, 403);
    }
    return c.json({ error: "Unknown error" }, 500);
  }
});

likesRoutes.get("/me", sessionMiddleware, async (c) => {
  try {
    const userId = c.get("user")?.id;
    const result = await GetLikesOnMe({ userId });
    return c.json(result, 200);
  } catch (error) {
    if (error === GetLikesOnMeError.LIKES_NOT_FOUND) {
      return c.json({ error: "No likes found" }, 404);
    }
    if (error === GetLikesOnMeError.PAGE_NOT_FOUND) {
      return c.json({ error: "No likes found on the requested page" }, 404);
    }
    if (error === GetLikesOnMeError.USER_NOT_FOUND) {
      return c.json({ error: "User not found" }, 404);
    }
    return c.json({ error: "Unknown error" }, 500);
  }
});

likesRoutes.get("/by/:slug", async (c) => {
  try {
    const { slug } = c.req.param();
    const { page, limit } = getPagination(c);
    const result = await GetLikesOnUser({ username: slug, page, limit });
    return c.json(result, 200);
  } catch (error) {
    if (error === GetLikesOnMeError.LIKES_NOT_FOUND) {
      return c.json({ error: "No likes found for this user" }, 404);
    }
    if (error === GetLikesOnUserError.USER_NOT_FOUND) {
      return c.json({ error: "User not found" }, 404);
    }
    if (error === GetLikesOnUserError.PAGE_NOT_FOUND) {
      return c.json({ error: "No likes found on the requested page" }, 404);
    }
    if (error === GetLikesOnUserError.POST_NOT_FOUND) {
      return c.json({ error: "No likes found on the requested page" }, 404);
    }
    return c.json({ error: "Unknown error!" }, 500);
  }
});