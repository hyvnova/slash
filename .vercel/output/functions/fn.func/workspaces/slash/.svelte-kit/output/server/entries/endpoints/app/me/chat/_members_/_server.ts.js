import { b as get_by } from "../../../../../../chunks/user.js";
import { R as Routes } from "../../../../../../chunks/types.js";
import { e as error, r as redirect } from "../../../../../../chunks/index.js";
const GET = async ({ params, cookies }) => {
  const { members } = params;
  if (!members)
    throw error(400, {
      message: "No members provided"
    });
  let members_list = [];
  try {
    members_list = members.split(",");
  } catch (e) {
    throw error(400, {
      message: "Invalid members list"
    });
  }
  const token = cookies.get("token");
  if (!token) {
    throw redirect(302, "/");
  }
  const user = await get_by(token);
  if (!user) {
    cookies.delete("token", { path: "/", secure: process.env.VERCEL_ENV === "production" });
    throw redirect(302, "/");
  }
  members_list.push(user.username);
  let chat_id = null;
  for (let chat of user.chats) {
    if (chat.members.sort().toString() === members_list.sort().toString()) {
      chat_id = chat.id;
      break;
    }
  }
  if (!chat_id) {
    throw error(404, {
      message: "Chat room not found"
    });
  }
  throw redirect(302, `${Routes.CHAT}/${chat_id}`);
};
export {
  GET
};
