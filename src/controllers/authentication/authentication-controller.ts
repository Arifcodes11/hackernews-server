import { createHash, randomUUID } from "crypto";
import {
  LogInWithUsernameAndPasswordError,
  SignUpWithUsernameAndPasswordError,
  type LogInWithUsernameAndPasswordResult,
  type SignUpWithUsernameAndPasswordResult,
} from "./authentication-types";
import { prismaClient as prisma } from "../../integrations/prisma/index";

export const createPasswordHash = (parameters: {
  password: string;
}): string => {
  return createHash("sha256").update(parameters.password).digest("hex");
};

const generateSessionToken = (): string => {
  return createHash("sha256").update(Math.random().toString()).digest("hex");
};

export const signUpWithUsernameAndPassword = async (parameters: {
  username: string;
  password: string;
  name: string;
  email: string;
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

    const sessionToken = generateSessionToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Create user with account and session in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the user first
      const newUser = await tx.user.create({
        data: {
          username: parameters.username,
          name: parameters.name,
          email: parameters.email,
          emailVerified: false,
          displayUsername: parameters.username,
          about: null,
          image: null,
        },
      });

      // Create the account
      await tx.account.create({
        data: {
          id: randomUUID(),
          accountId: randomUUID(),
          providerId: "credentials",
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
          userId: newUser.id,
        },
      });

      // Create the session
      await tx.session.create({
        data: {
          id: randomUUID(),
          token: sessionToken,
          expiresAt,
          createdAt: now,
          updatedAt: now,
          userId: newUser.id,
        },
      });

      // Get the complete user with all relations
      const user = await tx.user.findUnique({
        where: {
          id: newUser.id,
        },
        include: {
          accounts: true,
          sessions: true,
        },
      });

      if (!user) {
        throw new Error("Failed to create user");
      }

      return {
        token: sessionToken,
        user,
      };
    });

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

  // Find user with account in a single query
  const user = await prisma.user.findFirst({
    where: {
      username: parameters.username,
      accounts: {
        some: {
          providerId: "credentials",
          password: passwordHash,
        },
      },
    },
    include: {
      accounts: true,
    },
  });

  if (!user) {
    throw LogInWithUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD;
  }

  const sessionToken = generateSessionToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

  // Create a new session
  await prisma.session.create({
    data: {
      id: randomUUID(),
      token: sessionToken,
      expiresAt,
      createdAt: now,
      updatedAt: now,
      userId: user.id,
    },
  });

  return {
    token: sessionToken,
    user,
  };
};