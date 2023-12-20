import { d as delete_user } from "../../../../chunks/user.js";
import { j as json } from "../../../../chunks/index.js";
import "dotenv/config";
var ActionType = /* @__PURE__ */ ((ActionType2) => {
  ActionType2["logout"] = "logout";
  ActionType2["delete"] = "delete";
  return ActionType2;
})(ActionType || {});
const POST = async ({ request, cookies }) => {
  let data = await request.json();
  let { action } = data;
  if (!action) {
    return json({
      error: "Missing parameters. Required parameters: action: string (login, signup, logout)"
    }, { status: 400 });
  }
  if (!(action in ActionType)) {
    return json({
      error: "Invalid action. Valid actions: login, signup, logout"
    }, { status: 400 });
  }
  if (!cookies.get("token")) {
    return json({
      error: "You are not logged in"
    }, { status: 400 });
  }
  switch (action) {
    case "logout":
      cookies.delete("token", {
        path: "/",
        secure: process.env.VERCEL_ENV === "production"
      });
      break;
    case "delete":
      delete_user(cookies.get("token"));
      cookies.delete("token", {
        path: "/",
        secure: process.env.VERCEL_ENV === "production"
      });
      break;
  }
  return json({
    success: true
  }, { status: 200 });
};
export {
  POST
};
