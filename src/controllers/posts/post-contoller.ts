import { getPagination } from "../../extras/pagination";
import { prismaClient } from "../../integrations/prisma";
import {
  DeletePostError,
  GetPostsError,
  PostStatus,
  type GetPostsResult,
  type PostCreateResult,
} from "./post-type";

import { startOfDay, endOfDay, subDays } from "date-fns";

// Create a post
export const createPost = async (parameters: {
  title: string;
  content: string;
  authorId: string | undefined;
}): Promise<PostCreateResult | PostStatus> => {
  try {
    if (!parameters.authorId) {
      return PostStatus.USER_NOT_FOUND;
    }

    const post = await prismaClient.post.create({
      data: {
        title: parameters.title,
        content: parameters.content,
        author: {
          connect: { id: parameters.authorId },
        },
      },
    });

    return { post };
  } catch (error) {
    console.error(error);
    return PostStatus.POST_CREATION_FAILED;
  }
};

// Get all posts (with pagination)
export const getAllPosts = async (parameters: {
  page: number;
  limit: number;
}): Promise<GetPostsResult> => {
  try {
    const { skip, take } = getPagination(parameters.page, parameters.limit);

    const posts = await prismaClient.post.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        Comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
        Like: {
          select: {
            id: true,
            userId: true,
            createdAt: true,
          },
        },
      },
    });

    return { posts };
  } catch (error) {
    console.error(error);
    throw new Error(GetPostsError.UNKNOWN);
  }
};

// Get posts by specific user
export const getPostsByUser = async (parameters: {
  userId: string;
  page: number;
  limit: number;
}): Promise<GetPostsResult> => {
  try {
    const { skip, take } = getPagination(parameters.page, parameters.limit);
    const posts = await prismaClient.post.findMany({
      where: {
        userId: parameters.userId,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return { posts };
  } catch (error) {
    console.error(error);
    throw new Error(GetPostsError.UNKNOWN);
  }
};

// Delete a post
export const deletePost = async (params: {
  postId: string;
  userId: string;
}): Promise<DeletePostError> => {
  try {
    const post = await prismaClient.post.findUnique({
      where: { id: params.postId },
    });

    if (!post) {
      return DeletePostError.POST_NOT_FOUND;
    }

    if (post.userId !== params.userId) {
      return DeletePostError.UNAUTHORIZED;
    }

    await prismaClient.post.delete({
      where: { id: params.postId },
    });

    return DeletePostError.DELETE_SUCCESS;
  } catch (error) {
    console.error(error);
    return DeletePostError.DELETE_FAILED;
  }
};

// Get today's top posts
export const getTopPostsToday = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const skip = (page - 1) * limit;

  return await prismaClient.post.findMany({
    where: {
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: limit,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
  });
};

// Get yesterday's posts
export const getPostsFromYesterday = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const yesterdayStart = startOfDay(subDays(new Date(), 1));
  const yesterdayEnd = endOfDay(subDays(new Date(), 1));
  const skip = (page - 1) * limit;

  return await prismaClient.post.findMany({
    where: {
      createdAt: {
        gte: yesterdayStart,
        lte: yesterdayEnd,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: limit,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
  });
};

// Get post by ID (with comments and author info)
export const getPostById = async (postId: string) => {
  const post = await prismaClient.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      Comment: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              username: true,
            },
          },
          post: {
            select: {
              id: true,
              content: true,
              title: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
};
