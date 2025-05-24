import { HTTPException } from "hono/http-exception";
import { createUnsecureRoute } from "../middleware/session-middleware";
import { prismaClient } from "../../integration/prisma";


export const unSecureUserRoute = createUnsecureRoute();


unSecureUserRoute.get("/:userId", async (context) => {
  const userId = context.req.param("userId");

  const getUser = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      posts: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!getUser) {
    throw new HTTPException(404, {
      message: "User not found",
    });
  }

  return context.json({
    user: getUser,
  });
});


