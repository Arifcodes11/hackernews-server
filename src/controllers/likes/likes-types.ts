import type { Like } from "@prisma/client";

export type GetLikesResult = {
  likes: Like[];
};

export type CreateLikeResult = {
  like: Like ;
};