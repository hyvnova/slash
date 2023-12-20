import { c as create_ssr_component, v as validate_component } from "../../../../chunks/ssr.js";
import "../../../../chunks/websocket.js";
import "../../../../chunks/types.js";
import { N as Notification } from "../../../../chunks/Notification.js";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-123zr24_START -->${$$result.title = `<title>Me</title>`, ""}<meta name="description" content="Slash user home page"><meta name="keywords" content="Slash user page, slash me"><!-- HEAD_svelte-123zr24_END -->`, ""} <main class="w-screen">${validate_component(Notification, "Notification").$$render($$result, {}, {}, {})} ${slots.default ? slots.default({}) : ``}</main>`;
});
export {
  Layout as default
};
