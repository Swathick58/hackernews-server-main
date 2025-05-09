import { Hono } from "hono";

import { GetMe, GetUsers } from "../../controllers/users/users-controller";
import { GetAllUsersError, GetMeError, GetUserByIdError } from "../../controllers/users/users-type";
import { sessionMiddleware } from "../../routes/middlewares/session-middleware";
import { SearchUsers } from "../../controllers/users/users-controller";


export const usersRoutes = new Hono();

usersRoutes.get("/me", sessionMiddleware, async (context) => {
  try {
    const sessionUser = context.get("user"); // pulled from sessionMiddleware

    if (!sessionUser?.id) {
      return context.json({ error: "User not found in session" }, 401);
    }

    const result = await GetMe({ userId: sessionUser.id });

    return context.json(result, 200);
  } catch (error) {
    if (error === GetMeError.USER_NOT_FOUND) {
      return context.json({ error: "User not found" }, 404);
    }
    console.error("GetMe error:", error);
    return context.json({ error: "Unknown error" }, 500);
  }
});

usersRoutes.get("/", sessionMiddleware, async (context) => {
  try {
    const page = parseInt(context.req.query("page") || "1", 10);
    const limit = parseInt(context.req.query("limit") || "2", 10);
    const result = await GetUsers({ page, limit });

    if (!result) {
      return context.json({ error: "Users not found" }, 404);
    }
    return context.json(result, 200);
  } catch (error) {
    if (error === GetAllUsersError.NO_USERS_FOUND) {
      return context.json({ error: "Users not found" }, 404);
    }
    if (error === GetAllUsersError.UNKNOWN) {
      return context.json({ error: "Unknown error" }, 500);
    }
  }
});


usersRoutes.get("/profile/:userId", async (context) => {
  try {

    const userId = context.req.param("userId"); // Use param() method instead of params
    const result = await GetMe({ userId });
    

    if (!result) {
      return context.json({ error: "User not found" }, 404);
    }

    return context.json(result, 200);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return context.json({ error: "Failed to fetch user profile" }, 500);
  }
});




usersRoutes.get("/search", async (context) => {
  try {
    const query = context.req.query("q") || "";
    const page = parseInt(context.req.query("page") || "1", 10);
    const limit = parseInt(context.req.query("limit") || "10", 10);

    if (!query) {
      return context.json({ error: "Query parameter 'q' is required" }, 400);
    }

    const result = await SearchUsers({ query, page, limit });

    return context.json(result, 200);
  } catch (error) {
    if (error === GetAllUsersError.NO_USERS_FOUND) {
      return context.json({ error: "No users found matching the query" }, 404);
    }
    console.error("SearchUsers error:", error);
    return context.json(
      { error: "Unknown error occurred while searching" },
      500
    );
  }
});
