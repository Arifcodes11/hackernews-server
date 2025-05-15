import type { User } from "../../generated/prisma/index.js";

export type SignUpWithUsernameAndPasswordResult = {
  token: string;
  user: User;
};

export enum SignUpWithUsernameAndPasswordError {
  CONFLICTING_USERNAME = "CONFLICTING_USERNAME",
  UNKNOWN = "UNKNOWN",
}

export type LogInWithUsernameAndPasswordResult = {
  token: string;
  user: User;
};

export enum LogInWithUsernameAndPasswordError {
  INCORRECT_USERNAME_OR_PASSWORD = "INCORRECT_USERNAME_OR_PASSWORD",
  UNKNOWN = "UNKNOWN",
}