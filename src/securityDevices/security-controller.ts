import { Request, Response } from "express";

import { readAPIDTO } from "../helpers/readAPIDTO";
import { securityMapper } from "./security-mapper";

export const securityController = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const sessions = readAPIDTO(await securityMapper.getAllSessions(user.id));
    res.status(200).send(sessions);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};
