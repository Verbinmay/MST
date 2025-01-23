import { ObjectId } from "mongodb";

export type TokenDBModel = {
  _id: ObjectId;
  token: string;
  userId: string;
  expiredAt: string;
};
