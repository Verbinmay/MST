import { MessageType } from "../auth/Message.type";

export type MessageInputModel = {
  userId: string;
  type: MessageType;
  data: {
    code?: string;
  };
};
