import { db, setDB } from "../../src/db/db";
import { SETTINGS } from "../../src/settings";
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
});
