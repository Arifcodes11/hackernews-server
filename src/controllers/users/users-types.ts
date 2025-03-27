import type { User } from "@prisma/client";

export type GetMeResult = {
  user: User;
};

export enum GetMeError {
  BAD_REQUEST,
}

export type GetAllUsersResult = {
  users: User[];
};