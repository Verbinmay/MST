import { ObjectId } from "mongodb";

export type RequestDBModel = {
  _id: ObjectId;
  IP: string;
  URL: string;
  date: Date;
};
