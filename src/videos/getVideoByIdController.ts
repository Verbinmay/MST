import { Request, Response } from "express";

import { db } from "../db/db";
import { ParamType } from "../types/types";
import { VideoType } from "../types/videos/Video.type";

export const getVideoByIdController = (
  req: Request<ParamType>,
  res: Response
) => {
  const videos: Array<VideoType> = db.videos;
  const idParam: string | undefined = req.params?.id;
  if (idParam) {
    const video: VideoType | undefined = videos.find(
      (video: VideoType) => video.id === parseInt(idParam, 10)
    );

    if (video) {
      res.status(200).send(video);
      return;
    }
  }
  res.sendStatus(404);
};
