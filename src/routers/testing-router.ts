import { Router } from "express";

import { deleteAllDBController } from "../testing/deleteAllDBController";

export const testingRouter = Router();

testingRouter.delete("/all-data", deleteAllDBController);
