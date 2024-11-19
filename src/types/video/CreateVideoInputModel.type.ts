import { ResolutionType } from "./Resolution.type";

export type CreateVideoInputModel = {
  /** maxLength: 40 */
  title: string;
  /** maxLength: 20 */
  author: string;
  /** [ P144, P240, P360, P480, P720, P1080, P1440, P2160 ] */
  availableResolutions?: ResolutionType | null;
};
