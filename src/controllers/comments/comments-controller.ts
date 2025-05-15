import { prismaClient as prisma } from "../../integrations/prisma/index.js";
import {
  GetCommentsError,
  CreateCommentError,
  type GetCommentsResult,
  type CreateCommentResult,
  DeleteCommentError,
  UpdateCommentError,
  type UpdateCommentResult,
  type GetCommentsOnPostsResult,
  type GetCommentsOnMeResult,
  GetCommentsOnMeError,
  GetCommentsOnUserError,
  type GetCommentsOnUserResult,
} from "./comments-types.js";

export const GetComments = async (parameters: {
  postId: string;
  page: number;
  limit: number;
}): Promise<GetCommentsResult> => {
  try {
    const { postId, page, limit } = parameters;

    if (page < 1 || limit < 1) {
      throw GetCommentsError.PAGE_BEYOND_LIMIT;
    }

    const skip = (page - 1) * limit;

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw GetCommentsError.POST_NOT_FOUND;
    }

    const totalComments = await prisma.comment.count({
      where: { postId },
    });

    if (totalComments === 0) {
      throw GetCommentsError.COMMENTS_NOT_FOUND;
    }

    const totalPages = Math.ceil(totalComments / limit);
    if (page > totalPages) {
      throw GetCommentsError.PAGE_BEYOND_LIMIT;
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            username: true,
            name: true,
          },
        },
      },
    });

    return { comments };
  } catch (e) {
    console.error(e);
    if (
      e === GetCommentsError.POST_NOT_FOUND ||
      e === GetCommentsError.COMMENTS_NOT_FOUND ||
      e === GetCommentsError.PAGE_BEYOND_LIMIT
    ) {
      throw e;
    }
    throw GetCommentsError.UNKNOWN;
  }
};

export const CreateComment = async (parameters: {
  postId: string;
  userId: string;
  content: string;
}): Promise<CreateCommentResult> => {
  try {
    const { postId, userId, content } = parameters;

    if (!content.trim()) {
      throw CreateCommentError.INVALID_INPUT;
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            username: true,
            name: true,
          },
        },
      },
    });
    if (!post) {
      throw CreateCommentError.POST_NOT_FOUND;
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
      },
      include: {
        user: {
          select: {
            username: true,
            name: true,
          },
        },
      },
    });

    return { comment };
  } catch (e) {
    console.error(e);
    if (
      e === CreateCommentError.POST_NOT_FOUND ||
      e === CreateCommentError.INVALID_INPUT
    ) {
      throw e;
    }
    throw CreateCommentError.UNKNOWN;
  }
};

export const UpdateComment = async (parameters: {
  commentId: string;
  userId: string;
  content: string;
}): Promise<UpdateCommentResult> => {
  try {
    const { commentId, userId, content } = parameters;

    if (!content.trim()) {
      throw UpdateCommentError.INVALID_INPUT;
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      throw UpdateCommentError.COMMENT_NOT_FOUND;
    }

    if (existingComment.userId !== userId) {
      throw UpdateCommentError.UNAUTHORIZED;
    }

    if (
      existingComment.content.toLowerCase().trim() ===
      content.toLowerCase().trim()
    ) {
      throw UpdateCommentError.NO_CHANGES;
    }

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        user: {
          select: {
            username: true,
            name: true,
          },
        },
      },
    });

    return { comment };
  } catch (e) {
    console.error(e);
    if (
      e === UpdateCommentError.COMMENT_NOT_FOUND ||
      e === UpdateCommentError.INVALID_INPUT ||
      e === UpdateCommentError.NO_CHANGES ||
      e === UpdateCommentError.UNAUTHORIZED
    ) {
      throw e;
    }
    throw UpdateCommentError.UNKNOWN;
  }
};

export const DeleteComment = async (parameters: {
  commentId: string;
  userId: string;
}): Promise<void> => {
  try {
    const { commentId, userId } = parameters;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw DeleteCommentError.COMMENT_NOT_FOUND;
    }

    if (comment.userId !== userId) {
      throw DeleteCommentError.UNAUTHORIZED;
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });
  } catch (e) {
    console.error(e);
    if (
      e === DeleteCommentError.COMMENT_NOT_FOUND ||
      e === DeleteCommentError.UNAUTHORIZED
    ) {
      throw e;
    }
    throw DeleteCommentError.UNKNOWN;
  }
};

export const GetCommentsOnPosts = async (parameters: {
  page: number;
  limit: number;
}): Promise<GetCommentsOnPostsResult> => {
  try {
    const { page, limit } = parameters;

    if (page < 1 || limit < 1) {
      throw new Error("Page or limit is below 1");
    }

    const skip = (page - 1) * limit;

    const totalComments = await prisma.comment.count({
      where: { postId: { not: null } as any },
    });

    if (totalComments === 0) {
      throw new Error("No comments found");
    }

    const totalPages = Math.ceil(totalComments / limit);

    if (page > totalPages) {
      throw new Error("Page exceeds total pages");
    }

    const comments = await prisma.comment.findMany({
      where: { postId: { not: null } as any },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            username: true,
            name: true,
          },
        },
      },
    });

    return { comments };
  } catch (e) {
    console.error(e);
    throw new Error(e instanceof Error ? e.message : "Unknown error");
  }
};

export const GetCommentsOnMe = async (parameters: {
  userId: string;
}): Promise<GetCommentsOnMeResult> => {
  try {
    const { userId } = parameters;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
      },
    });
    if (!user) {
      throw GetCommentsOnMeError.USER_NOT_FOUND;
    }
    const comments = await prisma.comment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return { comments };
  } catch (e) {
    console.error(e);
    if (e === GetCommentsOnMeError.COMMENTS_NOT_FOUND) {
      throw e;
    }
    if (e === GetCommentsOnMeError.PAGE_BEYOND_LIMIT) {
      throw e;
    }
    if (e === GetCommentsOnMeError.USER_NOT_FOUND) {
      throw e;
    }
    throw GetCommentsOnMeError.UNKNOWN;
  }
};

export const GetCommentsOnUser = async (parameters: {
  username: string;
  page: number;
  limit: number;
}): Promise<GetCommentsOnUserResult> => {
  try {
    const { username, page, limit } = parameters;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw GetCommentsOnUserError.USER_NOT_FOUND;
    }

    if (page < 1 || limit < 1) {
      throw new Error("Page or limit is below 1");
    }

    const skip = (page - 1) * limit;

    const totalComments = await prisma.comment.count({
      where: { userId: user.id },
    });

    if (totalComments === 0) {
      throw new Error("No comments found");
    }

    const totalPages = Math.ceil(totalComments / limit);

    if (page > totalPages) {
      throw new Error("Page exceeds total pages");
    }

    const comments = await prisma.comment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return { comments };
  } catch (e) {
    console.error(e);
    if (e === GetCommentsOnUserError.COMMENTS_NOT_FOUND) {
      throw e;
    }
    if (e === GetCommentsOnUserError.PAGE_BEYOND_LIMIT) {
      throw e;
    }
    if (e === GetCommentsOnUserError.USER_NOT_FOUND) {
      throw e;
    }
    if (e === GetCommentsOnUserError.POST_NOT_FOUND) {
      throw e;
    }
    throw GetCommentsOnUserError.UNKNOWN;
  }
};