"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRoute = void 0;
const prisma_1 = require("../../../integration/prisma");
const session_middleware_1 = require("../../middleware/session-middleware");
require("dotenv/config");
exports.searchRoute = (0, session_middleware_1.createUnsecureRoute)();
exports.searchRoute.get("", async (context) => {
    const { q: query, limit = "10", offset = "0" } = context.req.query();
    const searchResults = await prisma_1.prismaClient.post.findMany({
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
