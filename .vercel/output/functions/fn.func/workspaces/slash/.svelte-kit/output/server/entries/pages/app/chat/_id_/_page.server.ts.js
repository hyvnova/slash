import { g as get_chat } from "../../../../../chunks/chat.js";
import { r as redirect } from "../../../../../chunks/index.js";
import { b as get_by } from "../../../../../chunks/user.js";
import { R as Routes } from "../../../../../chunks/types.js";
const load = async ({ params, cookies }) => {
  const token = cookies.get("token");
  if (!token) {
    throw redirect(302, "/");
  }
  const user = await get_by(token);
  if (!user) {
    cookies.delete("token", { path: "/", secure: process.env.VERCEL_ENV === "production" });
    throw redirect(302, "/");
  }
  const chat = await get_chat(params.id);
  if (!chat || !chat.members.includes(user.username)) {
    throw redirect(302, Routes.HOME);
  }
  return {
    chat,
    user: {
      username: user.username,
      avatar: user.avatar,
      friends: user.friends,
      pending_requests: user.pending_requests,
      chats: user.chats,
      verified: user.verified
    },
    other: chat.members.find((u) => u !== user.username)
  };
};
export {
  load
};
