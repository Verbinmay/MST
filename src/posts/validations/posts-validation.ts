import { body, query, ValidationChain } from "express-validator";

import { blogsRepository } from "../../blogs/blogs-repository";

export const postTitleValidation = body("title")
  .trim()
  .notEmpty()
  .escape()
  .isString()
  .isLength({ max: 30 });

export const postShortDescriptionValidation = body("shortDescription")
  .trim()
  .notEmpty()
  .escape()
  .isString()
  .isLength({ max: 100 });
export const postContentValidation = body("content")
  .trim()
  .notEmpty()
  .escape()
  .isString()
  .isLength({ max: 1000 });

export const postBlogIdValidation = (
  location: "body" | "query"
): ValidationChain => {
  const loc = location === "body" ? body("blogId") : query("blogId");
  return loc.custom(async (value) => {
    if ((await blogsRepository.findBlogById(value)) === null)
      throw new Error("Blog not found");
  });
};
