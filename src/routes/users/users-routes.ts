import { Hono } from "hono";

import { GetUsersError, GetMeError } from "./users-types.js";

import { prismaClient } from "../../integrations/prisma/index.js";
import { sessionMiddleware } from "../middlewares/session-middleware.js";
import { getPagination } from "../../extras/pagination.js";
import { GetMe, GetUserById, GetUsers } from "./users-controller.js";
export const usersRoutes = new Hono();

// usersRoutes.all("/me", sessionMiddleware, async (context) => {
//   const user = context.get("user");
//   const userId = user?.id;

//   if (!userId) {
//     return context.json({ error: "User not found" }, 404);
//   }

//   if (context.req.method === "GET") {
//     // Existing GET method to fetch user profile
//     try {
//       const { page, limit } = getPagination(context);
//       const result = await GetMe({ userId, page, limit });

//       if (!result) {
//         return context.json({ error: "User not found" }, 404);
//       }

//       return context.json(result, 200);
//     } catch (error) {
//       if (error === GetMeError.USER_NOT_FOUND) {
//         return context.json({ error: "User not found" }, 404);
//       }
//       if (error === GetMeError.UNKNOWN) {
//         return context.json({ error: "Unknown error" }, 500);
//       }
//     }
//   } else if (context.req.method === "POST") {
//     // New POST method to update "About" field
//     try {
//       const { about } = await context.req.json();

//       if (!about) {
//         return context.json({ error: "About field is required" }, 400);
//       }

//       // Update the 'about' field in the database
//       const updatedUser = await prismaClient.user.update({
//         where: { id: userId },
//         data: { about },
//       });

//       return context.json({ user: updatedUser }, 200);
//     } catch (error) {
//       console.error("Error updating About:", error);
//       return context.json({ error: "Failed to update About" }, 500);
//     }
//   }
// });

usersRoutes.all("/me", sessionMiddleware, async (context) => {
  const user = context.get("user");
  const userId = user?.id;

  if (!userId) {
    return context.json({ error: "User not found" }, 404);
  }

  if (context.req.method === "GET") {
    try {
      const result = await GetMe({ userId });

      if (!result) {
        return context.json({ error: "User not found" }, 404);
      }

      return context.json(result, 200);
    } catch (error) {
      if (error === GetMeError.USER_NOT_FOUND) {
        return context.json({ error: "User not found" }, 404);
      }
      if (error === GetMeError.UNKNOWN) {
        return context.json({ error: "Unknown error" }, 500);
      }
    }
  } else if (context.req.method === "POST") {
    try {
      const { about } = await context.req.json();

      if (!about) {
        return context.json({ error: "About field is required" }, 400);
      }

      const updatedUser = await prismaClient.user.update({
        where: { id: userId },
        data: { about },
      });

      return context.json({ user: updatedUser }, 200);
    } catch (error) {
      console.error("Error updating About:", error);
      return context.json({ error: "Failed to update About" }, 500);
    }
  }
});

usersRoutes.get("/", sessionMiddleware, async (context) => {
  try {
    const { page, limit } = getPagination(context);

    const result = await GetUsers({ page, limit });
    if (!result) {
      return context.json({ error: "No users found" }, 404);
    }
    return context.json(result, 200);
  } catch (error) {
    if (error === GetUsersError.USERS_NOT_FOUND) {
      return context.json({ error: "No users found" }, 404);
    }
    if (error === GetUsersError.PAGE_BEYOND_LIMIT) {
      return context.json(
        { error: "No users found on the page requested" },
        404
      );
    }
    if (error === GetUsersError.UNKNOWN) {
      return context.json({ error: "Unknown error" }, 500);
    }
  }
});

usersRoutes.get("/:id", async (context) => {
  const userId = context.req.param("id"); // Get userId from URL params

  try {
    const result = await GetUserById(userId); // Use the GetUserById function to get the user's data

    if (!result) {
      return context.json({ error: "User not found" }, 404);
    }

    return context.json(result, 200);
  } catch (error) {
    return context.json("Unknown error", 500);
  }
});
