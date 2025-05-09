export type GetMeResult = {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    image: string | null;
  };
};

export enum GetMeError {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  UNKNOWN = "UNKNOWN",
}

export type GetAllUsersResult = {
  users: {
    id: string;
    name: string | null;
    username: string | null;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    image: string | null;
  }[];
};

export enum GetAllUsersError {
  NO_USERS_FOUND = "NO_USERS_FOUND",
  UNKNOWN = "UNKNOWN",
}

export enum GetUserByIdError {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  UNKNOWN = "UNKNOWN",
}
