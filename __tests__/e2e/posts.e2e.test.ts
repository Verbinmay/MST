import Chance from "chance";
import { config } from "dotenv";

import { db, setDB } from "../../src/db/db";
import { SETTINGS } from "../../src/settings";
import { PostInputModel } from "../../src/types/posts/PostInputModel.type";
import { req } from "../test-helpers";
import { DBDataManager } from "../utils/DBDataManager";

config();
const chance = new Chance();

describe("/posts", () => {
  beforeAll(async () => {
    setDB();
  });

  it("should get empty array", async () => {
    setDB();
    const res = await req.get(SETTINGS.PATH.POSTS).expect(200);
    expect(res.body.length).toBe(0);
  });

  it("should get not empty array", async () => {
    setDB();
    DBDataManager.createPosts(1);
    const res = await req.get(SETTINGS.PATH.POSTS).expect(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toEqual(db.posts[0]);
  });

  it("should create", async () => {
    setDB();
    const newData: PostInputModel = DBDataManager.createPostInput();

    const res = await req
      .post(SETTINGS.PATH.POSTS)
      .set("Content-Type", "application/json")
      .set("authorization", DBDataManager.createPassword())
      .send(newData);

    if (res.status !== 201) {
      console.log(res.body);
    }

    expect(res.status).toBe(201);

    for (const key of Object.keys(newData) as (keyof PostInputModel)[]) {
      expect(res.body[key]).toEqual(newData[key]);
    }
  });

  it("shouldn't create - 400", async () => {
    setDB();
    const newData: PostInputModel = DBDataManager.createPostInput();
    newData.title = "";
    newData.shortDescription = "";
    newData.content = "";
    newData.blogId = "error";

    const res = await req
      .post(SETTINGS.PATH.POSTS)
      .set("Content-Type", "application/json")
      .set("authorization", DBDataManager.createPassword())
      .send(newData);

    if (res.status !== 201) {
      console.log(res.body);
    }

    expect(res.status).toBe(400);
    expect(res.body.errorsMessages.length).toBe(4);
    expect(res.body.errorsMessages[0].field).toBe("title");
    expect(res.body.errorsMessages[1].field).toBe("shortDescription");
    expect(res.body.errorsMessages[2].field).toBe("content");
    expect(res.body.errorsMessages[3].field).toBe("blogId");
  });

  it("shouldn't create - 401", async () => {
    setDB();
    const newData: PostInputModel = DBDataManager.createPostInput();

    const res = await req
      .post(SETTINGS.PATH.POSTS)
      .set("Content-Type", "application/json")
      .send(newData);

    if (res.status !== 401) {
      console.log(res.body);
    }

    expect(res.status).toBe(401);
  });

  it("should get by id", async () => {
    setDB();
    const post = DBDataManager.createPosts(1)[0];
    const res = await req
      .get(SETTINGS.PATH.POSTS.concat(`/${post.id}`))
      .expect(200);
    expect(res.body).toEqual(post);
  });
  it("shouldn't get by id", async () => {
    setDB();
    await req
      .get(SETTINGS.PATH.POSTS.concat(`/${chance.letter({ length: 10 })}`))
      .expect(404);
  });

  it("should update", async () => {
    setDB();
    const post = DBDataManager.createPosts(1)[0];
    const newData: PostInputModel = DBDataManager.createPostInput(post.blogId);
    const res = await req
      .put(SETTINGS.PATH.POSTS.concat(`/${post.id}`))
      .set("Content-Type", "application/json")
      .set("authorization", DBDataManager.createPassword())
      .send(newData);

    expect(res.status).toBe(204);
    expect(db.posts[0]).toEqual({ ...post, ...newData });
  });
  it("shouldn't update - 400", async () => {
    setDB();
    const post = DBDataManager.createPosts(1)[0];
    const newData: PostInputModel = DBDataManager.createPostInput(post.blogId);
    newData.title = "";
    const res = await req
      .put(SETTINGS.PATH.POSTS.concat(`/${post.id}`))
      .set("Content-Type", "application/json")
      .set("authorization", DBDataManager.createPassword())
      .send(newData);

    expect(res.status).toBe(400);
    expect(res.body.errorsMessages.length).toBe(1);
    expect(res.body.errorsMessages[0].field).toBe("title");
  });
  it("shouldn't update - 401", async () => {
    setDB();
    const post = DBDataManager.createPosts(1)[0];
    const newData: PostInputModel = DBDataManager.createPostInput(post.blogId);
    const res = await req
      .put(SETTINGS.PATH.POSTS.concat(`/${post.id}`))
      .set("Content-Type", "application/json")
      .set("authorization", DBDataManager.createPassword().concat("122111"))
      .send(newData);

    expect(res.status).toBe(401);
  });
  it("shouldn't update - 404", async () => {
    setDB();
    const newData: PostInputModel = DBDataManager.createPostInput();
    const res = await req
      .put(SETTINGS.PATH.POSTS.concat(`/${chance.letter({ length: 10 })}`))
      .set("Content-Type", "application/json")
      .set("authorization", DBDataManager.createPassword())
      .send(newData);

    expect(res.status).toBe(404);
  });

  it("should delete", async () => {
    setDB();
    const post = DBDataManager.createPosts(1)[0];
    const res = await req
      .delete(SETTINGS.PATH.POSTS.concat(`/${post.id}`))
      .set("authorization", DBDataManager.createPassword());
    expect(res.status).toBe(204);
    expect(db.posts.length).toBe(0);
  });

  it("shouldn't delete - 401", async () => {
    setDB();
    const post = DBDataManager.createPosts(1)[0];
    const res = await req
      .delete(SETTINGS.PATH.POSTS.concat(`/${post.id}`))
      .set("authorization", DBDataManager.createPassword().concat("122111"));

    expect(res.status).toBe(401);
  });

  it("shouldn't delete - 404", async () => {
    setDB();
    const res = await req
      .delete(SETTINGS.PATH.POSTS.concat(`/${chance.letter({ length: 10 })}`))
      .set("authorization", DBDataManager.createPassword());

    expect(res.status).toBe(404);
  });
});
