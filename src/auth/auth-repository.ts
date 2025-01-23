import { InsertOneResult } from "mongodb";

import { tokensCollection } from "../db/db_mongo";
import { TokenDBModel } from "../types/tokens/TokenDBModel.type";

export const authRepository = {
  async findTokenWithUserId(
    token: string,
    userId: string
  ): Promise<TokenDBModel | null> {
    return await tokensCollection.findOne({ token, userId });
  },

  async saveToken(token: TokenDBModel): Promise<InsertOneResult<TokenDBModel>> {
    return await tokensCollection.insertOne(token);
  },

  async deleteExpiredTokens(): Promise<boolean> {
    const deleteResult = await tokensCollection.deleteMany({
      expiredAt: { $lt: new Date().toISOString() },
    });
    return deleteResult.deletedCount > 0;
  },
};
