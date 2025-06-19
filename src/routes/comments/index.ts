import { z } from "zod";
import { createSecureRoute } from "../middleware/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { prismaClient } from "../../integration/prisma";

export const commentRoute = createSecureRoute();
commentRoute.post(
  "/:postId",
  zValidator(
    "json",
    z.object({
      content: z.string().min(1, "only non-empty strings are allowed in text"),
    })
  ),
  async (context) => {
    const { postId } = context.req.param();
    const user = context.get("user");
    const { content } = context.req.valid("json");

    const comment = await prismaClient.comment.create({
      data: {
        content,
        userId: user.id,
        postId: postId, // ✅ assign postId as foreign key
      },
      include: {
        user: true,
      },
    });
    return context.json(comment, 201);
  }
);

commentRoute.get("/:postId", async (context) =>
{
    const { postId } = context.req.param();
    const post = await prismaClient.comment.findMany({
        where: {
            postId: postId,
      },
      orderBy: {
        createdAt: "desc",
      },
        include: {
            user: true,
        },
    }); 
    return context.json(post);
});
    
commentRoute.delete("/:commentId", async (context) => {
  const { commentId } = context.req.param();
    const user = context.get("user");
    const comment = await prismaClient.comment.delete({
      where: {
        id: commentId,
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    return context.json(comment);
   
});

    commentRoute.patch("/:commentId",
    zValidator(
        "json",
        z.object({
            content: z.string().min(1, "only non-empty strings are allowed in text"),
        })
    ),
    async (context) => {
        const { commentId } = context.req.param();
        const user = context.get("user");
        const { content } = context.req.valid("json");
        const comment = await prismaClient.comment.update({
          where: {
            id: commentId,
            userId: user.id,
          },
          data: {
            content,
          },
          include: {
            user: true,
          },
        });

        return context.json(comment);
    }
);

//count of comment by based on postId
commentRoute.get("/count/:postId", async (context) => {
    const { postId } = context.req.param();
    const count = await prismaClient.comment.count({
        where: {
            postId: postId,
        },
    });
  return context.json(count);
});
  