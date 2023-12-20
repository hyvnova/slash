import { e as exists, g as get_from } from "../../../../chunks/user.js";
const GET = async ({ url, params }) => {
  const username = params.username;
  if (!username || !await exists(username)) {
    return new Response(null, { status: 404 });
  }
  let avatar_url = await get_from(username, "avatar");
  if (!avatar_url) {
    return new Response(null, { status: 404 });
  }
  const avatar_type = avatar_url?.split(".").pop();
  if (avatar_url.startsWith("/")) {
    avatar_url = `${url.origin}${avatar_url}`;
  }
  const response = await fetch(avatar_url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || `image/${avatar_type}`
    }
  });
};
export {
  GET
};
