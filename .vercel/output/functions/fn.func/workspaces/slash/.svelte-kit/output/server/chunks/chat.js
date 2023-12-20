import { randomUUID } from "crypto";
import { d as db } from "./db.js";
async function create_chat(members) {
  if (await exists_chat(members)) {
    return;
  }
  let chat = {
    attachments: [],
    last_message: null,
    id: randomUUID(),
    messages: [],
    members
  };
  await db.collection("chats").insertOne(chat);
  for (const user of members) {
    await db.collection("users").updateOne({ username: user }, {
      $push: {
        chats: {
          id: chat.id,
          members
        }
      }
    });
  }
}
async function exists_chat(members) {
  return await db.collection("chats").findOne({ members: { $all: members } }, { projection: { id: 1 } });
}
async function get_chat(id) {
  const chats = db.collection("chats");
  return await chats.findOne(
    { id },
    { projection: { _id: 0, messages: { $slice: -30 } } }
  );
}
async function add_message(chat_id, message) {
  message.id = randomUUID();
  message.attachments ||= [];
  await db.collection("chats").updateOne({ id: chat_id }, { $push: { messages: message } });
}
async function delete_message(chat_id, message_id) {
  await db.collection("chats").updateOne({ id: chat_id }, { $pull: { messages: { id: message_id } } });
}
async function edit_message(chat_id, message_id, new_message) {
  new_message.id = randomUUID();
  new_message.attachments ||= [];
  await db.collection("chats").updateOne({ id: chat_id, "messages.id": message_id }, { $set: { "messages.$": new_message } });
}
export {
  add_message as a,
  create_chat as c,
  delete_message as d,
  edit_message as e,
  get_chat as g
};
