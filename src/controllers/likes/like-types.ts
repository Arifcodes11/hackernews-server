export enum LikeStatus {
  ALREADY_LIKED = "ALREADY_LIKED",
  LIKE_SUCCESS = "LIKE_SUCCESS",
  UNKNOWN = "UNKNOWN",
  POST_NOT_FOUND = "POST_NOT_FOUND",
  NO_LIKES_FOUND = "NO_LIKES_FOUND",
  LIKE_NOT_FOUND = "LIKE_NOT_FOUND",
  LIKE_DELETED = "LIKE_DELETED",
}

export type LikeCreate = {
  status: LikeStatus;
};

export type GetLikesResult = {
  likes: {
    id: string;
    createdAt: Date;
    user: {
      id: string;
      username: string;
    };
  }[];
};
