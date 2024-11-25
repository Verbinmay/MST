import { Request, Response } from "express";

import { db } from "../db/db";
import { errorPusher } from "../helpers/errorPusher";
import { APIErrorResult } from "../types/errors/APIErrorResult.type";
import { ParamType } from "../types/types";
import { UpdateVideoInputModel } from "../types/videos/UpdateVideoInputModel.type";
import { VideoType } from "../types/videos/Video.type";
import { inputCreateVideoValidation } from "./createVideoController";

const inputUpdateVideoValidation = (
  dto: UpdateVideoInputModel
): APIErrorResult => {
  const errors: APIErrorResult = {
    errorsMessages: [],
  };

  const checkerOfFirstPart: APIErrorResult = inputCreateVideoValidation(dto);

  if (checkerOfFirstPart.errorsMessages.length > 0) {
    errors.errorsMessages.push(...checkerOfFirstPart.errorsMessages);
  }

  const checkerCanBeDownloaded: boolean =
    typeof dto.canBeDownloaded === "boolean" ||
    dto.canBeDownloaded === undefined;

  !checkerCanBeDownloaded &&
    errorPusher(errors, "Not that type", "canBeDownloaded");

  const checkerMinAgeRestriction: boolean =
    (typeof dto.minAgeRestriction === "number" &&
      dto.minAgeRestriction >= 1 &&
      dto.minAgeRestriction <= 18) ||
    dto.minAgeRestriction === undefined;

  !checkerMinAgeRestriction &&
    errorPusher(errors, "Something wrong", "minAgeRestriction");

  const checkerPublicationDate: boolean =
    typeof dto.publicationDate === "string" ||
    dto.publicationDate === undefined;

  !checkerPublicationDate &&
    errorPusher(errors, "Something wrong", "publicationDate");

  return errors;
};

export const updateVideoByIdController = (
  req: Request<ParamType, any, UpdateVideoInputModel>,
  res: Response
) => {
  const errors: APIErrorResult = inputUpdateVideoValidation(req.body);
  if (errors.errorsMessages.length > 0) {
    res.status(400).send(errors);
    return;
  }

  const videos: Array<VideoType> = db.videos;
  const idParam: string | undefined = req.params?.id;
  if (idParam) {
    const videoIndex: number = videos.findIndex(
      (video: VideoType) => video.id === parseInt(idParam, 10)
    );

    if (videoIndex !== -1) {
      videos[videoIndex] = {
        ...videos[videoIndex],
        ...req.body,
      };

      res.sendStatus(204);
      return;
    }
    res.sendStatus(404);
  }
};
