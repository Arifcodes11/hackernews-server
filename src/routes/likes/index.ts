import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../../integration/prisma";
import { createSecureRoute } from "../middleware/session-middleware";

export const likesRoute = createSecureRoute();

// Update the POST route handler
likesRoute.post("/:postId", async (context) => {
  const { postId } = context.req.param();
  const user = context.get("user");

  // Check if post exists
  const post = await prismaClient.post.findUnique({
      where: { id: postId }
  });
  if (!post) {
      throw new HTTPException(404, { message: "Post not found" });
  }

  // Check for existing like first
  const existingLike = await prismaClient.like.findUnique({
      where: {
          postId_userId: {
              postId,
              userId: user.id
          }
      }
  });

  if (existingLike) {
      throw new HTTPException(409, {
          message: "You've already liked this post"
      });
  }

  // Create new like if it doesn't exist
  const like = await prismaClient.like.create({
      data: {
          postId,
          userId: user.id
      }
  });

  return context.json(like);
});

likesRoute.get("/:postId", async (context) => {
  const { postId } = context.req.param();
  const user = context.get("user");

  const post = await prismaClient.post.findUnique({
    where: { id: postId },
    include: { author: true },
  });

  if (!post) {
    throw new HTTPException(404, { message: "Post not found" });
  }

  const like = await prismaClient.like.findFirst({
    where: {
      postId,
      userId: user.id,
    },
  });

  const totalLikes = await prismaClient.like.count({
    where: { postId },
  });

  return context.json({
    liked: !!like,
    count: totalLikes,
  });
});

// Update the DELETE route handler
likesRoute.delete("/:postId", async (context) => {
  const { postId } = context.req.param();
  const user = context.get("user");

  // Simplified check - no need to fetch full post
  const existingLike = await prismaClient.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: user.id
      }
    }
  });

  if (!existingLike) {
    return context.json({ 
      success: false,
      message: "Like not found" 
    }, 404); // Return proper 404 status
  }

  await prismaClient.like.delete({
    where: {
      postId_userId: {
        postId,
        userId: user.id
      }
    }
  });

  return context.json({ 
    success: true,
    message: "Like removed" 
  });
});