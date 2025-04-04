import { createHash } from "crypto";
import { LogInWithUsernameAndPasswordError, SignUpWithUsernameAndPasswordError, } from "./authentication-types.js";
import { prisma } from "../../extras/prisma.js";
//import jwt from "jsonwebtoken";
import * as jwt from "jsonwebtoken";
import { jwtSecretKey } from "../../environment.js";
export const createPasswordHash = (parameters) => {
    return createHash("sha256").update(parameters.password).digest("hex");
};
const createJWToken = (parameters) => {
    const jwtPayload = {
        iss: "https://purpleshorts.co.in",
        sub: parameters.id,
        username: parameters.username,
    };
    const token = jwt.sign(jwtPayload, jwtSecretKey, {
        expiresIn: "30d",
    });
    return token;
};
export const signUpWithUsernameAndPassword = async (parameters) => {
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
        const jwtPayload = {
            iss: "http://purpleshorts.co.in",
            sub: user.id,
            username: user.username,
        };
        const token = jwt.sign(jwtPayload, jwtSecretKey, {
            expiresIn: "30d",
        });
        const result = {
            token,
            user,
        };
        return result;
    }
    catch (e) {
        console.error(e);
        throw SignUpWithUsernameAndPasswordError.UNKNOWN;
    }
};
export const logInWithUsernameAndPassword = async (parameters) => {
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
    const result = {
        token,
        user,
    };
    return result;
};
