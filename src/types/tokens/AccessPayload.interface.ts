import { JWTPayloadInterface } from "./JWTPayload.interface";

export interface AccessPayloadInterface extends JWTPayloadInterface {
  userId: string;
}
