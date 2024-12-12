import { randomUUID } from "crypto";
import { InsertOneResult } from "mongodb";

import { UserDBModel } from "../types/users/UserDBModel.type";
import { UserInputModel } from "../types/users/UserInputModel.type";
import { usersRepository } from "./users-repository";

export const usersService = {
  async createUser(dto: UserInputModel): Promise<UserDBModel | null> {
    const userDto = {
      ...dto,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const user: InsertOneResult = await usersRepository.createUser(userDto);
    const createdUser: UserDBModel | null = await usersRepository.findUserBy_Id(
      user.insertedId
    );
    return createdUser;
  },

  async deleteUser(id: string): Promise<boolean> {
    const isDeleted: boolean = await usersRepository.deleteUser(id);
    return isDeleted;
  },
};
