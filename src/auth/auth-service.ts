import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import { UserDBModel } from "../types/users/UserDBModel.type";
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
};
