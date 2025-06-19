"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.betterAuthClient = void 0;
const better_auth_1 = require("better-auth");
const environment_1 = require("../../utils/environment");
const prisma_1 = require("better-auth/adapters/prisma");
const prisma_2 = require("../prisma");
exports.betterAuthClient = (0, better_auth_1.betterAuth)({
    baseURL: environment_1.serverUrl,
    basePath: "/authentication",
    secret: environment_1.betterAuthSecret,
    database: (0, prisma_1.prismaAdapter)(prisma_2.prismaClient, {
        provider: "postgresql",
    }),
    trustedOrigins: [environment_1.serverUrl, environment_1.webClientUrl],
    // advanced: {
    //   crossSubDomainCookies: {
    //     enabled: true,
    //     domain: "insight360.info",
    //   },
    // },
    advanced: {
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
            partitioned: true,
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
