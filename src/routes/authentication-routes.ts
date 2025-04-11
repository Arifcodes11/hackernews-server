import { Hono } from "hono";
import { logInWithUsernameAndPassword, signUpWithUsernameAndpassword } from "../controllers/authentication/authentication-controller.js";
import { LogInWithUsernameAndPasswordError, SignUpWithUsernameAndPasswordError } from "../controllers/authentication/authentication-types.js";


export const  authenticationRoutes = new Hono();

authenticationRoutes.post("/sign-up", async (context) => {
  const { username, password } = await context.req.json();

  try {
    const result = await signUpWithUsernameAndpassword({
      username,
      password,
    });

    return context.json(
      {
        data: result,
      },
      201
    );
  } catch (e) {
    if (e === SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME) {
      return context.json(
        {
          message: "User name already exists",
        },
        409
      );
    }

    if (e === SignUpWithUsernameAndPasswordError.UNKNOWN) {
      return context.json(
        {
          message: "Unknown",
        },
        500
      );
    }
  }
});

authenticationRoutes.post("/log-in", async (context) => {
  try {
    const { username, password } = await context.req.json();
    const result = await logInWithUsernameAndPassword({
      username,
      password,
    });

    return context.json(
      {
        data: result,
      },
      201
    );
  } catch (e) {
    if (
      e === LogInWithUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD
    ) {
      return context.json(
        {
          message: "Incorrect username or password",
        },
        401
      );
    }
    return context.json(
      {
        message: "Unknown",
      },
      500
    );
  }
});