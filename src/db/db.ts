import { VideoType } from "../types/videos/Video.type";

export type DBType = {
  videos: Array<VideoType>;
};

export const db: DBType = {
  videos: [],
};

export const setDB = (dataset?: Partial<DBType>) => {
  if (!dataset) {
    db.videos = [];
    return;
  }

  db.videos = dataset.videos || db.videos;
};
