import Chance from "chance";
import { config } from "dotenv";
import { WithId } from "mongodb";
import { setTimeout } from "timers/promises";

import { SETTINGS } from "../../src/settings";
import { PostInputModel } from "../../src/types/posts/PostInputModel.type";
import { PostViewModel } from "../../src/types/posts/PostViewModel.type";
import { req } from "../test-helpers";
import { DBDataManager } from "../utils/DBDataManager";

config();
const chance = new Chance();

describe("/posts", () => {
  beforeEach(async () => {
    await setTimeout(1000);
    await DBDataManager.deleteAllDb();
  });
  afterAll(async () => {
    await DBDataManager.closeConnection();
  });

  it("should get empty array", async () => {
    const res = await req.get(SETTINGS.PATH.POSTS).expect(200);
    expect(res.body.length).toBe(0);
  });

  it("should get not empty array", async () => {
    const posts: Array<PostViewModel> = await DBDataManager.createPosts(
      1,
      undefined,
      true
    );
    const res = await req.get(SETTINGS.PATH.POSTS).expect(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toEqual(posts[0]);
  });

  it("should create", async () => {
    const newData: PostInputModel = await DBDataManager.createPostInput();

    const res = await req
      .post(SETTINGS.PATH.POSTS)
      .set("Content-Type", "application/json")
      .set("authorization", DBDataManager.createPassword())
      .send(newData);

    if (res.status !== 201) {
      console.log(res.body);
    }

    expect(res.status).toBe(201);
    for (const key of Object.keys(newData) as (keyof PostViewModel)[]) {
      if (key === "id") {
        expect(typeof res.body[key]).toBe("string");
        continue;
      }
      if (key === "createdAt") {
        expect(typeof res.body[key]).toBe("string");
        continue;
      }
      if (key === "blogId") {
        expect(typeof res.body[key]).toBe("string");
        expect(await DBDataManager.findBlogById(res.body[key])).not.toBeNull();
        continue;
      }

      if (key === "title" || key === "shortDescription" || key === "content") {
        expect(res.body[key]).toBe(newData[key]);
        continue;
      }

      if (key === "blogName") {
        expect(res.body[key]).toBe(
          (await DBDataManager.findBlogById(newData.blogId))?.name
        );
        continue;
      }

      throw new Error(`Unexpected key: ${key}`);
    }
  });

  it("shouldn't create - 400", async () => {
    const newData: PostInputModel = await DBDataManager.createPostInput();
    newData.title = "";
    newData.shortDescription = "";
    newData.content = "";
    newData.blogId = "error";

    const res = await req
      .post(SETTINGS.PATH.POSTS)
      .set("Content-Type", "application/json")
      .set("authorization", DBDataManager.createPassword())
      .send(newData);

    if (res.status !== 400) {
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
    const newData: PostInputModel = await DBDataManager.createPostInput();

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
    const post = (
      await DBDataManager.createPosts(1, undefined, true)
    )[0] as PostViewModel;

    const res = await req
      .get(SETTINGS.PATH.POSTS.concat(`/${post.id}`))
      .expect(200);
    expect(res.body).toEqual(post);
  });

  it("shouldn't get by id", async () => {
    await req
      .get(SETTINGS.PATH.POSTS.concat(`/${chance.letter({ length: 10 })}`))
      .expect(404);
  });

  it("should update", async () => {
    const post = (
      await DBDataManager.createPosts(1)
    )[0] as WithId<PostViewModel>;
    const newData: PostInputModel = await DBDataManager.createPostInput(
      post.blogId
    );

    const res = await req
      .put(SETTINGS.PATH.POSTS.concat(`/${post.id}`))
      .set("Content-Type", "application/json")
      .set("authorization", DBDataManager.createPassword())
      .send(newData);

    expect(res.status).toBe(204);

    const updatedPost: PostViewModel | null = await DBDataManager.findPostById(
      post.id,
      true
    );

    if (!updatedPost) {
      throw new Error("Post not found");
    }
    for (const key of Object.keys(newData) as (keyof PostViewModel)[]) {
      if (key === "id") {
        expect(updatedPost[key]).toBe(post[key]);
        continue;
      }

      if (key === "createdAt") {
        expect(updatedPost[key]).toBe(post[key]);
        continue;
      }

      if (key === "blogId") {
        expect(updatedPost[key]).toBe(post[key]);
        continue;
      }

      if (key === "title" || key === "shortDescription" || key === "content") {
        expect(updatedPost[key]).toBe(newData[key]);
        continue;
      }

      if (key === "blogName") {
        expect(updatedPost[key]).toBe(
          (await DBDataManager.findBlogById(newData.blogId))?.name
        );
        continue;
      }

      throw new Error(`Unexpected key: ${key}`);
    }
  });

  it("shouldn't update - 400", async () => {
    const post = (
      await DBDataManager.createPosts(1)
    )[0] as WithId<PostViewModel>;
    const newData: PostInputModel = await DBDataManager.createPostInput(
      post.blogId
    );
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
    const post = (
      await DBDataManager.createPosts(1)
    )[0] as WithId<PostViewModel>;
    const newData: PostInputModel = await DBDataManager.createPostInput(
      post.blogId
    );
    const res = await req
      .put(SETTINGS.PATH.POSTS.concat(`/${post.id}`))
      .set("Content-Type", "application/json")
      .set("authorization", DBDataManager.createPassword().concat("122111"))
      .send(newData);

    expect(res.status).toBe(401);
  });
  it("shouldn't update - 404", async () => {
    const newData: PostInputModel = await DBDataManager.createPostInput();
    const res = await req
      .put(SETTINGS.PATH.POSTS.concat(`/${chance.letter({ length: 10 })}`))
      .set("Content-Type", "application/json")
      .set("authorization", DBDataManager.createPassword())
      .send(newData);

    expect(res.status).toBe(404);
  });

  it("should delete", async () => {
    const post: PostViewModel = (
      await DBDataManager.createPosts(1, undefined, true)
    )[0] as PostViewModel;
    const res = await req
      .delete(SETTINGS.PATH.POSTS.concat(`/${post.id}`))
      .set("authorization", DBDataManager.createPassword());

    const findPost = await DBDataManager.findPostById(post.id);
    expect(res.status).toBe(204);
    expect(findPost).toBe(null);
  });

  it("shouldn't delete - 401", async () => {
    const post: PostViewModel = (
      await DBDataManager.createPosts(1, undefined, true)
    )[0] as PostViewModel;
    const res = await req
      .delete(SETTINGS.PATH.POSTS.concat(`/${post.id}`))
      .set("authorization", DBDataManager.createPassword().concat("122111"));

    expect(res.status).toBe(401);
  });

  it("shouldn't delete - 404", async () => {
    const res = await req
      .delete(SETTINGS.PATH.POSTS.concat(`/${chance.letter({ length: 10 })}`))
      .set("authorization", DBDataManager.createPassword());

    expect(res.status).toBe(404);
  });
});
