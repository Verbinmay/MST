import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import { createAPIDTO } from "../helpers/createAPIDTO";
import { messageTextCreator } from "../helpers/messageTextCreator";
import { readAPIDTO } from "../helpers/readAPIDTO";
import { nodemailerService } from "../mailer/nodemailer-service";
import { sessionsRepository } from "../sessions/sessions-repository";
import { SETTINGS } from "../settings";
import { APIDTO } from "../types/APIDTO.type";
import { ConfirmationRegistrationInputModel } from "../types/auth/ConfimationRegistrationInputModel.type";
import { SessionDBModel } from "../types/sessions/SessionDBModel.type";
import { AccessPayloadInterface } from "../types/tokens/AccessPayload.interface";
import { RefreshPayloadInterface } from "../types/tokens/RefreshPayload.interface copy";
import { UserDBModel } from "../types/users/UserDBModel.type";
import { UserInputModel } from "../types/users/UserInputModel.type";
import { usersRepository } from "../users/users-repository";
import { usersService } from "../users/users-service";

config();
export const authService = {
  async createJWT(
    payload: object,
    time: string = "1h"
  ): Promise<APIDTO<string | null>> {
    try {
      if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not defined");
      }
      return createAPIDTO(
        jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: time,
        })
      );
    } catch (e) {
      console.error(e);
      return createAPIDTO(null, `Create JWT: ${payload}`);
    }
  },

  async verifyJWT(token: string): Promise<APIDTO<jwt.JwtPayload | null>> {
    try {
      if (!process.env.JWT_SECRET_KEY) {
        throw new Error();
      }
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      ) as jwt.JwtPayload;

      return createAPIDTO(decoded);
    } catch (e) {
      console.error(e);
      return createAPIDTO(null, e);
    }
  },

  async verifyAccessToken(
    token: string
  ): Promise<
    APIDTO<{ user: UserDBModel; payload: AccessPayloadInterface } | null>
  > {
    try {
      const payload = readAPIDTO(
        await this.verifyJWT(token)
      ) as AccessPayloadInterface;

      const user_id = new ObjectId(payload.userId);
      const user: UserDBModel | null = await usersService.findUserBy_Id(
        user_id
      );
      if (!user) return createAPIDTO(null, "User not found");

      return createAPIDTO({ user, payload });
    } catch (e) {
      return createAPIDTO(null, e);
    }
  },

  async verifyRefreshToken(token: string): Promise<
    APIDTO<{
      user: UserDBModel;
      session: SessionDBModel;
      payload: RefreshPayloadInterface;
    } | null>
  > {
    try {
      const payload = readAPIDTO(
        await this.verifyJWT(token)
      ) as RefreshPayloadInterface;

      const user_id = new ObjectId(payload.userId);
      const user: UserDBModel | null = await usersService.findUserBy_Id(
        user_id
      );
      if (!user) return createAPIDTO(null, "User not found");

      const session: SessionDBModel | null =
        await sessionsRepository.findSessionByDeviceId(payload.deviceId);
      if (!session) return createAPIDTO(null, "Session not found");

      if (
        !payload.iat ||
        session.iat.getTime() !== new Date(payload.iat * 1000).getTime()
      )
        return createAPIDTO(null, "Session is not valid");

      return createAPIDTO({
        user,
        session,
        payload,
      });
    } catch (e) {
      return createAPIDTO(null, e);
    }
  },

  async registration(dto: UserInputModel): Promise<APIDTO<boolean>> {
    const user: UserDBModel | null = await usersService.createUser(dto);
    if (!user) return createAPIDTO(false, "User not created");

    const code = readAPIDTO(
      await this.createJWT({ userId: user._id })
    ) as string;

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
      return createAPIDTO(false, "Email not sent");
    }

    return createAPIDTO(true);
  },

  async confirmRegistration(
    dto: ConfirmationRegistrationInputModel
  ): Promise<APIDTO<boolean>> {
    try {
      const resultOfVerification = readAPIDTO(
        await authService.verifyAccessToken(dto.code)
      ) as {
        user: UserDBModel;
        payload: AccessPayloadInterface;
      };

      const isConfirmed = await usersRepository.updateUser(
        resultOfVerification.user.id,
        {
          ...resultOfVerification.user,
          isConfirmed: true,
        }
      );
      return createAPIDTO(isConfirmed);
    } catch (e) {
      return createAPIDTO(false, e);
    }
  },

  async refreshTokens(
    oldRefreshToken: string
  ): Promise<APIDTO<{ accessToken: string; refreshToken: string } | null>> {
    try {
      const resultOfVerification = readAPIDTO(
        await this.verifyRefreshToken(oldRefreshToken)
      ) as {
        user: UserDBModel;
        session: SessionDBModel;
        payload: RefreshPayloadInterface;
      };
      const { accessToken, refreshToken } = readAPIDTO(
        await this.makeAccessAndRefreshTokens(
          resultOfVerification.user._id,
          resultOfVerification.payload.deviceId
        )
      ) as {
        accessToken: string;
        refreshToken: string;
      };

      const payload = readAPIDTO(
        await this.verifyJWT(refreshToken)
      ) as RefreshPayloadInterface;

      const isSessionUpdated = await sessionsRepository.updateSession({
        ...resultOfVerification.session,
        exp: new Date(payload.exp!),
        iat: new Date(payload.iat!),
      });

      if (!isSessionUpdated)
        return createAPIDTO(null, "Session is not updated");

      return createAPIDTO({ accessToken, refreshToken });
    } catch (error) {
      return createAPIDTO(null, error);
    }
  },

  async makeAccessAndRefreshTokens(
    userId: string | ObjectId,
    deviceId: string
  ): Promise<APIDTO<{ accessToken: string; refreshToken: string } | null>> {
    try {
      const accessToken = readAPIDTO(
        await this.createJWT({ userId }, "10s")
      ) as string;
      const refreshToken = readAPIDTO(
        await this.createJWT(
          {
            userId,
            deviceId,
          },
          "20s"
        )
      ) as string;
      return createAPIDTO({ accessToken, refreshToken });
    } catch (error) {
      return createAPIDTO(null, error);
    }
  },

  async logout(refreshToken: string): Promise<APIDTO<boolean>> {
    try {
      const resultOfVerification = readAPIDTO(
        await this.verifyRefreshToken(refreshToken)
      ) as {
        user: UserDBModel;
        session: SessionDBModel;
        payload: RefreshPayloadInterface;
      };

      const isSessionDeleted = await sessionsRepository.deleteSessionByDeviceId(
        resultOfVerification.payload.deviceId
      );

      return createAPIDTO(isSessionDeleted);
    } catch (error) {
      return createAPIDTO(false, error);
    }
  },
};
