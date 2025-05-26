import { Pinecone } from "@pinecone-database/pinecone";
import { prismaClient } from "../../../integration/prisma";
import { createUnsecureRoute } from "../../middleware/session-middleware";
import { mistralApiKey, pineconeApiKey } from "../../../utils/environment";
import { Mistral } from "@mistralai/mistralai";
import "dotenv/config";

 export const searchRoute = createUnsecureRoute()
// searchRoute.get("", async (context) => {
//   const { q: query, limit = "10", offset = "0" } = context.req.query();

//   const searchResults = await prismaClient.post.findMany({
//     where: {
//       OR: [
//         { title: { contains: query, mode: "insensitive" } },
//         { text: { contains: query, mode: "insensitive" } },
//       ],
//     },
//     take: parseInt(limit),
//     skip: parseInt(offset),
//     orderBy: {
//       createdAt: "desc",
//     },
//     include: {
//       author: {
//         select: {
//           id: true,
//           name: true,
//           image: true,
//         },
//       },
//     },
//   });

//   return context.json({
//     success: true,
//     data: searchResults,
//     meta: {
//       count: searchResults.length,
//       limit: parseInt(limit),
//       offset: parseInt(offset),
//     },
//   });
// });



const pc = new Pinecone({ apiKey: pineconeApiKey });
const mistral = new Mistral({ apiKey: mistralApiKey });

searchRoute.get("", async (context) => {
  const { q: query, limit = "5", offset = "0" } = context.req.query();

  // Query Pinecone
  const namespace = pc.index("platinum").namespace("posts");
  const pineconeResponse = await namespace.searchRecords({
    query: {
      inputs: { text: query },
      topK: parseInt(limit),
    },
    rerank: {
      model: "bge-reranker-v2-m3",
      topN: parseInt(limit),
      rankFields: ["text"],
    },
  });

  const posts = pineconeResponse.result.hits.map((hit) => {
    const fields = hit.fields as {
      text: string;
      title: string;
      author: string;
      createdAt: string;
      likes: number;
    };
    return {
      id: hit._id,
      title: fields.title,
      text: fields.text,
      author: fields.author,
      createdAt: fields.createdAt,
      likes: fields.likes,
    };
  });

  // Generate Summary with Mistral
  const contextText = posts.map((p) => `- ${p.title}: ${p.text}`).join("\n");
  const updateQuery = `
##QUERY
${query}

---
##CONTEXT
${contextText}
`;

  const response = await mistral.chat.complete({
    model: "mistral-small-latest",
    messages: [
      {
        role: "user",
        content: updateQuery,
      },
    ],
  });

  const summary = response.choices?.[0]?.message?.content || "";

  return context.json({
    success: true,
    data: posts,
    summary,
    meta: {
      count: posts.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
    },
  });
});
