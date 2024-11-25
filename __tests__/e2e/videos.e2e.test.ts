import { db, setDB } from "../../src/db/db";
import { SETTINGS } from "../../src/settings";
import { CreateVideoInputModel } from "../../src/types/videos/CreateVideoInputModel.type";
import { UpdateVideoInputModel } from "../../src/types/videos/UpdateVideoInputModel.type";
import { req } from "../test-helpers";
import { DBDataManager } from "../utils/DBDataManager";

describe("/videos", () => {
  beforeAll(async () => {
    setDB();
  });

  it("should get empty array", async () => {
    setDB();
    const res = await req.get(SETTINGS.PATH.VIDEOS).expect(200);
    expect(res.body.length).toBe(0);
  });
  it("should get not empty array", async () => {
    setDB();
    DBDataManager.createVideos(1);
    const res = await req.get(SETTINGS.PATH.VIDEOS).expect(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toEqual(db.videos[0]);
  });

  it("should create", async () => {
    setDB();
    const newData: CreateVideoInputModel =
      DBDataManager.createCreateVideoInput();
    console.log(newData);
    const res = await req
      .post(SETTINGS.PATH.VIDEOS)
      .set("Content-Type", "application/json")
      .send(newData);

    if (res.status !== 201) {
      console.log(res.body);
    }
    expect(res.status).toBe(201);
    expect(res.body.availableResolutions).toEqual(newData.availableResolutions);
    expect(res.body.title).toEqual(newData.title);
    expect(res.body.author).toEqual(newData.author);
  });

  it("shouldn't find", async () => {
    setDB();
    await req.get(SETTINGS.PATH.VIDEOS + "/1").expect(404);
  });

  it("should find", async () => {
    setDB();
    DBDataManager.createVideos(1);
    const res = await req.get(SETTINGS.PATH.VIDEOS + "/" + db.videos[0].id);
    expect(res.body).toEqual(db.videos[0]);
  });

  it("should update", async () => {
    setDB();
    DBDataManager.createVideos(1);
    const newData: UpdateVideoInputModel =
      DBDataManager.createUpdateVideoInput();

    const res = await req
      .put(SETTINGS.PATH.VIDEOS + "/" + db.videos[0].id)
      .set("Content-Type", "application/json")
      .send(newData);

    expect(res.status).toBe(204);
    expect(db.videos[0].author).toEqual(newData.author);
    expect(db.videos[0].title).toEqual(newData.title);
    expect(db.videos[0].availableResolutions).toEqual(
      newData.availableResolutions
    );
    expect(db.videos[0].canBeDownloaded).toEqual(newData.canBeDownloaded);
    expect(db.videos[0].minAgeRestriction).toEqual(newData.minAgeRestriction);
    expect(db.videos[0].publicationDate).toEqual(newData.publicationDate);
  });
});
