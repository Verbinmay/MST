import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import { testingRouter } from "./routers/testing-router";
import { videosRouter } from "./routers/videos-router";
import { SETTINGS } from "./settings";

export const app = express();
app.use(bodyParser.json());
app.use(cors()); // разрешить любым фронтам делать запросы на наш бэк

app.get("/", (req, res) => {
  res.status(200).json({ version: "1.0" });
});

app.use(SETTINGS.PATH.VIDEOS, videosRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);
