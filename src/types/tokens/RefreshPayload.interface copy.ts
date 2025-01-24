import { JWTPayloadInterface } from "./JWTPayload.interface";

export interface RefreshPayloadInterface extends JWTPayloadInterface {
  userId: string;
  deviceId: string;
}
