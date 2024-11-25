import { Request, Response } from "express";

import { db } from "../db/db";
import { errorPusher } from "../helpers/errorPusher";
import { APIErrorResult } from "../types/errors/APIErrorResult.type";
import { CreateVideoInputModel } from "../types/videos/CreateVideoInputModel.type";
import { ResolutionsEnum } from "../types/videos/Resolution.type";
import { VideoType } from "../types/videos/Video.type";

export const inputCreateVideoValidation = (
  dto: CreateVideoInputModel
): APIErrorResult => {
  const errors: APIErrorResult = {
    errorsMessages: [],
  };

  const checkerAuthor: boolean =
    typeof dto.author === "string" &&
    dto.author.length > 0 &&
    dto.author.length <= 20;

  !checkerAuthor && errorPusher(errors, "Author is required", "author");

  const checkerTitle: boolean =
    typeof dto.title === "string" &&
    dto.title.length > 0 &&
    dto.title.length <= 40;

  !checkerTitle && errorPusher(errors, "Title is required", "title");

  const checkerAvailableResolutions: boolean =
    (Array.isArray(dto.availableResolutions) &&
      dto.availableResolutions.length > 0 &&
      dto.availableResolutions.every(
        (resolution) => resolution === ResolutionsEnum[resolution]
      )) ||
    dto.availableResolutions === null;

  !checkerAvailableResolutions &&
    errorPusher(
      errors,
      "Available resolution is required",
      "availableResolution"
    );

  return errors;
};

export const createVideoController = (
  req: Request<any, any, CreateVideoInputModel>,
  res: Response<VideoType | APIErrorResult>
) => {
  const errors: APIErrorResult = inputCreateVideoValidation(req.body);

  if (errors.errorsMessages.length > 0) {
    console.log(errors);
    res.status(400).json(errors);
    return;
  }

  const newVideo: VideoType = {
    ...req.body,
    id: Date.now() + Math.random(),
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
  console.log(newVideo);
  db.videos = [...db.videos, newVideo];
  console.log(db.videos);
  res.status(201).json(newVideo);
};
