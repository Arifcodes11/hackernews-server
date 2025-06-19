import { betterAuth } from "better-auth";
import {
  betterAuthSecret,
  serverUrl,
  webClientUrl,
} from "../../utils/environment";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prismaClient } from "../prisma";

export const betterAuthClient = betterAuth({
  baseURL: serverUrl,
  basePath: "/authentication",
  secret: betterAuthSecret,
  database: prismaAdapter(prismaClient, {
    provider: "postgresql",
  }),
  trustedOrigins: [serverUrl, webClientUrl],
  // advanced: {
  //   crossSubDomainCookies: {
  //     enabled: true,
  //     domain: "insight360.info",
  //   },
  // },

  
  advanced: {
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      httpOnly: true,
    },
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === "production",
      domain: process.env.COOKIE_DOMAIN || undefined,
    },
  },

  user: {
    modelName: "User",
  },
  session: {
    modelName: "Session",
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60,
    },
  },
  account: {
    modelName: "Account",
  },
  verification: {
    modelName: "Verification",
  },
  emailAndPassword: {
    enabled: true,
  },

});
