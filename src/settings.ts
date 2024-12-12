import { config } from "dotenv";

config();

export const SETTINGS = {
  PORT: process.env.PORT ?? 3003,
  PATH: {
    TESTING: "/testing",
    BLOGS: "/blogs",
    POSTS: "/posts",
    USERS: "/users",
  },
};

export const ERRORMESSAGES = {};
