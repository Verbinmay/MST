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
    expect(res.body.accessToken).not.toBeUndefined();
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
      .set("Authorization", `Bearer ${loginRes.body.accessToken}`)
      .expect(200);
    expect(res.body.login).toBe(users[0].user.login);
    expect(res.body.email).toBe(users[0].user.email);
    expect(res.body.userId).toBe(users[0].user.id);
  });

  it("should register user", async () => {
    const user = await DBDataManager.createUserInput();
    user.email = process.env.MY_MAIL ?? chance.email();
    console.log(user);

    const res = await req
      .post(SETTINGS.PATH.AUTH.concat("/registration"))
      .set("Content-Type", "application/json")
      .send(user)
      .expect(204);
  });

  it("should confirm registration", async () => {
    const user = await DBDataManager.createUserInput();
    user.email = process.env.MY_MAIL ?? chance.email();

    const registration = await req
      .post(SETTINGS.PATH.AUTH.concat("/registration"))
      .set("Content-Type", "application/json")
      .send(user)
      .expect(204);

    const userFromDb = await DBDataManager.findUserByEmail(user.email);
    expect(userFromDb).not.toBeNull();

    const messages = await DBDataManager.findMessagesByUserId(userFromDb!.id);
    expect(messages).toHaveLength(1);

    const confirmationCode = messages[0].data.code;

    const confirmationRegistration = await req
      .post(SETTINGS.PATH.AUTH.concat("/registration-confirmation"))
      .set("Content-Type", "application/json")
      .send({ code: confirmationCode })
      .expect(204);

    const confirmedUser = await DBDataManager.findUserByEmail(user.email);
    expect(confirmedUser).not.toBeNull();
    expect(confirmedUser!.isConfirmed).toBeTruthy();
  });

  it("should refresh tokens", async () => {
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

    const cookies = loginRes.headers["set-cookie"] as unknown as string[];
    expect(cookies).toBeDefined();

    const refreshTokenCookie = cookies.find((cookie: string) =>
      cookie.startsWith("refreshToken=")
    );
    expect(refreshTokenCookie).toBeDefined();
    expect(refreshTokenCookie).toContain("HttpOnly");
    expect(refreshTokenCookie).toContain("Secure");

    const res = await req
      .post(SETTINGS.PATH.AUTH.concat("/refresh-token"))
      .set("Cookie", cookies)
      .expect(200);
    expect(res.body.accessToken).not.toBeUndefined();
  });
});
