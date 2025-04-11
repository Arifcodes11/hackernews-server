import { createHash } from "crypto";
import {
  LogInWithUsernameAndPasswordError,
  SignUpWithUsernameAndPasswordError,
  type LogInWithUsernameAndPasswordResult,
  type SignUpWithUsernameAndPasswordResult,
} from "./authentication-types.js";

import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../../environment.js";
import { prismaClient } from "../../extras/prisma.js";

const createJWToken = (parameters: {
  id: string;
  username: string;
}): string => {
  // Generate token
  const jwtPayload: jwt.JwtPayload = {
    iss: "https://purpleshorts.co.in",
    sub: parameters.id,
    username: parameters.username,
  };

  const token = jwt.sign(jwtPayload, jwtSecretKey, {
    expiresIn: "30d",
  });

  return token;
};

export const checkIfUserExistsAlready = async (parameters: {
  username: string;
}): Promise<boolean> => {
  const existingUser = await prismaClient.user.findUnique({
    where: {
      username: parameters.username,
    },
  });

  if (existingUser) {
    return true;
  }

  return false;
};

export const createPasswordHash = (parameters: {
  password: string;
}): string => {
  return createHash("sha256").update(parameters.password).digest("hex");
};

export const signUpWithUsernameAndpassword = async (parameters: {
  username: string;
  password: string;
}): Promise<SignUpWithUsernameAndPasswordResult> => {
  try {
    const isUserExistingAlready = await checkIfUserExistsAlready({
      username: parameters.username,
    });

    if (isUserExistingAlready) {
      throw SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME;
    }

    const passwordHash = createPasswordHash({
      password: parameters.password,
    });

    const user = await prismaClient.user.create({
      data: {
        username: parameters.username,
        password: passwordHash,
      },
    });

    const token = createJWToken({
      id: user.id,
      username: user.username,
    });

    const result: SignUpWithUsernameAndPasswordResult = {
      token,
      user,
    };

    return result;
  } catch (e) {
    console.log("Error", e);
    throw SignUpWithUsernameAndPasswordError.UNKNOWN;
  }
};

export const logInWithUsernameAndPassword = async (parameters: {
  username: string;
  password: string;
}): Promise<LogInWithUsernameAndPasswordResult> => {
  const passwordHash = createPasswordHash({
    password: parameters.password,
  });

  const user = await prismaClient.user.findUnique({
    where: {
      username: parameters.username,
      password: passwordHash,
    },
  });

  if (!user) {
    throw LogInWithUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD;
  }

  const token = createJWToken({
    id: user.id,
    username: user.username,
  });

  return {
    token,
    user,
  };
};