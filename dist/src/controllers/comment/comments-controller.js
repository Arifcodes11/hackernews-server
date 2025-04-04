import { getPagination } from "../../extras/pagination";
import { prisma } from "../../extras/prisma";
import { CommentStatus, } from "./comments-type.ts";
export const createComment = async (params) => {
    try {
        const existPostId = await prisma.post.findUnique({
            where: { id: params.postId },
        });
        if (!existPostId) {
            throw new Error(CommentStatus.POST_NOT_FOUND);
        }
        const result = await prisma.comment.create({
            data: {
                content: params.content,
                post: { connect: { id: params.postId } },
                user: { connect: { id: params.userId } },
            },
        });
        return { comment: result };
    }
    catch (error) {
        console.error("Error creating comment:", error);
        throw new Error(CommentStatus.COMMENT_CREATION_FAILED);
    }
};
// Get all comments for a post (reverse chronological order, paginated)
export const getAllComments = async (params) => {
    try {
        const { skip, take } = getPagination(params.page, params.limit);
        const comments = await prisma.comment.findMany({
            where: { postId: params.postId }, // Filter by postId
            orderBy: { createdAt: "desc" }, // Reverse chronological order
            skip,
            take,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });
        if (!comments || comments.length === 0) {
            return { comments: [] };
        }
        return { comments };
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        throw new Error(CommentStatus.UNKNOWN);
    }
};
export const deleteComment = async (params) => {
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: params.commentId },
        });
        if (!comment) {
            return CommentStatus.COMMENT_NOT_FOUND;
        }
        await prisma.comment.delete({ where: { id: params.commentId } });
        return CommentStatus.DELETE_SUCCESS;
    }
    catch (error) {
        console.error("Error deleting comment:", error);
        return CommentStatus.UNKNOWN;
    }
};
//update comment controller
export const updateComment = async (params) => {
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: params.commentId },
        });
        if (!comment) {
            return CommentStatus.COMMENT_NOT_FOUND;
        }
        await prisma.comment.update({
            where: { id: params.commentId },
            data: { content: params.content },
        });
        return CommentStatus.UPDATE_SUCCESS;
    }
    catch (error) {
        console.error("Error updating comment:", error);
        return CommentStatus.UNKNOWN;
    }
};
