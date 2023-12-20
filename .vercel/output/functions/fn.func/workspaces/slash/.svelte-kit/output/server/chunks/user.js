import { randomUUID } from "crypto";
import { d as db } from "./db.js";
async function exists(identifier) {
  const collection = db.collection("users");
  const user_data = await collection.findOne({
    $or: [
      { token: identifier },
      { username: identifier }
    ]
  }, { projection: { _id: 1 } });
  return user_data !== null;
}
async function add_user(data) {
  const collection = db.collection("users");
  if (await exists(data.username)) {
    return;
  }
  data.token = randomUUID();
  data.verified = false;
  data.friends = [];
  data.chats = [];
  data.pending_requests = [];
  data.rejected_requests = [];
  data.avatar ||= `/default_avatars/${Math.floor(Math.random() * 4) + 1}.jpg`;
  await collection.insertOne(data);
  return data.token;
}
async function find_matching(query, fields) {
  const projection = {};
  fields.forEach((field) => projection[field] = 1);
  const collection = db.collection("users");
  const user_data = await collection.find({
    $or: [
      { username: { $regex: query, $options: "i" } }
    ]
  }, { projection }).toArray();
  return user_data ?? [];
}
async function get_by(identifier) {
  const collection = db.collection("users");
  const user_data = await collection.findOne({
    $or: [
      { token: identifier },
      { username: identifier }
    ]
  });
  return user_data;
}
async function get_from(identifier, field) {
  let projection = {};
  projection[field] = 1;
  const collection = db.collection("users");
  const user_data = await collection.findOne({
    $or: [
      { username: identifier },
      { token: identifier }
    ]
  }, { projection });
  if (!user_data) {
    return null;
  }
  return user_data[field] ?? null;
}
async function update_user(identifier, query) {
  const collection = db.collection("users");
  await collection.updateOne({
    $or: [
      { token: identifier },
      { username: identifier }
    ]
  }, query);
}
async function delete_user(identifier) {
  const collection = db.collection("users");
  await collection.deleteOne({
    $or: [
      { token: identifier },
      { username: identifier }
    ]
  });
}
export {
  add_user as a,
  get_by as b,
  delete_user as d,
  exists as e,
  find_matching as f,
  get_from as g,
  update_user as u
};
