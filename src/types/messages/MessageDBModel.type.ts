import { ObjectId } from "mongodb";

import { MessageType } from "../auth/Message.type";

export type MessageDBModel = {
  _id: ObjectId;
  id: string;
  userId: string;
  createAt: string;
  type: MessageType;
  data: {
    code?: string;
  };
};
