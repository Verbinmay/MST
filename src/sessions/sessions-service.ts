import { ObjectId } from "mongodb";

import { createAPIDTO } from "../helpers/createAPIDTO";
import { APIDTO } from "../types/APIDTO.type";
import { SessionDBModel } from "../types/sessions/SessionDBModel.type";
import { sessionsRepository } from "./sessions-repository";

export const sessionsService = {
  async createSession(dto: {
    userId: ObjectId;
    deviceName: string;
    deviceId: string;
    ip: string;
    iat: Date;
    exp: Date;
  }): Promise<APIDTO<boolean>> {
    try {
      const session: SessionDBModel = {
        _id: new ObjectId(),
        ...dto,
      };
      const isCreated: boolean = await sessionsRepository.saveSession(session);
      return createAPIDTO(isCreated);
    } catch (e) {
      console.error(e);
      return createAPIDTO(false, e);
    }
  },
};
