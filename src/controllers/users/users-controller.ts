import { prismaClient as prisma } from "../../integrations/prisma/index.js";
import {
  GetMeError,
  type GetMeResult,
  type GetUsersResult,
  GetUsersError,
  type UserDetails,
} from "./users-types.js";


export const GetMe = async (parameters: {
  userId: string;
}): Promise<GetMeResult> => {
  try {
    const { userId } = parameters;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        about: true,
        createdAt: true,
        updatedAt: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            postId: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            post: { // Include post title in comments
              select: {
                title: true,
              },
            },
          },
        },
        likes: {
          select: {
            id: true,
            postId: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            post: { // Include post title in likes
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw GetMeError.USER_NOT_FOUND;
    }

    const result: GetMeResult = {
      user: {
        id: user.id,
        username: user.username,
        name: user.name || "",
        about: user.about || "",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        posts: user.posts || [],
        comments: user.comments || [],
        likes: user.likes || [],
      },
    };

    return result;
  } catch (e) {
    console.error(e);
    throw GetMeError.UNKNOWN;
  }
};


export const GetUsers = async (parameter: {
  page: number;
  limit: number;
}): Promise<GetUsersResult> => {
  try {
    const { page, limit } = parameter;
    const skip = (page - 1) * limit;

    const totalUsers = await prisma.user.count();
    if (totalUsers === 0) {
      throw GetUsersError.USERS_NOT_FOUND;
    }

    const totalPages = Math.ceil(totalUsers / limit);
    if (page > totalPages) {
      throw GetUsersError.PAGE_BEYOND_LIMIT;
    }

    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      skip,
      take: limit,
    });

    return { users };
  } catch (e) {
    console.error(e);
    if (
      e === GetUsersError.USERS_NOT_FOUND ||
      e === GetUsersError.PAGE_BEYOND_LIMIT
    ) {
      throw e;
    }
    throw GetUsersError.UNKNOWN;
  }
};

export const GetUserById = async (userId: string): Promise<UserDetails> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        about: true,
        createdAt: true,
        updatedAt: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            postId: true,  // postId might be null
            createdAt: true,
            updatedAt: true,
            userId: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const result: UserDetails = {
      user: {
        id: user.id,
        username: user.username,
        name: user.name || "",
        about: user.about || "",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        postsCount: user.posts.length,
        commentsCount: user.comments.filter(comment => comment.postId !== null).length,  // Count only comments with postId
        posts: user.posts || [],
        // Ensure postId is always a string (filter out comments with null postId)
        comments: user.comments.filter(comment => comment.postId !== null) as {
          id: string;
          content: string;
          postId: string;
          createdAt: Date;
          updatedAt: Date;
          userId: string;
        }[],
      },
    };

    return result;
  } catch (e) {
    console.error(e);
    throw new Error("Unknown error");
  }
};