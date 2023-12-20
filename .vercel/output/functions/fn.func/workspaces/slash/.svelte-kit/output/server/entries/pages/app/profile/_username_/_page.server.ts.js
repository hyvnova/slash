import { b as get_by, u as update_user } from "../../../../../chunks/user.js";
import { r as redirect, e as error } from "../../../../../chunks/index.js";
import { R as REGEX_USERNAME, a as REGEX_IMAGE_URL } from "../../../../../chunks/index3.js";
const load = async ({ cookies, params, url }) => {
  const username = decodeURIComponent(params.username);
  const show_edit = url.searchParams.get("show_edit") === "true";
  const token = cookies.get("token");
  let owner = false;
  if (token) {
    const user = await get_by(token);
    if (user) {
      owner = user.username === username;
    } else {
      throw redirect(302, "/");
    }
  }
  const profile = await get_by(username);
  if (!profile) {
    throw error(404, "Profile not found");
  }
  return {
    owner,
    username,
    avatar: profile.avatar,
    show_edit
  };
};
const actions = {
  update_username: async ({ request, cookies, url }) => {
    let new_username = (await request.formData()).get("username");
    if (!new_username || !REGEX_USERNAME.test(new_username)) {
      return { success: false, error: "Invalid username" };
    }
    const token = cookies.get("token");
    await update_user(token, {
      $set: { username: new_username }
    });
    throw redirect(302, url.toString());
  },
  update_avatar: async ({ request, cookies, url }) => {
    let new_avatar = (await request.formData()).get("avatar");
    if (!new_avatar || !REGEX_IMAGE_URL.test(new_avatar)) {
      return { success: false, error: "Invalid avatar" };
    }
    try {
      new URL(new_avatar);
    } catch (e) {
      return { success: false, error: "Invalid avatar" };
    }
    const token = cookies.get("token");
    await update_user(token, {
      $set: { avatar: new_avatar }
    });
    throw redirect(302, url.toString());
  }
};
export {
  actions,
  load
};
