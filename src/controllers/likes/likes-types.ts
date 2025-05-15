import type { Like } from "../../generated/prisma/index.js";

export type GetLikesResult = {
  likes: Like[];
};

export enum GetLikesError {
  POST_NOT_FOUND = "POST_NOT_FOUND",
  LIKES_NOT_FOUND = "LIKES_NOT_FOUND",
  PAGE_NOT_FOUND = "PAGE_NOT_FOUND",
  UNKNOWN = "UNKNOWN",
}

export type LikePostResult = {
  like: Like,
  message: string
}

export enum LikePostError {
    POST_NOT_FOUND = "POST_NOT_FOUND",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    UNKNOWN = "UNKNOWN",
    ALREADY_LIKED = "ALREADY_LIKED"
}

export type DeleteLikeResult = {
    message: string
}

export enum DeleteLikeError {
    POST_NOT_FOUND = "POST_NOT_FOUND",
    LIKE_NOT_FOUND = "LIKE_NOT_FOUND",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    UNKNOWN = "UNKNOWN"
}

export type GetLikesOnMeResult = {  
  likes: Like[];
};

export enum GetLikesOnMeError {
  LIKES_NOT_FOUND = "LIKES_NOT_FOUND",
  PAGE_NOT_FOUND = "PAGE_NOT_FOUND",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  UNKNOWN = "UNKNOWN",
}

export type GetLikesOnUserResult = {
  likes: Like[];
};

export enum GetLikesOnUserError {
  LIKES_NOT_FOUND = "LIKES_NOT_FOUND",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  PAGE_NOT_FOUND = "PAGE_NOT_FOUND",
  POST_NOT_FOUND = "POST_NOT_FOUND",
  UNKNOWN = "UNKNOWN",
}