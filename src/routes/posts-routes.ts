import { Hono } from "hono";
import { sessionMiddleware } from "./middlewares/session-middleware.js";


import {
  GetPostsError,
  CreatePostError,
  // DeletePostError,
  GetPostByIdError,
  DeletePostError,
} from "../controllers/posts/posts-types.js";
import { getPagination } from "../extras/pagination.js";
import { CreatePost, DeletePost, GetPostById, GetPosts, GetUserPosts, GetUserPostsBySlug } from "../controllers/posts/posts-controller.js";
import { prismaClient } from "../integrations/prisma/index.js";



export const postsRoutes = new Hono();

postsRoutes.get("/", async (context) => {
  try {
    const { page, limit } = getPagination(context);

    const result = await GetPosts({ page, limit});
    return context.json(result, { status: 200 });
  } catch (error) {
    if (error === GetPostsError.POSTS_NOT_FOUND) {
      return context.json(
        { error: "No posts found in the system!" },
        { status: 404 }
      );
    }
    if (error === GetPostsError.PAGE_BEYOND_LIMIT) {
      return context.json(
        { error: "No posts found on the requested page!" },
        { status: 404 }
      );
    }
    return context.json({ error: "Unknown error!" }, { status: 500 });
  }
});


postsRoutes.get("/me", sessionMiddleware, async (c) => {
  try {
    const userId = c.get("user")?.id;
    const { page, limit } = getPagination(c);
    const result = await GetUserPosts({ userId, page, limit });
    return c.json(result, { status: 200 });
  } catch (error) {
    if (error === GetPostsError.POSTS_NOT_FOUND) {
      return c.json({ error: "You haven't created any posts yet!" }, 404);
    }
    if (error === GetPostsError.PAGE_BEYOND_LIMIT) {
      return c.json({ error: "No posts found on the requested page!" }, 404);
    }
    return c.json({ error: "Unknown error!" }, 500);
  }
});

postsRoutes.post("/", sessionMiddleware, async (c) => {
  try {
    const userId = c.get("user").id;
    const { title, content } = await c.req.json();
    const result = await CreatePost({ userId, title, content });
    return c.json(result, 201);
  } catch (error) {
    if (error === CreatePostError.TITLE_REQUIRED) {
      return c.json({ error: "Title is required!" }, 400);
    }
    if (error === CreatePostError.USER_NOT_FOUND) {
      return c.json({ error: "User not found!" }, 404);
    }
    return c.json({ error: "Unknown error!" }, 500);
  }
});

postsRoutes.get("/:postId", async (c) => {
  try {
    const postId = c.req.param("postId");
    const result = await GetPostById({ postId });
    return c.json(result, 200);
  } catch (error) {
    if (error === GetPostByIdError.POST_NOT_FOUND) {
      return c.json({ error: "Post not found!" }, 404);
    }
    return c.json({ error: "Unknown error!" }, 500);
  }
});


postsRoutes.delete("/:postId", sessionMiddleware, async (c) => {
  try {
    const userId = c.get("user").id;
    const postId = c.req.param("postId");
    await DeletePost({ postId, userId });
    return c.json({ message: "Post deleted successfully" }, 200);
  } catch (error) {
    if (error === DeletePostError.POST_NOT_FOUND) {
      return c.json({ error: "Post not found!" }, 404);
    }
    if (error === DeletePostError.USER_NOT_FOUND) {
      return c.json({ error: "User not found!" });
    }
    return c.json({ error: "Unknown error!" }, 500);
  }
});

postsRoutes.get("/:postId",sessionMiddleware, async (c) => {
  try {
    const postId = c.req.param("postId");
    const userId = c.get("user")?.id;
    const result = await GetPostById({ postId, userId });
    return c.json(result, 200);
  } catch (error) {
    if (error === GetPostByIdError.POST_NOT_FOUND) {
      return c.json({ error: "Post not found!" }, 404);
    }
    return c.json({ error: "Unknown error!" }, 500);
  }
});



postsRoutes.get("/by/:slug", async (c) => {
  try {
    const { slug } = c.req.param();
    const { page, limit } = getPagination(c);

    const result = await GetUserPostsBySlug({ slug, page, limit });

    if (result.posts.length === 0) {
      return c.json({ error: "This user hasn't created any posts yet!" }, 404);
    }

    return c.json(result, 200);
  } catch (error) {
    if (error === GetPostsError.POSTS_NOT_FOUND) {
      return c.json({ error: "This user hasn't created any posts yet!" }, 404);
    }
    if (error === GetPostsError.PAGE_BEYOND_LIMIT) {
      return c.json({ error: "No posts found on the requested page!" }, 404);
    }
    return c.json({ error: "Unknown error!" }, 500);
  }
});
postsRoutes.get("/search", async (context) => {
  const { q: query, limit = "10", offset = "0" } = context.req.query();

  const searchResults = await prismaClient.post.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ],
    },
    take: parseInt(limit),
    skip: parseInt(offset),
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return context.json({
    success: true,
    data: searchResults,
    meta: {
      count: searchResults.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
    },
  });
});