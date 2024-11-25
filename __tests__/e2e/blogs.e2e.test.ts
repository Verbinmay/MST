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
});
