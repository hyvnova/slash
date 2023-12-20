import { b as get_by } from "../../../../chunks/user.js";
import { r as redirect } from "../../../../chunks/index.js";
const load = async ({ cookies }) => {
  const token = cookies.get("token");
  if (!token) {
    throw redirect(302, "/");
  }
  const user = await get_by(token);
  return {
    username: user.username,
    avatar: user.avatar,
    verified: user.verified
  };
};
export {
  load
};
