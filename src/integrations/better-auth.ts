import { betterAuth } from "better-auth";

import { prismaAdapter } from "better-auth/adapters/prisma";

import { betterAuthSecret, serverUrl, webClientUrl } from "../environment.js";
import { username } from "better-auth/plugins";
import { prismaClient } from "./prisma/index.js";

// serverUrl
// webClientUrl

const betterAuthServerClient = betterAuth({
  baseURL: serverUrl,
  trustedOrigins: [webClientUrl],
  secret: betterAuthSecret,
  database: prismaAdapter(prismaClient, {
    provider: "postgresql",
  }),
  user: {
    modelName: "User",
  },
  session: {
    modelName: "Session",
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
  plugins: [username()],
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      partitioned: true,
    },
  },
});

export default betterAuthServerClient;