import { betterAuth } from "better-auth";
import {
  betterAuthSecret,
  googleClientId,
  googleClientSecret,
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
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: "insight360.info",
    },
  },

  
  // advanced: {
  //   defaultCookieAttributes: {
  //     sameSite: "none",
  //     secure: true,
  //     partitioned: true,
  //   },
  // },

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
  socialProviders: {
    google: {
      clientId: googleClientId as string,
      clientSecret: googleClientSecret as string,
    },
  },
});
