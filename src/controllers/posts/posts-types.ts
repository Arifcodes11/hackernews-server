import type { Post } from "@prisma/client";

export type GetPostsResult = {
  posts: Post[];
};

export type CreatePostResult = {
  newPost: Post;
};

export enum createPostError {
  UNKNOWN,
}