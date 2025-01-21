import { ObjectId } from "mongodb";

export type UserDBModel = {
  _id: ObjectId;
  id: string;
  login: string;
  salt: string;
  password: string;
  email: string;
  createdAt: string;
  isConfirmed: boolean;
};
