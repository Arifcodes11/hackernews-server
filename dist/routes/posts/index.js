"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRoute = void 0;
const zod_validator_1 = require("@hono/zod-validator");
const session_middleware_1 = require("../middleware/session-middleware");
const zod_1 = require("zod");
const prisma_1 = require("../../integration/prisma");
exports.postsRoute = (0, session_middleware_1.createSecureRoute)();
exports.postsRoute.post("/", (0, zod_validator_1.zValidator)("json", zod_1.z.object({
    title: zod_1.z.string().min(1, "only non-empty strings are allowed in text"),
    text: zod_1.z.string().min(1, "only non-empty strings are allowed in text"),
})), async (context) => {
    const user = context.get("user");
    const { title, text } = context.req.valid("json");
    const post = await prisma_1.prismaClient.post.create({
        data: {
            title,
            text,
            authorId: user.id,
        },
        include: {
            author: true,
        }
    });
    return context.json(post, 201);
});
