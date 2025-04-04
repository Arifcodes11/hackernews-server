import { getPagination } from "../../extras/pagination.js";
import { prisma } from "../../extras/prisma.js";
import {
  GetAllUsersError,
  GetMeError,
  type GetAllUsersResult,
  type GetMeResult,
} from "./users-types.js";

export const GetMe = async (parameters: {
  userId: string;
}): Promise<GetMeResult> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parameters.userId },
    });

    if (!user) {
      throw GetMeError.USER_NOT_FOUND;
    }

    const result: GetMeResult = {
      user: user,
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
}): Promise<GetAllUsersResult> => {
  try {
    const { skip, take } = getPagination(parameter.page, parameter.limit);

    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      skip,
      take,
    });

    if (!users || users.length === 0) {
      throw GetAllUsersError.NO_USERS_FOUND;
    }

    return { users };
  } catch (e) {
    console.error(e);
    throw GetAllUsersError.UNKNOWN;
  }
};
