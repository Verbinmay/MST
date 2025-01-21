import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import { messageTextCreator } from "../helpers/messageTextCreator";
import { nodemailerService } from "../mailer/nodemailer-service";
import { SETTINGS } from "../settings";
import { ConfirmationRegistrationInputModel } from "../types/auth/ConfimationRegistrationInputModel.type";
import { UserDBModel } from "../types/users/UserDBModel.type";
import { UserInputModel } from "../types/users/UserInputModel.type";
import { usersRepository } from "../users/users-repository";
import { usersService } from "../users/users-service";

config();
export const authServices = {
  async createJWT(user: UserDBModel): Promise<string> {
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is not defined");
    }
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
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
};
