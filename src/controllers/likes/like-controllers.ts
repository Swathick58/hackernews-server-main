import { getPagination } from "../../extras/pagination";
import { prismaClient } from "../../integrations/prisma";
import { LikeStatus, type GetLikesResult, type LikeActionResult } from "./like-types";

export const getLikesOnPost = async (params: {
  postId: string;
  page: number;
  limit: number;
}): Promise<GetLikesResult> => {
  try {
    const { skip, take } = getPagination(params.page, params.limit);

    const post = await prismaClient.post.findUnique({
      where: { id: params.postId },
    });

    if (!post) {
      return { status: LikeStatus.POST_NOT_FOUND };
    }

    const likes = await prismaClient.like.findMany({
      where: { postId: params.postId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (likes.length === 0) {
      return { status: LikeStatus.NO_LIKES_FOUND };
    }

   return {
     status: "SUCCESS",
     likes: likes.map((like) => ({
       id: like.id,
       createdAt: like.createdAt,
       user: {
         id: like.user.id,
         name: like.user.name,
       },
     })),
   };
  } catch (error) {
    console.error("Error fetching likes:", error);
    return { status: LikeStatus.UNKNOWN };
  }
};

export const deleteLikeOnPost = async (params: {
  postId: string;
  userId: string;
}): Promise<LikeActionResult> => {
  try {
    const like = await prismaClient.like.findFirst({
      where: {
        postId: params.postId,
        userId: params.userId,
      },
    });

    if (!like) {
      return { status: LikeStatus.LIKE_NOT_FOUND };
    }

    await prismaClient.like.delete({
      where: {
        id: like.id,
      },
    });

    return { status: LikeStatus.LIKE_DELETED };
  } catch (error) {
    console.error(error);
    return { status: LikeStatus.UNKNOWN };
  }
};

export const createLike = async (params: {
  postId: string;
  userId: string;
}): Promise<LikeActionResult> => {
  try {
    const post = await prismaClient.post.findUnique({
      where: { id: params.postId },
    });

    if (!post) {
      return { status: LikeStatus.POST_NOT_FOUND };
    }

    const existingLike = await prismaClient.like.findFirst({
      where: {
        postId: params.postId,
        userId: params.userId,
      },
    });

    if (existingLike) {
      return { status: LikeStatus.ALREADY_LIKED};
    }

    await prismaClient.like.create({
      data: {
        postId: params.postId,
        userId: params.userId,
      },
    });

    return { status: LikeStatus.LIKE_ADDED };
  } catch (error) {
    console.error("Error creating like:", error);
    return { status: LikeStatus.UNKNOWN };
  }
};