import { WithId } from "mongodb";

export type BlogDBModel = WithId<{
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt?: string;
  isMembership?: boolean;
}>;
