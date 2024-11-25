import { UpdateVideoInputModel } from "./UpdateVideoInputModel.type";

export type VideoType = UpdateVideoInputModel & {
  createdAt: string;
  id: number;
};
