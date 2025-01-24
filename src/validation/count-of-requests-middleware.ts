import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";

import { requestsDBQueryRepository } from "../requestsDB/requestsDB-query-repository";
import { RequestDBModel } from "../types/requests/RequestDBModel.type";

export const countOfRequestsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const url = req.url;
  const date = new Date();
  const dto: RequestDBModel = {
    _id: new ObjectId(),
    IP: ip as string,
    URL: url,
    date,
  };

  const countOfRequests: number | null =
    await requestsDBQueryRepository.countSameRequests(dto.IP, dto.URL);
  console.log(countOfRequests);

  if (countOfRequests === null) {
    res.status(500).send("Internal server error");
    return;
  }

  if (countOfRequests >= 5) {
    res.status(429).send("Too many requests");
    return;
  }

  await requestsDBQueryRepository.saveRequest(dto);
  next();
};
