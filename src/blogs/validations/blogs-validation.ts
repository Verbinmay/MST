import { body } from "express-validator";

export const blogNameValidation = body("name")
  .trim()
  .notEmpty()
  .escape()
  .isString()
  .isLength({ max: 15 });

export const blogDescriptionValidation = body("description")
  .trim()
  .notEmpty()
  .escape()
  .isString()
  .isLength({ max: 500 });

export const blogWebsiteUrlValidation = body("websiteUrl")
  .trim()
  .notEmpty()
  .escape()
  .isURL()
  .isLength({ max: 100 });
