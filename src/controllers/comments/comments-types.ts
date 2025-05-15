import type { Comment } from "../../generated/prisma/index.js";

export type GetCommentsResult = {
  comments: Comment[];
};

export enum GetCommentsError {
  POST_NOT_FOUND = "POST_NOT_FOUND",
  COMMENTS_NOT_FOUND = "COMMENTS_NOT_FOUND",
  PAGE_BEYOND_LIMIT = "PAGE_BEYOND_LIMIT",
  UNKNOWN = "UNKNOWN",
}

export type CreateCommentResult = {
  comment: Comment;
};

export enum CreateCommentError {
  INVALID_INPUT = "INVALID_INPUT",
  POST_NOT_FOUND = "POST_NOT_FOUND",
  UNKNOWN = "UNKNOWN",
}

export type UpdateCommentResult = {
  comment: Comment;
};

export enum UpdateCommentError {
  INVALID_INPUT = "INVALID_INPUT",
  COMMENT_NOT_FOUND = "COMMENT_NOT_FOUND",
  NO_CHANGES = "NO_CHANGES",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN = "UNKNOWN",
}

export enum DeleteCommentError {
  COMMENT_NOT_FOUND = "COMMENT_NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN = "UNKNOWN",
}

export type GetCommentsOnPostsResult = {
  comments: Comment[];
};

export enum GetCommentsOnPostsError {
  PAGE_BEYOND_LIMIT = "PAGE_BEYOND_LIMIT",
  POST_NOT_FOUND = "POST_NOT_FOUND",
  COMMENTS_NOT_FOUND = "COMMENTS_NOT_FOUND",
  UNKNOWN = "UNKNOWN",
}

export type GetCommentsOnMeResult = {
  comments: Comment[];
};

export enum GetCommentsOnMeError {
  COMMENTS_NOT_FOUND = "COMMENTS_NOT_FOUND",
  PAGE_BEYOND_LIMIT = "PAGE_BEYOND_LIMIT",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  UNKNOWN = "UNKNOWN",
}

export type GetCommentsOnUserResult = {
  comments: Comment[];
};

export enum GetCommentsOnUserError {
  COMMENTS_NOT_FOUND = "COMMENTS_NOT_FOUND",
  PAGE_BEYOND_LIMIT = "PAGE_BEYOND_LIMIT",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  POST_NOT_FOUND = "POST_NOT_FOUND",
  UNKNOWN = "UNKNOWN",
}