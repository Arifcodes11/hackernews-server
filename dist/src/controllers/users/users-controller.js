import { getPagination } from "../../extras/pagination";
import { prisma } from "../../extras/prisma";
import { GetAllUsersError, GetMeError, } from "./users-types";
export const GetMe = async (parameters) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parameters.userId },
        });
        if (!user) {
            throw GetMeError.USER_NOT_FOUND;
        }
        const result = {
            user: user,
        };
        return result;
    }
    catch (e) {
        console.error(e);
        throw GetMeError.UNKNOWN;
    }
};
export const GetUsers = async (parameter) => {
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
    }
    catch (e) {
        console.error(e);
        throw GetAllUsersError.UNKNOWN;
    }
};
