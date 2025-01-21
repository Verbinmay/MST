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
      isConfirmed: false,
    };
    const user: InsertOneResult = await usersRepository.createUser(userDto);
    const createdUser: UserDBModel | null = await usersRepository.findUserBy_Id(
      user.insertedId
    );
    return createdUser;
  },

  async createUserLikeAdmin(dto: UserInputModel): Promise<UserDBModel | null> {
    const user: UserDBModel | null = await this.createUser(dto);
    if (!user) return null;

    const isConfirmed = await usersRepository.updateUser(user.id, {
      isConfirmed: true,
    });

    if (!isConfirmed) {
      await this.deleteUser(user.id);
      return null;
    }

    return { ...user, isConfirmed: true };
  },

  async deleteUser(id: string): Promise<boolean> {
    const isDeleted: boolean = await usersRepository.deleteUser(id);
    return isDeleted;
  },
  async compareUserInfo(dto: LoginInputModel): Promise<UserDBModel | null> {
    const user: UserDBModel | null = await usersRepository.findByEmailOrLogin(
      dto.loginOrEmail
    );

    if (!user) {
      console.log("User not found");
      return null;
    }
    const pass = await bcrypt.hash(dto.password, user.salt);
    const check: boolean = pass === user.password;
    return check ? user : null;
  },
  async findUserBy_Id(_id: ObjectId): Promise<UserDBModel | null> {
    const user: UserDBModel | null = await usersRepository.findUserBy_Id(_id);
    return user;
  },


};
