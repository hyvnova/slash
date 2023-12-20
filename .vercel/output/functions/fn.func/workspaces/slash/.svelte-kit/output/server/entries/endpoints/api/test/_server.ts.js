import { j as json } from "../../../../chunks/index.js";
import { a as add_user, u as update_user } from "../../../../chunks/user.js";
const GET = async ({}) => {
  let names = [
    "coolDude123",
    "sunnyDays22",
    "sparkleQueen",
    "mysterySolver",
    "guitarHero77",
    "pizzaLover99",
    "adventureSeeker",
    "sillyGoose22",
    "codingNinja",
    "starGazer88"
  ];
  let created = [];
  for (let name of names) {
    let data = {
      username: name,
      password: "password"
    };
    await add_user(data);
    created.push(data);
  }
  await update_user("nova", { $push: { pending_requests: { $each: names } } });
  return json(created);
};
export {
  GET
};
