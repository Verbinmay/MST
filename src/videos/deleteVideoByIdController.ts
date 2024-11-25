import { Request, Response } from "express";

import { db } from "../db/db";
import { ParamType } from "../types/types";
import { VideoType } from "../types/videos/Video.type";

export const deleteVideoByIdController = (
  req: Request<ParamType>,
  res: Response
) => {
  const videos: Array<VideoType> = db.videos;
  const idParam: string | undefined = req.params?.id;
  if (idParam) {
    const videoIndex: number = videos.findIndex(
      (video: VideoType) => video.id === parseInt(idParam, 10)
    );

    if (videoIndex !== -1) {
      videos.splice(videoIndex, 1);
      res.sendStatus(204);
      return;
    }
    res.sendStatus(404);
  }
};
