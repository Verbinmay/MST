import { ObjectId } from "mongodb";

export type RequestDBModel = {
  _id: ObjectId;
  token: string;
  userId: string;
  expiredAt: string;
};
