import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../../integration/prisma";
import { createUnsecureRoute } from "../middleware/session-middleware";
import { getPagination } from "../../extras/pagination";

export const unSecurePostsRoute = createUnsecureRoute();

unSecurePostsRoute.get("/:postId", async (context) => {
  const { postId } = context.req.param();
  const post = await prismaClient.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: true,
    },
  });
  if (!post) {
    throw new HTTPException(404);
  }
  return context.json(post);
});

