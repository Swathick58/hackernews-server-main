export type LikeUser = {
  id: string;
  name: string | null;
};

export type LikeItem = {
  id: string;
  createdAt: Date;
  user: LikeUser;
};

export type LikeActionResult = {
  status: LikeStatus;
};

export enum LikeStatus {
  LIKE_ADDED = "LIKE_ADDED",
  LIKE_DELETED = "LIKE_DELETED",
  LIKE_NOT_FOUND = "LIKE_NOT_FOUND",
  POST_NOT_FOUND = "POST_NOT_FOUND",
  NO_LIKES_FOUND = "NO_LIKES_FOUND",
  UNKNOWN = "UNKNOWN",
  ALREADY_LIKED = "ALREADY_LIKED",
  LIKE_SUCCESS = "LIKE_SUCCESS",
}

export type GetLikesResult =
  | {
      status: "SUCCESS";
      likes: LikeItem[];
    }
  | {
      status:
        | LikeStatus.POST_NOT_FOUND
        | LikeStatus.NO_LIKES_FOUND
        | LikeStatus.UNKNOWN;
    };
