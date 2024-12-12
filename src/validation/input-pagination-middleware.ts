import { NextFunction, Request, Response } from "express";

export const inputPaginationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let searchNameTerm = fixerInputData(req.query.searchNameTerm);
  if (searchNameTerm != null) {
    req.body._pagination.searchNameTerm = searchNameTerm;
  }

  let searchLoginTerm = fixerInputData(req.query.searchLoginTerm);
  if (searchLoginTerm != null) {
    req.body._pagination.searchLoginTerm = searchLoginTerm;
  }

  let searchEmailTerm = fixerInputData(req.query.searchEmailTerm);
  if (searchEmailTerm != null) {
    req.body._pagination.searchEmailTerm = searchEmailTerm;
  }

  let sortBy =
    typeof req.query.sortBy === "string"
      ? req.query.sortBy.trim()
      : "createdAt";
  req.body._pagination.sortBy = sortBy;

  let sortDirection = req.query.sortDirection;
  if (typeof sortDirection === "string") {
    sortDirection = sortDirection.trim().toLocaleLowerCase();
    sortDirection = ["asc", "desc"].includes(sortDirection)
      ? sortDirection
      : "desc";
  } else {
    sortDirection = "desc";
  }
  req.body._pagination.sortDirection = sortDirection;

  let pageNumber = Math.round(Number(req.query.pageNumber));
  if (!isNaN(pageNumber) || pageNumber < 0) {
    pageNumber = 1;
  }
  req.body._pagination.pageNumber = pageNumber;

  let pageSize = Math.round(Number(req.query.pageSize));
  if (!isNaN(pageSize) || pageSize < 0) {
    pageSize = 10;
  }
  req.body._pagination.pageSize = pageSize;

  next();
};
function fixerInputData(searchNameTerm: any) {
  if (Array.isArray(searchNameTerm)) {
    return searchNameTerm
      .filter((term) => typeof term === "string")
      .map((term) => term.trim().toLowerCase());
  }

  if (typeof searchNameTerm === "string") {
    return searchNameTerm.trim().toLowerCase();
  }
  return null;
}
