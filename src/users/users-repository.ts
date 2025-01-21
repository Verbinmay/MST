import { InsertOneResult, ObjectId } from "mongodb";

import { usersCollection } from "../db/db_mongo";
import { UserDBModel } from "../types/users/UserDBModel.type";

export const usersRepository = {
  async createUser(dto: UserDBModel): Promise<InsertOneResult> {
    return await usersCollection.insertOne(dto);
  },

  async findUserBy_Id(_id: ObjectId): Promise<UserDBModel | null> {
    return await usersCollection.findOne({ _id });
  },

  async deleteUser(id: string): Promise<boolean> {
    const result = await usersCollection.deleteOne({ id });
    return result.deletedCount > 0;
  },

  async findByEmailOrLogin(data: string): Promise<UserDBModel | null> {
    return await usersCollection.findOne({
      $or: [{ email: data }, { login: data }],
    });
  },

  async updateUser(id: string, data: Partial<UserDBModel>): Promise<boolean> {
    const result = await usersCollection.updateOne(
      { id },
      {
        $set: data,
      }
    );
    return result.modifiedCount > 0;
  },
};
