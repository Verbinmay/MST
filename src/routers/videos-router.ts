import { Router } from "express";

import { createVideoController } from "../videos/createVideoController";
import { getVideoByIdController } from "../videos/getVideoByIdController";
import { getVideosController } from "../videos/getVideosController";
import { updateVideoByIdController } from "../videos/updateVideoByIdController";

export const videosRouter = Router();

videosRouter.get("/", getVideosController);
videosRouter.get("/:id", getVideoByIdController);
videosRouter.put("/:id", updateVideoByIdController);
videosRouter.delete("/:id", updateVideoByIdController);
videosRouter.post("/", createVideoController);
