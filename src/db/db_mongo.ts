import { MongoClient } from "mongodb";

import { BlogDBModel } from "../types/blogs/BlogDBModel.type";
import { PostDBModel } from "../types/posts/PostDBModel.type";
import { UserDBModel } from "../types/users/UserDBModel.type";

const mongoUrl = process.env.MONGO_URL ?? "mongodb://localhost:27017/test";

export const client = new MongoClient(mongoUrl);
const db = client.db("social");
export const blogsCollection = db.collection<BlogDBModel>("blogs");
export const postsCollection = db.collection<PostDBModel>("posts");
export const usersCollection = db.collection<UserDBModel>("users");

export async function runDB() {
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);
    await client.close();
  }
}
