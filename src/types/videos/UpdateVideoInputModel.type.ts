import { CreateVideoInputModel } from "./CreateVideoInputModel.type";

export type UpdateVideoInputModel = CreateVideoInputModel & {
  /** By default - false */
  canBeDownloaded?: boolean;
  /** maximum: 18, minimum: 1 */
  minAgeRestriction?: number | null;
  publicationDate?: string;
};
