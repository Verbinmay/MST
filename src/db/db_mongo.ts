import { config } from "dotenv";
import { MongoClient } from "mongodb";

import { BlogDBModel } from "../types/blogs/BlogDBModel.type";
import { MessageDBModel } from "../types/messages/MessageDBModel.type";
import { PostDBModel } from "../types/posts/PostDBModel.type";
import { RequestDBModel } from "../types/requests/RequestDBModel.type";
import { SessionDBModel } from "../types/sessions/SessionDBModel.type";
import { UserDBModel } from "../types/users/UserDBModel.type";

config();

const mongoUrl = process.env.MONGO_URL ?? "mongodb://localhost:27017/test";

export const client = new MongoClient(mongoUrl);
const db = client.db("social");
export const blogsCollection = db.collection<BlogDBModel>("blogs");
export const postsCollection = db.collection<PostDBModel>("posts");
export const usersCollection = db.collection<UserDBModel>("users");
export const messagesCollection = db.collection<MessageDBModel>("messages");
export const requestsCollection = db.collection<RequestDBModel>("requests");
export const sessionsCollection = db.collection<SessionDBModel>("sessions");

export async function runDB(): Promise<boolean> {
  try {
    await client.connect();
    await db.command({ ping: 1 });
    return true;
  } catch (e) {
    console.error(e);
    await client.close();
    return false;
  }
}
