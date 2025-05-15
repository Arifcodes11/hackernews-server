import { prismaClient as prisma } from "../../integrations/prisma/index.js";
import {
  DeleteLikeError,
  GetLikesError,
  GetLikesOnMeError,
  GetLikesOnUserError,
  LikePostError,
  type DeleteLikeResult,
  type GetLikesOnMeResult,
  type GetLikesOnUserResult,
  type GetLikesResult,
  type LikePostResult,
} from "./likes-types.js";

export const GetLikes = async (parameters: {
  postId: string;
  page: number;
  limit: number;
}): Promise<GetLikesResult> => {
  try {
    const { postId, page, limit } = parameters;
    const skip = (page - 1) * limit;

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw GetLikesError.POST_NOT_FOUND;
    }

    const totalLikes = await prisma.like.count({
      where: { postId },
    });
    if (totalLikes === 0) {
      return { likes: [] }; // instead of throwing
    }

    const totalPages = Math.ceil(totalLikes / limit);
    if (page > totalPages) {
      return { likes: [] };
    }

    const likes = await prisma.like.findMany({
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
        }
      },
    });

    return { likes };
  } catch (e) {
    console.error(e);
    if (
      e === GetLikesError.POST_NOT_FOUND ||
      e === GetLikesError.LIKES_NOT_FOUND ||
      e === GetLikesError.PAGE_NOT_FOUND
    ) {
      throw e;
    }
    throw GetLikesError.UNKNOWN;
  }
};

export const CreateLike = async (parameters: {
  postId: string;
  userId: string;
}): Promise<LikePostResult> => {
  try {
    const { postId, userId } = parameters;
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw LikePostError.POST_NOT_FOUND;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) {
      throw LikePostError.USER_NOT_FOUND;
    }
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      throw LikePostError.ALREADY_LIKED;
    }

    const like = await prisma.like.upsert({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
      update: {}, //this is to make sure that no updates are needed if like exists
      create: {
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

    return { message: "Liked Post!", like };
  } catch (e) {
    console.error(e);
    if (e === LikePostError.POST_NOT_FOUND) {
      throw e;
    }
    if (e === LikePostError.ALREADY_LIKED) {
      throw e;
    }
    if (e === LikePostError.USER_NOT_FOUND) {
      throw e;
    }
    throw LikePostError.UNKNOWN;
  }
};

export const DeleteLike = async (parameters: {
  postId: string;
  userId: string;
}): Promise<DeleteLikeResult> => {
  try {
    const { postId, userId } = parameters;
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        likes: true,
      },
    });
    if (!post) {
      throw DeleteLikeError.POST_NOT_FOUND;
    }

    const like = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });
    if (!like) {
      throw DeleteLikeError.LIKE_NOT_FOUND;
    }
    if (like.userId !== userId) {
      throw DeleteLikeError.USER_NOT_FOUND;
    }

    await prisma.like.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    return { message: "Unliked Post!" };
  } catch (e) {
    console.error(e);
    if (
      e === DeleteLikeError.POST_NOT_FOUND ||
      e === DeleteLikeError.LIKE_NOT_FOUND ||
      e === DeleteLikeError.USER_NOT_FOUND
    ) {
      throw e;
    }
    throw DeleteLikeError.UNKNOWN;
  }
};

export const GetLikesOnMe = async (parameters: {
  userId: string;
}): Promise<GetLikesOnMeResult> => {
  try {
    const { userId } = parameters;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
      },
    });
    if (!user) {
      throw GetLikesOnMeError.USER_NOT_FOUND;
    }

    const likes = await prisma.like.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return { likes };
  } catch (e) {
    console.error(e);
    if (e === GetLikesOnMeError.LIKES_NOT_FOUND) {
      throw e;
    }
    if (e === GetLikesOnMeError.PAGE_NOT_FOUND) {
      throw e;
    }
    if (e === GetLikesOnMeError.USER_NOT_FOUND) {
      throw e;
    }
    throw GetLikesOnMeError.UNKNOWN;
  }
};  

export const GetLikesOnUser = async (parameters: {
  username: string;
  page: number;
  limit: number;
}): Promise<GetLikesOnUserResult> =>  {
  try {
    const { username, page, limit } = parameters;

    if (page < 1 || limit < 1) {
      throw new Error("Page or limit is below 1");
    }

    const skip = (page - 1) * limit;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
      },
    });
    if (!user) {
      throw GetLikesOnUserError.USER_NOT_FOUND;
    }     

    const likes = await prisma.like.findMany({
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
    return { likes };
  } catch (e) { 
    console.error(e);
    if (e === GetLikesOnUserError.LIKES_NOT_FOUND) {
      throw e;
    }
    if (e === GetLikesOnUserError.USER_NOT_FOUND) {
      throw e;
    } 
    if (e === GetLikesOnUserError.PAGE_NOT_FOUND) {
      throw e;
    }
    if (e === GetLikesOnUserError.POST_NOT_FOUND) {
      throw e;
    } 
    throw GetLikesOnUserError.UNKNOWN;
  }
};  