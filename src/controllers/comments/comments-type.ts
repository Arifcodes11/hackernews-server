import type { Comment } from "@prisma/client";

export enum CommentStatus {
  POST_NOT_FOUND = "POST_NOT_FOUND",
  CREATED_SUCCESSFULLY = "CREATE_SUCCESSFULLY",
  COMMENT_CREATION_FAILED = "COMMENT_CREATION_FAILED",
  COMMENT_NOT_FOUND = "COMMENT_NOT_FOUND",
  UNKNOWN = "UNKNOWN",
  DELETE_SUCCESS = "DELETE_SUCCESS",
  UPDATE_SUCCESS = "UPDATE_SUCCESS",
}

export type CreateCommentResult = {
  comment: Comment;
};

export type CommentResult = {
  comment: Comment[];
};
