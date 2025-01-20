import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { InsertOneResult, ObjectId } from "mongodb";

import { LoginInputModel } from "../types/auth/LoginInputModel.type";
import { UserDBModel } from "../types/users/UserDBModel.type";
import { UserInputModel } from "../types/users/UserInputModel.type";
import { usersRepository } from "./users-repository";

export const usersService = {
  async createUser(dto: UserInputModel): Promise<UserDBModel | null> {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(dto.password, salt);
    const userDto: UserDBModel = {
      ...dto,
      _id: new ObjectId(),
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      password,
      salt,
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
  async compareUserInfo(dto: LoginInputModel): Promise<UserDBModel | null> {
    console.log("dto", dto);
    const user: UserDBModel | null = await usersRepository.findByEmailOrLogin(
      dto.loginOrEmail
    );

    if (!user) {
      console.log("User not found");
      return null;
    }
    const pass = await bcrypt.hash(dto.password, user.salt);
    console.log("pass", pass);
    const check: boolean = pass === user.password;
    return check ? user : null;
  },
  async findUserBy_Id(_id: ObjectId): Promise<UserDBModel | null> {
    const user: UserDBModel | null = await usersRepository.findUserBy_Id(_id);
    return user;
  },
};
