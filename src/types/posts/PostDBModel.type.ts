import { WithId } from "mongodb";

export type PostDBModel = WithId<{
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt?: string;
}>;
