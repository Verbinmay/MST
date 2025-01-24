import { createAPIDTO } from "../helpers/createAPIDTO";
import { readAPIDTO } from "../helpers/readAPIDTO";
import { viewModelCreator } from "../helpers/viewModelCreator";
import { APIDTO } from "../types/APIDTO.type";
import { SessionDBModel } from "../types/sessions/SessionDBModel.type";
import { SessionViewModel } from "../types/sessions/SessionViewModel.type";
import { UserDBModel } from "../types/users/UserDBModel.type";
import { securityService } from "./security-service";

export const securityMapper = {
  async getAllSessions(
    user: UserDBModel
  ): Promise<APIDTO<SessionViewModel[] | null>> {
    try {
      const sessions: SessionDBModel[] | null = readAPIDTO(
        await securityService.getAllSessions(user.id)
      ) as SessionDBModel[];

      const viewModelSessions: SessionViewModel[] = sessions.map((session) => {
        return viewModelCreator.sessionViewModel(session);
      });
      return createAPIDTO(viewModelSessions);
    } catch (e) {
      console.error(e);
      return createAPIDTO(null, e);
    }
  },
};
