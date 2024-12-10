import { NextFunction, Request, Response } from "express";

export const queryBlogIdTransferMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let blogId = req.query.blogId;
  if (typeof blogId === "string") {
    blogId = blogId.trim();
    req.body.blogId = blogId;
  }
  next();
};
