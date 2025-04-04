import { createHash } from "crypto";
import {
  LogInWithUsernameAndPasswordError,
  SignUpWithUsernameAndPasswordError,
  type LogInWithUsernameAndPasswordResult,
  type SignUpWithUsernameAndPasswordResult,
} from "./authentication-types.js";
import { prisma } from "../../extras/prisma.js";
import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../../environment.js";

export const createPasswordHash = (parameters: {
  password: string;
}): string => {
  return createHash("sha256").update(parameters.password).digest("hex");
};

const createJWToken = (parameters: {
  id: string;
  username: string;
}): string => {
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

export const signUpWithUsernameAndPassword = async (parameters: {
  username: string;
  password: string;
  name: string;
}): Promise<SignUpWithUsernameAndPasswordResult> => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        username: parameters.username,
      },
    });

    if (existingUser) {
      throw SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME;
    }

    const hashedPassword = createPasswordHash({
      password: parameters.password,
    });
    const user = await prisma.user.create({
      data: {
        username: parameters.username,
        password: hashedPassword,
        name: parameters.name,
      },
    });

    const jwtPayload: jwt.JwtPayload = {
      iss: "http://purpleshorts.co.in",
      sub: user.id,
      username: user.username,
    };

    const token = jwt.sign(jwtPayload, jwtSecretKey, {
      expiresIn: "30d",
    });

    const result: SignUpWithUsernameAndPasswordResult = {
      token,
      user,
    };

    return result;
  } catch (e) {
    console.error(e);
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

  const user = await prisma.user.findUnique({
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

  const result: LogInWithUsernameAndPasswordResult = {
    token,
    user,
  };

  return result;
};
