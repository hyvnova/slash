import { g as get_from, u as update_user } from "../../../../chunks/user.js";
import { c as create_chat } from "../../../../chunks/chat.js";
import { F as FriendshipStatusType } from "../../../../chunks/types.js";
const POST = async ({ request }) => {
  let data = await request.json();
  let { user, other, status } = data;
  if (!user || !other || !status) {
    return new Response(null, { status: 400 });
  }
  if (status === FriendshipStatusType.NONE) {
    let other_requests = await get_from(other, "pending_requests") || [];
    let rejected = await get_from(user, "rejected_requests") || [];
    if (other_requests.includes(user)) {
      update_user(other, { $pull: { pending_requests: user } });
    } else {
      if (!rejected.includes(other)) {
        rejected.push(other);
      }
      update_user(user, { $pull: { friends: other, rejected_requests: other } });
      update_user(other, { $pull: { friends: user } });
    }
    return new Response(null, { status: 200 });
  } else if (status === FriendshipStatusType.REQUESTED) {
    let rejected = await get_from(user, "rejected_requests") || [];
    let other_requests = await get_from(other, "pending_requests") || [];
    if (rejected.includes(other)) {
      update_user(user, {
        $pull: { rejected_requests: other }
      });
    }
    if (!other_requests.includes(user)) {
      update_user(other, {
        $push: { pending_request: user }
      });
    }
    return new Response(null, { status: 200 });
  } else if (status === FriendshipStatusType.FRIENDS) {
    let friends = await get_from(user, "friends") || [];
    let other_friends = await get_from(other, "friends") || [];
    update_user(user, { $pull: { pending_requests: other } });
    if (!other_friends.includes(user)) {
      update_user(other, { $push: { friends: user } });
    }
    if (!friends.includes(other)) {
      update_user(user, { $push: { friends: other } });
    }
    await create_chat([user, other]);
    return new Response(null, { status: 200 });
  } else if (status === FriendshipStatusType.REJECTED) {
    let rejected = await get_from(user, "rejected_requests") || [];
    update_user(user, { $pull: { pending_requests: other } });
    if (!rejected.includes(other)) {
      update_user(user, { $push: { rejected_requests: other } });
    }
    return new Response(null, { status: 200 });
  }
  return new Response(null, { status: 400 });
};
export {
  POST
};
