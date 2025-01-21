import { SETTINGS } from "../../settings";

export type MessageType =
  (typeof SETTINGS.MES_TYPES)[keyof typeof SETTINGS.MES_TYPES];
