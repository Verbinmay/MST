import { InsertOneResult } from "mongodb";

import { requestsCollection } from "../db/db_mongo";
import { RequestDBModel } from "../types/requests/RequestDBModel.type";

export const requestsDBQueryRepository = {
  async saveRequest(reqDB: RequestDBModel): Promise<boolean> {
    try {
      const res: InsertOneResult<RequestDBModel> =
        await requestsCollection.insertOne(reqDB);
      if (!res.insertedId) return false;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async countSameRequests(IP: string, URL: string): Promise<number | null> {
    try {
      const tenSecondsAgo = new Date(new Date().getTime() - 1000 * 10);

      const res: number = await requestsCollection.countDocuments({
        date: {
          $gte: tenSecondsAgo,
        },
        IP,
        URL,
      });

      return res;
    } catch (e) {
      console.error(e);
      return null;
    }
  },
};
