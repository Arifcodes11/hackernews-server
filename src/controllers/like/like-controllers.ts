import { getPagination } from "../../extras/pagination";
import { prisma } from "../../extras/prisma";
import { LikeStatus, type GetLikesResult, type LikeCreate } from "./like-types";

// Function to create a like on a post
export const createLike = async (params: {
  postId: string;
  userId: string;
}): Promise<LikeCreate> => {
  try {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
    });

    if (!post) {
      return { status: LikeStatus.POST_NOT_FOUND };
    }

    // Check if user has already liked this post
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: params.postId,
        userId: params.userId,
      },
    });

    if (existingLike) {
      return { status: LikeStatus.ALREADY_LIKED };
    }

    // Create a new like
    await prisma.like.create({
      data: {
        postId: params.postId,
        userId: params.userId,
      },
    });

    return { status: LikeStatus.LIKE_SUCCESS };
  } catch (error) {
    console.error(error);
    return { status: LikeStatus.UNKNOWN };
  }
};

//Get all likes on a specific post in reverse chronological order with pagination.
export const getLikesOnPost = async (params: {
  postId: string;
  page: number;
  limit: number;
}): Promise<GetLikesResult | LikeStatus> => {
  try {
    const { skip, take } = getPagination(params.page, params.limit);

    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
    });

    if (!post) {
      return LikeStatus.POST_NOT_FOUND;
    }

    const likes = await prisma.like.findMany({
      where: { postId: params.postId },
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

    if (!likes || likes.length === 0) {
      return LikeStatus.NO_LIKES_FOUND;
    }

    return { likes };
  } catch (error) {
    console.error(error);
    return LikeStatus.UNKNOWN;
  }
};

export const deleteLikeOnPost = async (params: {
  postId: string;
  userId: string;
}): Promise<LikeStatus> => {
  try {
    // Check if the like exists
    const like = await prisma.like.findFirst({
      where: {
        postId: params.postId,
        userId: params.userId,
      },
    });

    if (!like) {
      return LikeStatus.LIKE_NOT_FOUND;
    }

    // Delete the like
    await prisma.like.delete({
      where: {
        id: like.id,
      },
    });

    return LikeStatus.LIKE_DELETED;
  } catch (error) {
    console.error(error);
    return LikeStatus.UNKNOWN;
  }
};
