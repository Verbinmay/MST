import { NextFunction, Request, Response } from "express";
import { FieldValidationError, validationResult } from "express-validator";

import { APIErrorResult } from "../types/errors/APIErrorResult.type";

export const errorValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage: APIErrorResult = {
      errorsMessages: errors.array({ onlyFirstError: true }).map((error) => {
        return {
          message: error.msg,
          field: (error as FieldValidationError).path,
        };
      }),
    };
    res.status(400).json(errorMessage);
    return;
  }

  next();
};
