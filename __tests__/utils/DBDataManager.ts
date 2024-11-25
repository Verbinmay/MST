import Chance from "chance";

import { db } from "../../src/db/db";
import { BlogInputModel } from "../../src/types/blogs/BlogInputModel.type";
import { CreateVideoInputModel } from "../../src/types/videos/CreateVideoInputModel.type";
import { ResolutionsEnum } from "../../src/types/videos/Resolution.type";
import { UpdateVideoInputModel } from "../../src/types/videos/UpdateVideoInputModel.type";
import { VideoType } from "../../src/types/videos/Video.type";

const chance = new Chance();

export const DBDataManager = {
  /** videos */
  createVideos(quantity: number): void {
    for (let i = 0; i < quantity; i++) {
      const data: VideoType = {
        ...this.createUpdateVideoInput(),
        createdAt: new Date().toISOString(),
        id: chance.integer({ min: 0, max: 1000000 }),
      };
      db.videos.push(data);
    }
  },
  createCreateVideoInput(): CreateVideoInputModel {
    const data: CreateVideoInputModel = {
      title: chance.string({ length: 40 }),
      author: chance.string({ length: 20 }),
    };

    if (Math.random() > 0.5) {
      data.availableResolutions = [
        ResolutionsEnum[
          (Object.keys(ResolutionsEnum) as Array<keyof typeof ResolutionsEnum>)[
            Math.floor(Math.random() * 8)
          ]
        ],
      ];
    }
    return data;
  },
  createUpdateVideoInput(): UpdateVideoInputModel {
    const data: UpdateVideoInputModel = { ...this.createCreateVideoInput() };

    if (Math.random() > 0.5) {
      data.canBeDownloaded = chance.bool();
    }
    if (Math.random() > 0.5) {
      data.minAgeRestriction = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        null,
      ][chance.integer({ min: 0, max: 19 })];
    }
    if (Math.random() > 0.5) {
      data.publicationDate = new Date().toISOString();
    }
    return data;
  },
  /** blogs */
  createBlogs(quantity: number): void {
    db.blogs = [];
    for (let i = 0; i < quantity; i++) {
      db.blogs.push({
        id: chance.string({ length: 10 }),
        ...this.createBlogInput(),
      });
    }
  },

  createBlogInput(): BlogInputModel {
    return {
      name: chance.string({ length: 10 }),
      description: chance.letter({ length: 499 }),
      websiteUrl: `https://google.com`,
    };
  },

  createPassword(): string {
    const login = process.env.BASIC_AUTH_LOGIN;
    const password = process.env.BASIC_AUTH_PASSWORD;
    const credentials = login + ":" + password;
    return `Basic ${Buffer.from(credentials).toString("base64")}`;
  },
};
