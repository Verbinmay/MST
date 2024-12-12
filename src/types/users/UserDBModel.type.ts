import { WithId } from "mongodb";

export type UserDBModel = WithId<{
  id: string;
  login: string;
  password: string;
  email: string;
  createdAt: string;
}>;
