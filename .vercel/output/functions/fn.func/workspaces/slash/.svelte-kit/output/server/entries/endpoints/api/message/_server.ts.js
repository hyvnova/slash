import { e as edit_message, d as delete_message, a as add_message } from "../../../../chunks/chat.js";
import { j as json } from "../../../../chunks/index.js";
import "dotenv/config";
var ActionType = /* @__PURE__ */ ((ActionType2) => {
  ActionType2["send"] = "send";
  ActionType2["delete"] = "delete";
  ActionType2["edit"] = "edit";
  return ActionType2;
})(ActionType || {});
const MissingParameters = json({
  error: "Missing parameters at message handler."
}, { status: 400 });
const POST = async ({ request, cookies }) => {
  let data = await request.json();
  let { action, chat_id, message_id, message } = data;
  if (!action) {
    return MissingParameters;
  }
  if (!(action in ActionType)) {
    return json({
      error: "Invalid action at message handler."
    }, { status: 400 });
  }
  if (!cookies.get("token")) {
    return json({
      error: "You are not logged in"
    }, { status: 400 });
  }
  switch (action) {
    case "send":
      if (!chat_id || !message) {
        return MissingParameters;
      }
      await add_message(chat_id, message);
      break;
    case "delete":
      if (!chat_id || !message_id) {
        return MissingParameters;
      }
      await delete_message(chat_id, message_id);
      break;
    case "edit":
      if (!chat_id || !message_id || !message) {
        return MissingParameters;
      }
      await edit_message(chat_id, message_id, message);
      break;
  }
  return json({
    success: true
  }, { status: 200 });
};
export {
  POST
};
