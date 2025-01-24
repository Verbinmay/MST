import { sessionsCollection } from "../db/db_mongo";
import { SessionDBModel } from "../types/sessions/SessionDBModel.type";

export const sessionsRepository = {
  async saveSession(session: SessionDBModel) {
    try {
      const result = await sessionsCollection.insertOne(session);
      if (!result.insertedId) return false;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async updateSession(session: SessionDBModel) {
    try {
      const result = await sessionsCollection.updateOne(
        { _id: session._id },
        { $set: session }
      );
      return result.modifiedCount > 0;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async findSessionByDeviceId(
    deviceId: string
  ): Promise<SessionDBModel | null> {
    try {
      const session: SessionDBModel | null = await sessionsCollection.findOne({
        deviceId,
      });
      return session;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async deleteSessionByDeviceId(deviceId: string): Promise<boolean> {
    try {
      const result = await sessionsCollection.deleteOne({
        deviceId,
      });
      return result.deletedCount > 0;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async findAllUserSessions(userId: string): Promise<SessionDBModel[] | null> {
    try {
      const sessions: SessionDBModel[] = await sessionsCollection
        .find({ id: userId })
        .toArray();
      return sessions;
    } catch (e) {
      console.error(e);
      return null;
    }
  },
};
