import { ObjectId } from "mongodb";

export type SessionDBModel = {
  _id: ObjectId;
  userId: ObjectId;
  deviceId: string;
  iat: Date;
  deviceName: string;
  ip: string;
  exp: Date;
};
