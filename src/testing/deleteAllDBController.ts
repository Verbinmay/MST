import { Request, Response } from "express";

import { blogsCollection, postsCollection } from "../db/db_mongo";

export const deleteAllDBController = async (req: Request, res: Response) => {
  await blogsCollection.deleteMany({});
  await postsCollection.deleteMany({});
  res.sendStatus(204);
};
