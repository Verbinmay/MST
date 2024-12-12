import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";

import { usersRepository } from "../users-repository";

export const userLoginValidation = body("login")
  .trim()
  .notEmpty()
  .escape()
  .isString()
  .isLength({ min: 3, max: 10 });

export const userPasswordValidation = body("password")
  .trim()
  .notEmpty()
  .escape()
  .isString()
  .isLength({ min: 6, max: 20 });
export const userEmailValidation = body("email")
  .trim()
  .notEmpty()
  .escape()
  .isEmail();

export const loginAndEmailUniqueValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((await usersRepository.findByEmailOrLogin(req.body.login)) !== null) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "not unique",
          field: "login",
        },
      ],
    });
    return;
  }

  if ((await usersRepository.findByEmailOrLogin(req.body.email)) !== null) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "not unique",
          field: "email",
        },
      ],
    });
    return;
  }
  next();
};
