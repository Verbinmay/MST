import { db, setDB } from "../../src/db/db";
import { SETTINGS } from "../../src/settings";
import { BlogInputModel } from "../../src/types/blogs/BlogInputModel.type";
import { req } from "../test-helpers";
import { DBDataManager } from "../utils/DBDataManager";

describe("/blogs", () => {
  beforeAll(async () => {
    setDB();
  });

  it("should get empty array", async () => {
    setDB();
    const res = await req.get(SETTINGS.PATH.BLOGS).expect(200);
    expect(res.body.length).toBe(0);
  });

  it("should get not empty array", async () => {
    setDB();
    DBDataManager.createBlogs(1);
    const res = await req.get(SETTINGS.PATH.BLOGS).expect(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toEqual(db.blogs[0]);
  });

  it("should create", async () => {
    setDB();
    const newData: BlogInputModel = DBDataManager.createBlogInput();

    const res = await req
      .post(SETTINGS.PATH.BLOGS)
      .set("Content-Type", "application/json")
      .send(newData);

    if (res.status !== 201) {
      console.log(res.body);
    }

    expect(res.status).toBe(201);

    for (const key of Object.keys(newData) as (keyof BlogInputModel)[]) {
      console.error(key);
      expect(res.body[key]).toEqual(newData[key]);
    }
  });

  it("shouldn't create", async () => {
    setDB();
    const newData: BlogInputModel = DBDataManager.createBlogInput();
    newData.name = "";
    newData.description = "";
    newData.websiteUrl = "";

    const res = await req
      .post(SETTINGS.PATH.BLOGS)
      .set("Content-Type", "application/json")
      .send(newData);

    if (res.status !== 201) {
      console.log(res.body);
    }

    expect(res.status).toBe(400);
    expect(res.body.errorsMessages.length).toBe(3);
    expect(res.body.errorsMessages[0].field).toBe("name");
    expect(res.body.errorsMessages[1].field).toBe("description");
    expect(res.body.errorsMessages[2].field).toBe("websiteUrl");
  });
});
