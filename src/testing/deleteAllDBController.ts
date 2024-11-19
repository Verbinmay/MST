import { Request, Response } from "express";

import { setDB } from "../db/db";

export const deleteAllDBController = (req: Request, res: Response) => {
  setDB();
  res.sendStatus(204);
};
