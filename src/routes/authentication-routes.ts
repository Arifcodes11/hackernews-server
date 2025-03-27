import { Hono } from "hono";
import {
  logInWithUsernameAndPassword,
  signUpWithUsernameAndPassword,
} from "../controllers/authentication/authentication-controller";
import {
  LogInWtihUsernameAndPasswordError,
  SignUpWithUsernameAndPasswordError,
} from "../controllers/authentication/authentication-types";

export const authenticationRoutes = new Hono();

authenticationRoutes.post("/sign-up", async (context) => {
  const { username, password } = await context.req.json();

  try {
    const result = await signUpWithUsernameAndPassword({
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
          message: "Username already exists",
        },
        409
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
    console.log("Error", e);

    if (e === LogInWtihUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD) {
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