import { r as redirect } from "../../../chunks/index.js";
import { b as get_by } from "../../../chunks/user.js";
const load = async ({ cookies }) => {
  const token = cookies.get("token");
  if (!token) {
    throw redirect(302, "/");
  }
  const user = await get_by(token);
  if (!user) {
    cookies.delete("token", { path: "/", secure: process.env.VERCEL_ENV === "production" });
    throw redirect(302, "/");
  }
  return {
    user: {
      username: user.username,
      avatar: user.avatar,
      friends: user.friends,
      pending_requests: user.pending_requests,
      chats: user.chats,
      verified: user.verified
    }
  };
};
export {
  load
};
