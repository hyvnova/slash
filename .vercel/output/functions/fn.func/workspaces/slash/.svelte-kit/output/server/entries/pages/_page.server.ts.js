import { e as exists, b as get_by, a as add_user, g as get_from } from "../../chunks/user.js";
import { r as redirect } from "../../chunks/index.js";
import bcrypt from "bcrypt";
import { R as Routes } from "../../chunks/types.js";
import "dotenv/config";
const load = async ({ cookies }) => {
  let token = cookies.get("token");
  if (token && await exists(token)) {
    throw redirect(302, Routes.HOME);
  }
};
const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get("username");
    const password = data.get("password");
    if (!await get_by(username)) {
      await add_user({
        username,
        password: bcrypt.hashSync(password, 11)
      });
    } else {
      const user = await get_by(username);
      if (!bcrypt.compareSync(password, user.password)) {
        return { error: "Incorrect password" };
      }
    }
    let token = await get_from(username, "token");
    if (!token) {
      return { error: "User not found" };
    }
    cookies.set("token", token, {
      path: "/",
      secure: process.env.VERCEL_ENV === "production"
    });
    throw redirect(302, Routes.HOME);
  }
};
export {
  actions,
  load
};
