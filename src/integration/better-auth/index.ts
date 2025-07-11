// import { betterAuth } from "better-auth";
import {
  betterAuthSecret,
  serverUrl,
  webClientUrl,
} from "../../utils/environment";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prismaClient } from "../prisma";
import { betterAuth } from "better-auth";

export const betterAuthClient = betterAuth({
  baseURL: serverUrl,
  basePath: "/authentication",
  secret: betterAuthSecret,

  database: prismaAdapter(prismaClient, {
    provider: "postgresql",
  }),

  trustedOrigins: [serverUrl, webClientUrl],

  advanced: {
    defaultCookieAttributes: {
      sameSite: "none", // ✅ for cross-site cookies
      secure: true,     // ✅ must be true for SameSite: none
      httpOnly: true,
      path: "/",
    },
    crossSubDomainCookies: {
      enabled: false, // ❌ not using same root domain (e.g. *.insight360.info)
    },
  },

  user: {
    modelName: "User",
  },
  session: {
    modelName: "Session",
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60, // 1 hour
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
