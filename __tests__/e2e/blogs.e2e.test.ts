import Chance from "chance";
import { config } from "dotenv";

import { db, setDB } from "../../src/db/db";
import { SETTINGS } from "../../src/settings";
import { BlogInputModel } from "../../src/types/blogs/BlogInputModel.type";
import { req } from "../test-helpers";
import { DBDataManager } from "../utils/DBDataManager";

config();
const chance = new Chance();

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
      .set("authorization", DBDataManager.createPassword())
      .send(newData);

    if (res.status !== 201) {
      console.log(res.body);
    }

    expect(res.status).toBe(201);

    for (const key of Object.keys(newData) as (keyof BlogInputModel)[]) {
      expect(res.body[key]).toEqual(newData[key]);
    }
  });

  it("shouldn't create - 400", async () => {
    setDB();
    const newData: BlogInputModel = DBDataManager.createBlogInput();
    newData.name = "";
    newData.description = "";
    newData.websiteUrl = "";

    const res = await req
      .post(SETTINGS.PATH.BLOGS)
      .set("Content-Type", "application/json")
      .set("authorization", DBDataManager.createPassword())
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

  it("shouldn't create - 401", async () => {
    setDB();
    const newData: BlogInputModel = DBDataManager.createBlogInput();

    const res = await req
      .post(SETTINGS.PATH.BLOGS)
      .set("Content-Type", "application/json")
      .send(newData);

    if (res.status !== 401) {
      console.log(res.body);
    }

    expect(res.status).toBe(401);
  });

  it("should get by id", async () => {
    setDB();
    DBDataManager.createBlogs(1);
    const blog = db.blogs[0];
    const res = await req
      .get(SETTINGS.PATH.BLOGS.concat(`/${blog.id}`))
      .expect(200);
    expect(res.body).toEqual(blog);
  });
  it("shouldn't get by id", async () => {
    setDB();
    await req
      .get(SETTINGS.PATH.BLOGS.concat(`/${chance.letter({ length: 10 })}`))
      .expect(404);
  });

  it("should update", async () => {
    setDB();
    DBDataManager.createBlogs(1);
    const blog = db.blogs[0];
    const newData: BlogInputModel = DBDataManager.createBlogInput();
    const res = await req
      .put(SETTINGS.PATH.BLOGS.concat(`/${blog.id}`))
      .set("Content-Type", "application/json")
      .set("authorization", DBDataManager.createPassword())
      .send(newData);

    expect(res.status).toBe(204);
    expect(db.blogs[0]).toEqual({ ...newData, id: blog.id });
  });
  it("shouldn't update - 400", async () => {
    setDB();
    DBDataManager.createBlogs(1);
    const blog = db.blogs[0];
    const newData: BlogInputModel = DBDataManager.createBlogInput();
    newData.name = "";
    const res = await req
      .put(SETTINGS.PATH.BLOGS.concat(`/${blog.id}`))
      .set("Content-Type", "application/json")
      .set("authorization", DBDataManager.createPassword())
      .send(newData);

    expect(res.status).toBe(400);
    expect(res.body.errorsMessages.length).toBe(1);
    expect(res.body.errorsMessages[0].field).toBe("name");
  });
  it("shouldn't update - 401", async () => {
    setDB();
    DBDataManager.createBlogs(1);
    const blog = db.blogs[0];
    const newData: BlogInputModel = DBDataManager.createBlogInput();
    const res = await req
      .put(SETTINGS.PATH.BLOGS.concat(`/${blog.id}`))
      .set("Content-Type", "application/json")
      .set("authorization", DBDataManager.createPassword().concat("122111"))
      .send(newData);

    expect(res.status).toBe(401);
  });
  it("shouldn't update - 404", async () => {
    setDB();
    const newData: BlogInputModel = DBDataManager.createBlogInput();
    const res = await req
      .put(SETTINGS.PATH.BLOGS.concat(`/${chance.letter({ length: 10 })}`))
      .set("Content-Type", "application/json")
      .set("authorization", DBDataManager.createPassword())
      .send(newData);

    expect(res.status).toBe(404);
  });

  it("should delete", async () => {
    setDB();
    DBDataManager.createBlogs(1);
    const blog = db.blogs[0];
    const res = await req
      .delete(SETTINGS.PATH.BLOGS.concat(`/${blog.id}`))
      .set("authorization", DBDataManager.createPassword());

    expect(res.status).toBe(204);
    expect(db.blogs.length).toBe(0);
  });

  it("shouldn't delete - 401", async () => {
    setDB();
    DBDataManager.createBlogs(1);
    const blog = db.blogs[0];
    const res = await req
      .delete(SETTINGS.PATH.BLOGS.concat(`/${blog.id}`))
      .set("authorization", DBDataManager.createPassword().concat("122111"));

    expect(res.status).toBe(401);
  });

  it("shouldn't delete - 404", async () => {
    setDB();
    const res = await req
      .delete(SETTINGS.PATH.BLOGS.concat(`/${chance.letter({ length: 10 })}`))
      .set("authorization", DBDataManager.createPassword());

    expect(res.status).toBe(404);
  });
});
