import { prismaClient } from "../../extras/prisma";
import { GetMeError, type GetAllUsersResult, type GetMeResult } from "./users-types";

export const getMe = async (parameters: { userId: string }): Promise<GetMeResult> => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: parameters.userId,
    },
  });

  if (!user) {
    throw GetMeError.BAD_REQUEST;
  }

  return {
    user,
  };
};

export const getAllUsers = async (): Promise<GetAllUsersResult> => {
  const users = await prismaClient.user.findMany();

  return {
    users,
  };
};