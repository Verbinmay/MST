import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import { messageTextCreator } from "../helpers/messageTextCreator";
import { nodemailerService } from "../mailer/nodemailer-service";
import { SETTINGS } from "../settings";
import { ConfirmationRegistrationInputModel } from "../types/auth/ConfimationRegistrationInputModel.type";
import { TokenDBModel } from "../types/tokens/TokenDBModel.type";
import { UserDBModel } from "../types/users/UserDBModel.type";
import { UserInputModel } from "../types/users/UserInputModel.type";
import { usersRepository } from "../users/users-repository";
import { usersService } from "../users/users-service";
import { authRepository } from "./auth-repository";

config();
export const authServices = {
  async createJWT(user: UserDBModel, time: string = "1h"): Promise<string> {
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is not defined");
    }
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: time,
    });
  },

  async verifyJWT(token: string): Promise<UserDBModel | null> {
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is not defined");
    }
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      ) as jwt.JwtPayload;
      const user_id = new ObjectId(decoded.userId as string);
      const user: UserDBModel | null = await usersService.findUserBy_Id(
        user_id
      );
      return user;
    } catch (error) {
      return null;
    }
  },

  async verifyRefreshTokenAndAddInBlock(refreshToken: string) {
    try {
      if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not defined");
      }

      const decode = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET_KEY
      ) as jwt.JwtPayload;
      const { userId, exp } = decode;

      const isExpired: TokenDBModel | null =
        await authRepository.findTokenWithUserId(refreshToken, userId);
      if (isExpired) return null;

      const oldRefreshToken: TokenDBModel = {
        token: refreshToken,
        userId: userId as string,
        expiredAt: new Date((exp as number) * 1000).toISOString(),
        _id: new ObjectId(),
      };
      const savedTokenResult = await authRepository.saveToken(oldRefreshToken);
      if (!savedTokenResult.insertedId) return null;

      const user: UserDBModel | null = await usersService.findUserBy_Id(
        new ObjectId(userId)
      );
      if (!user) return null;
      return user;
    } catch (error) {
      return null;
    }
  },
  async registration(dto: UserInputModel): Promise<UserDBModel | null> {
    const user: UserDBModel | null = await usersService.createUser(dto);
    if (!user) return null;

    const code: string = await this.createJWT(user);
    const text: string =
      messageTextCreator.createEmailConfirmationMessage(code);

    const resultOfSending: boolean = await nodemailerService.sendMail(
      user.email,
      text,
      {
        userId: user.id,
        type: SETTINGS.MES_TYPES.EMAIL_CONFIRMATION,
        data: { code },
      }
    );

    if (!resultOfSending) {
      await usersService.deleteUser(user.id);
      return null;
    }

    return user;
  },

  async confirmRegistration(
    dto: ConfirmationRegistrationInputModel
  ): Promise<boolean> {
    const user: UserDBModel | null = await authServices.verifyJWT(dto.code);
    if (!user) return false;
    user.isConfirmed = true;
    const isConfirmed = await usersRepository.updateUser(user.id, {
      isConfirmed: true,
    });
    return isConfirmed;
  },

  async refreshTokens(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const user: UserDBModel | null =
        await this.verifyRefreshTokenAndAddInBlock(refreshToken);
      if (!user) return null;
      const newPairOfTokens = {
        accessToken: await this.createJWT(user, "10s"),
        refreshToken: await this.createJWT(user, "20s"),
      };
      return newPairOfTokens;
    } catch (error) {
      return null;
    }
  },
  // async checkRefreshToken(refreshToken: string): Promise<UserDBModel | null> {
  //   const user: UserDBModel | null = await this.verifyJWT(refreshToken);
  //   if (!user) return null;
  //   const isExpired: TokenDBModel | null =
  //     await authRepository.findTokenWithUserId(refreshToken, user.id);

  //   if (!isExpired) return user;
  //   return null;
  // },
};
