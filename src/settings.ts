import { config } from "dotenv";

config();

export const SETTINGS = {
  PORT: process.env.PORT ?? 3003,
  PATH: {
    TESTING: "/testing",
    BLOGS: "/blogs",
    POSTS: "/posts",
    USERS: "/users",
    AUTH: "/auth",
    SECURITYDEV: "/security/devices",
  },
  MES_TYPES: {
    EMAIL_CONFIRMATION: "emailConfirmation",
  },
};

export const ERRORMESSAGES = {};
