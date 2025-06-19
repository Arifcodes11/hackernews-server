import { prismaClient } from "../../../integration/prisma";
import { createUnsecureRoute } from "../../middleware/session-middleware";
import "dotenv/config";

 export const searchRoute = createUnsecureRoute()
searchRoute.get("", async (context) => {
  const { q: query, limit = "10", offset = "0" } = context.req.query();

  const searchResults = await prismaClient.post.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { text: { contains: query, mode: "insensitive" } },
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



