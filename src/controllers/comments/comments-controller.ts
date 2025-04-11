import { prismaClient } from "../../extras/prisma.js";
import {
  CommentStatus,
  type CreateCommentResult,
  type GetCommentsResult,
  type UpdateCommentResult,
} from "./comments-types.js";

export const getCommentsOnPost = async (parameters: {
  postId: string;
  page: number;
}): Promise<GetCommentsResult> => {
  const limit = 10;
  const offset = (parameters.page - 1) * limit;

  const comments = await prismaClient.comment.findMany({
    where: {
      postId: parameters.postId,
    },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: limit,
  });
  return { comments };
};

export const createComment = async (parameters: {
  userId: string;
  postId: string;
  content: string;
}): Promise<CreateCommentResult> => {
  const comment = await prismaClient.comment.create({
    data: {
      userId: parameters.userId,
      postId: parameters.postId,
      content: parameters.content,
    },
  });

  return { comment };
};

export const deleteComment = async (params: {
  commentId: string;
  userId: string;
}): Promise<CommentStatus> => {
  try {
    const comment = await prismaClient.comment.findUnique({
      where: { id: params.commentId },
    });

    if (!comment) {
      return CommentStatus.COMMENT_NOT_FOUND;
    }

    await prismaClient.comment.delete({ where: { id: params.commentId } });

    return CommentStatus.DELETE_SUCCESS;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return CommentStatus.UNKNOWN;
  }
};

export const updateComment = async (parameters: {
  userId: string;
  commentId: string;
  content: string;
}): Promise<UpdateCommentResult> => {
  const comment = await prismaClient.comment.update({
    where: {
      id: parameters.commentId,
      userId: parameters.userId,
    },
    data: {
      content: parameters.content,
    },
  });

  return { comment };
};