import { APIErrorResult } from "../types/errors/APIErrorResult.type";


export const errorPusher = (
  errors: APIErrorResult,
  message: string,
  field: string
): void => {
  errors.errorsMessages.push({
    message,
    field,
  });
};
