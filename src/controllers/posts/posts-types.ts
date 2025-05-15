import type { Comment, Post } from "../../generated/prisma/index.js";


export type GetPostsResult = {
    posts: Post[]
}

export enum GetPostsError {
  POSTS_NOT_FOUND = "POSTS_NOT_FOUND",
  PAGE_BEYOND_LIMIT = "PAGE_BEYOND_LIMIT",
  UNKNOWN = "UNKNOWN"
}

export type CreatePostResult = {
    post: Post
}

export enum CreatePostError {
    USER_NOT_FOUND = "USER_NOT_FOUND",
    TITLE_REQUIRED = "TITLE_REQUIRED",
    UNKNOWN = "UNKNOWN"
}

export type GetPostByIdResult = {
    post: Post
}

export enum GetPostByIdError {
    POST_NOT_FOUND = "POST_NOT_FOUND",
    UNKNOWN = "UNKNOWN"
}

export enum DeletePostError {
    USER_NOT_FOUND = "USER_NOT_FOUND",
    POST_NOT_FOUND = "POST_NOT_FOUND",
    UNKNOWN = "UNKNOWN"
}


export type GetCommentsByPostIdResult = {
    comments: Comment[]
}

export enum GetCommentsByPostIdError {
    POST_NOT_FOUND = "POST_NOT_FOUND",
    UNKNOWN = "UNKNOWN"
}

export type CreateCommentByPostIdResult = {
    comment: Comment
}

export enum CreateCommentByPostIdError {
    POST_NOT_FOUND = "POST_NOT_FOUND",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    UNKNOWN = "UNKNOWN"
}       

export type GetUserPostsBySlugResult = {
    posts: Post[]
}

export enum GetUserPostsBySlugError {
    USER_NOT_FOUND = "USER_NOT_FOUND",
    POSTS_NOT_FOUND = "POSTS_NOT_FOUND",
    PAGE_BEYOND_LIMIT = "PAGE_BEYOND_LIMIT",
    UNKNOWN = "UNKNOWN"
}