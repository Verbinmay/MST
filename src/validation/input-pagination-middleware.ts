import { NextFunction, Request, Response } from "express";

export const inputPaginationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let searchNameTerm = req.query.searchNameTerm ?? null;
  if (Array.isArray(searchNameTerm)) {
    searchNameTerm = searchNameTerm
      .filter((term) => typeof term === "string")
      .map((term) => term.trim().toLowerCase());
  }

  if (searchNameTerm === null) {
    searchNameTerm = "";
  }

  if (typeof searchNameTerm === "string") {
    searchNameTerm = searchNameTerm.trim().toLowerCase();
  }

  let sortBy =
    typeof req.query.sortBy === "string"
      ? req.query.sortBy.trim()
      : "createdAt";

  let sortDirection = req.query.sortDirection;
  if (typeof sortDirection === "string") {
    sortDirection = sortDirection.trim().toLocaleLowerCase();
    sortDirection = ["asc", "desc"].includes(sortDirection)
      ? sortDirection
      : "desc";
  } else {
    sortDirection = "desc";
  }

  let pageNumber = Math.round(Number(req.query.pageNumber));
  if (!isNaN(pageNumber) || pageNumber < 0) {
    pageNumber = 1;
  }

  let pageSize = Math.round(Number(req.query.pageSize));
  if (!isNaN(pageSize) || pageSize < 0) {
    pageSize = 10;
  }

  req.body._pagination = {
    searchNameTerm,
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
  };
  next();
};
