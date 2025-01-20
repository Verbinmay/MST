import Chance from "chance";
import { config } from "dotenv";
import { setTimeout } from "timers/promises";

import { SETTINGS } from "../../src/settings";
import { UserDBModel } from "../../src/types/users/UserDBModel.type";
import { req } from "../test-helpers";
import { DBDataManager } from "../utils/DBDataManager";

config();
const chance = new Chance();

describe("/auth", () => {
  beforeEach(async () => {
    await setTimeout(1000);
    await DBDataManager.deleteAllDb();
  });
  afterAll(async () => {
    await DBDataManager.closeConnection();
  });

  it("should get login", async () => {
    const users = (await DBDataManager.createUsers(1)) as Array<{
      user: UserDBModel;
      pass: string;
    }>;

    const res = await req
      .post(SETTINGS.PATH.AUTH.concat("/login"))
      .set("Content-Type", "application/json")
      .send({
        loginOrEmail: users[0].user.login,
        password: users[0].pass,
      })
      .expect(200);
    expect(res.body.token).not.toBeUndefined();
  });
});

it("should return info about me", async () => {
  const users = (await DBDataManager.createUsers(1)) as Array<{
    user: UserDBModel;
    pass: string;
  }>;

  const loginRes = await req
    .post(SETTINGS.PATH.AUTH.concat("/login"))
    .set("Content-Type", "application/json")
    .send({
      loginOrEmail: users[0].user.login,
      password: users[0].pass,
    })
    .expect(200);

  const res = await req
    .get(SETTINGS.PATH.AUTH.concat("/me"))
    .set("Authorization", `Bearer ${loginRes.body.token}`)
    .expect(200);
  expect(res.body.login).toBe(users[0].user.login);
  expect(res.body.email).toBe(users[0].user.email);
  expect(res.body.userId).toBe(users[0].user.id);
});
