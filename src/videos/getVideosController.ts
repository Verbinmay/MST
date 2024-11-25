import { Request, Response } from "express";

import { db } from "../db/db";
import { VideoType } from "../types/videos/Video.type";

export const getVideosController = (
  req: Request,
  res: Response<Array<VideoType>>
) => {
  const videos: Array<VideoType> = db.videos;
  res.status(200).send(videos);
};
