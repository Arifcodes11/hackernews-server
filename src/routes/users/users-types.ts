import type { User } from "../../generated/prisma/index.js";

// export type GetMeResult = {
//   user: {
//     comments: {
//       id: string;
//       content: string;
//       postId: string;
//       createdAt: Date;
//       updatedAt: Date;
//       userId: string;
//     }[];
//     likes: {
//       id: string;
//       postId: string;
//       createdAt: Date;
//       updatedAt: Date;
//       userId: string;
//     }[];
//     id: string;
//     username: string;
//     email?: string;
//     name: string;
//     about: string;
//     createdAt: Date;
//     updatedAt: Date;
//     posts: {
//       id: string;
//       title: string;
//       content: string;
//       createdAt: Date;
//       updatedAt: Date;
//       userId: string;
//     }[];
//   };
// };

// export type GetMeResult = {
//   user: {
//     comments: {
//       id: string;
//       content: string;
//       postId: string | null;
//       createdAt: Date;
//       updatedAt: Date;
//       userId: string;
//     }[];
//     likes: {
//       id: string;
//       postId: string;
//       createdAt: Date;
//       updatedAt: Date;
//       userId: string;
//     }[];
//     id: string;
//     username: string;
//     email?: string;
//     name: string;
//     about: string;
//     createdAt: Date;
//     updatedAt: Date;
//     posts: {
//       id: string;
//       title: string;
//       content: string;
//       createdAt: Date;
//       updatedAt: Date;
//       userId: string;
//     }[];
//   };
// };


export type GetMeResult = {
  user: {
    comments: {
      id: string;
      content: string;
      postId: string | null;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      post: { // Add this to include the post title in the comments
        title: string;
      } | null; // post could be null if the postId is null
    }[];
    likes: {
      id: string;
      postId: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      post: { // Add this to include the post title in the likes
        title: string;
      };
    }[];
    id: string;
    username: string;
    email?: string;
    name: string;
    about: string;
    createdAt: Date;
    updatedAt: Date;
    posts: {
      id: string;
      title: string;
      content: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
    }[];
  };
};


// export type UserDetails = {
//   user: {
//     id: string;
//     username: string;
//     name: string;
//     about: string;
//     createdAt: Date;
//     updatedAt: Date;
//     postsCount: number;
//     commentsCount: number;
//     posts: {
//       id: string;
//       title: string;
//       content: string;
//       createdAt: Date;
//       updatedAt: Date;
//       userId: string;
//     }[];
//     comments: {
//       id: string;
//       content: string;
//       postId: string;
//       createdAt: Date;
//       updatedAt: Date;
//       userId: string;
//     }[];
//   };
// };


export type UserDetails = {
  user: {
    id: string;
    username: string;
    name: string;
    about: string;
    createdAt: Date;
    updatedAt: Date;
    postsCount: number;
    commentsCount: number;
    likesCount: number;
    posts: {
      id: string;
      title: string;
      content: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
    }[];
    comments: {
      id: string;
      content: string;
      postId: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
    }[];
    likedPosts: {
      id: string;
      title: string;
      content: string;
      createdAt: Date;
      updatedAt: Date;
    }[];
  };
};




export enum GetMeError {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  PAGE_BEYOND_LIMIT = "PAGE_BEYOND_LIMIT",
  UNKNOWN = "UNKNOWN",
}

export type GetUsersResult = {
  users: User[];
};

export enum GetUsersError {
  USERS_NOT_FOUND = "USERS_NOT_FOUND",
  PAGE_BEYOND_LIMIT = "PAGE_BEYOND_LIMIT",
  UNKNOWN = "UNKNOWN",
}