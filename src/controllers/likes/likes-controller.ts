import { prismaClient } from "../../extras/prisma.js";
import type { CreateLikeResult, GetLikesResult } from "./likes-types.js";

export const getLikesOnPost = async (parameters: {
  postId: string;
  page: number;
}): Promise<GetLikesResult> => {
  const limit = 10;
  const offset = (parameters.page - 1) * limit;
  const likes = await prismaClient.like.findMany({
    where: {
      postId: parameters.postId,
    },
    orderBy: { createAt: "desc" },
    skip: offset,
    take: limit,
  });
  return { likes };
};

export const createLike = async (parameters: {
  userId: string;
  postId: string;
}): Promise<CreateLikeResult> => {
  const existingLike = await prismaClient.like.findFirst({
    where: {
        userId: parameters.userId,
        postId: parameters.postId,
      },
  });

  if (existingLike) {
    throw new Error("Already liked")
  }
  const like = await prismaClient.like.create({
    data: {
      userId: parameters.userId,
      postId: parameters.postId,
    },
  });
  return { like };
};

export const deleteLike = async (parameters: {
  userId: string;
  postId: string;
}): Promise<void> => {
  try {
    await prismaClient.like.deleteMany({
      where: {
        userId: parameters.userId,
        postId: parameters.postId,
      },
    });
  } catch (error) {
    throw new Error("Failed to delete like");
  }
};