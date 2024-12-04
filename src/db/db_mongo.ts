import { MongoClient } from "mongodb";

import { BlogViewModel } from "../types/blogs/BlogViewModel.type";
import { PostViewModel } from "../types/posts/PostViewModel.type";

const mongoUrl = process.env.MONGO_URL ?? "mongodb://localhost:27017/test";

export const client = new MongoClient(mongoUrl);
const db = client.db("social");
export const blogsCollection = db.collection<BlogViewModel>("blogs");
export const postsCollection = db.collection<PostViewModel>("posts");

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
