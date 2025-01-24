import { createAPIDTO } from "../helpers/createAPIDTO";
import { sessionsRepository } from "../sessions/sessions-repository";
import { APIDTO } from "../types/APIDTO.type";
import { SessionDBModel } from "../types/sessions/SessionDBModel.type";

export const securityService = {
  async getAllSessions(
    userId: string
  ): Promise<APIDTO<SessionDBModel[] | null>> {
    try {
      const sessions: SessionDBModel[] | null =
        await sessionsRepository.findAllUserSessions(userId);
      if (!sessions) return createAPIDTO(null, "No sessions found");
      return createAPIDTO(sessions);
    } catch (e) {
      console.error(e);
      return createAPIDTO(null, e);
    }
  },
};
