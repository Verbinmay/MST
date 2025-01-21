import { body } from "express-validator";

export const loginOrEmailValidation = body("loginOrEmail")
  .trim()
  .notEmpty()
  .escape()
  .isString();

export const passwordValidation = body("password")
  .trim()
  .notEmpty()
  .escape()
  .isString();

export const codeValidation = body("code")
  .trim()
  .notEmpty()
  .escape()
  .isString();
