import { f as find_matching, g as get_from } from "../../../../chunks/user.js";
import { F as FriendshipStatusType } from "../../../../chunks/types.js";
import { j as json } from "../../../../chunks/index.js";
function similars(target, items) {
  return items.filter((item) => item.includes(target));
}
const POST = async ({ request }) => {
  let data = await request.json();
  let { query, user } = data;
  if (!query || !user) {
    return json([]);
  }
  let results = await Promise.all((await find_matching(query, ["username", "avatar", "friends", "requests"])).filter((result) => {
    if (result.username === user.username)
      return false;
    return result.username == query || similars(query, user.friends).includes(result.username);
  }).map(async (result) => {
    let user_rejected = await get_from(result.username, "rejected_requests") || [];
    let other_requests = await get_from(result.username, "pending_requests") || [];
    let other_rejected = await get_from(result.username, "rejected_requests") || [];
    let friendship = FriendshipStatusType.NONE;
    if (user.friends.includes(result.username)) {
      friendship = FriendshipStatusType.FRIENDS;
    }
    if (other_requests.includes(user.username)) {
      friendship = FriendshipStatusType.REQUESTED;
    }
    if (other_rejected.includes(user.username)) {
      friendship = FriendshipStatusType.WAS_REJECTED;
    }
    if (user_rejected.includes(result.username)) {
      friendship = FriendshipStatusType.REJECTED;
    }
    return {
      username: result.username,
      avatar: result.avatar,
      friendship
    };
  }));
  return json(results);
};
export {
  POST
};
