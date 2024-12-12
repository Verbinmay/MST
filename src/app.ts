import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import { blogsRouter } from "./routers/blogs-router";
import { postsRouter } from "./routers/posts-router";
import { testingRouter } from "./routers/testing-router";
import { usersRouter } from "./routers/users-router";
import { SETTINGS } from "./settings";

export const app = express();
app.use(bodyParser.json());
app.use(cors()); // разрешить любым фронтам делать запросы на наш бэк

app.get("/", (req, res) => {
  res.status(200).json({ version: "1.0" });
});

app.use(SETTINGS.PATH.TESTING, testingRouter);
app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.USERS, usersRouter);
