
import { Hono } from "hono";
import { createLike, getLikesOnPost, deleteLikeOnPost } from "./like-controllers";
import { LikeStatus } from "./like-types";
import { sessionMiddleware } from "../../routes/middlewares/session-middleware";

export const likeRoutes = new Hono();

// POST - Like a post
likeRoutes.post("/on/:postId", sessionMiddleware, async (context) => {
  try {
    const userId = context.get("user").id; // Get user ID from session
    const postId = context.req.param("postId");

    if (!userId) {
      return context.json({ error: "Unauthorized" }, 401);
    }

    const result = await createLike({ postId, userId });

    switch (result.status) {
      case LikeStatus.POST_NOT_FOUND:
        return context.json({ error: "Post not found" }, 404);
      case LikeStatus.ALREADY_LIKED:
        return context.json(
          { message: "You have already liked this post" },
          200
        );
      case LikeStatus.UNKNOWN:
        return context.json(
          { error: "Unknown error occurred while liking the post" },
          500
        );
      default:
        return context.json({ message: "Post liked successfully" }, 201);
    }
  } catch (error) {
    console.error("Error liking the post:", error);
    return context.json({ error: "Server error while liking the post" }, 500);
  }
});

// GET - Get all likes on a specific post
likeRoutes.get("/on/:postId", async (context) => {
  try {
    const postId = context.req.param("postId");
    const page = parseInt(context.req.query("page") || "1", 10);
    const limit = parseInt(context.req.query("limit") || "10", 10);

    const result = await getLikesOnPost({
      postId: postId,
      page: page,
      limit: limit,
    });

   switch (result.status) {
     case LikeStatus.POST_NOT_FOUND:
       return context.json({ error: "Post not found" }, 404);
     case LikeStatus.NO_LIKES_FOUND:
       return context.json({ message: "No likes found on this post" }, 200);
     case LikeStatus.UNKNOWN:
       return context.json(
         { error: "An unknown error occurred while fetching likes" },
         500
       );
     default:
       return context.json(result, 200);
   }
  } catch (error) {
    console.error("Error fetching likes:", error);
    return context.json({ error: "Server error while fetching likes" }, 500);
  }
});

// DELETE - Remove a like from a post
likeRoutes.delete("/on/:postId", sessionMiddleware, async (context) => {
  try {
    const postId = context.req.param("postId");
    const userId = context.get("user").id; // Get user ID from session

    if (!postId || !userId) {
      return context.json({ error: "Invalid postId or userId" }, 400);
    }

    const result = await deleteLikeOnPost({ postId, userId });

    switch (result.status) {
      case LikeStatus.LIKE_NOT_FOUND:
        return context.json(
          { error: "Like not found or not authored by you" },
          404
        );
      case LikeStatus.UNKNOWN:
        return context.json(
          { error: "An unknown error occurred while deleting the like" },
          500
        );
      default:
        return context.json({ message: "Like deleted successfully" }, 200);
    }
  } catch (error) {
    console.error("Error deleting like:", error);
    return context.json({ error: "Server error while deleting like" }, 500);
  }
});

export default likeRoutes;
