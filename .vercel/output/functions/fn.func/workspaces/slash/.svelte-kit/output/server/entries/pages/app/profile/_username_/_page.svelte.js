import { c as create_ssr_component, e as escape, d as add_attribute, v as validate_component } from "../../../../../chunks/ssr.js";
import { faHome, faPen } from "@fortawesome/free-solid-svg-icons";
import { F as Fa } from "../../../../../chunks/fa.js";
import { n as notification, N as Notification } from "../../../../../chunks/Notification.js";
import { R as Routes } from "../../../../../chunks/types.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let { form } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  {
    {
      if (form) {
        notification.set({
          type: "error",
          title: "Invalid credentials",
          message: form.error,
          duration: 5e3
        });
      }
    }
  }
  return `${$$result.head += `<!-- HEAD_svelte-5oroqw_START -->${$$result.title = `<title>${escape(data.username)}</title>`, ""}<meta:og${add_attribute("title", data.username, 0)}></meta:og><meta:og type="profile"></meta:og><meta:og${add_attribute("image", data.avatar, 0)}></meta:og><meta:og description="${escape(data.username, true) + "'s profile"}"></meta:og><!-- HEAD_svelte-5oroqw_END -->`, ""} <nav class="mt-2 flex justify-between items-center w-full p-2 border-b border-gray-700"><a${add_attribute("href", Routes.HOME, 0)} class="rotate text-gray-400 hover:text-gray-100">${validate_component(Fa, "Fa").$$render($$result, { icon: faHome, class: "text-2xl" }, {}, {})}</a></nav> <div class="h-screen w-full flex flex-col justify-center items-center">${validate_component(Notification, "Notification").$$render($$result, {}, {}, {})} <main class="flex flex-col justify-center items-center"><div class="flex flex-col justify-center items-center bg-gray-800 p-5 text-white text-center w-72 min-h-96 rounded-md shadow-md transition-all duration-500 ease-in-out "><div class="container p-2"> ${` ${data.owner && data.show_edit ? `<button class="rounded-full no-bg w-min p-2 text-gray-400 border-gray-400 hover:text-white hover:border-white transition-all duration-200 ease-in-out" title="Edit profile avatar">${validate_component(Fa, "Fa").$$render($$result, { icon: faPen }, {}, {})}</button> <img class="w-30 h-30 rounded-full"${add_attribute("src", data.avatar, 0)} alt="${escape(data.username, true) + "'s profile avatar"}"> ` : `<button class="mb-3 rounded-full border-white border-0 transition-all duration-200 ease-in-out hover:border-2 hover:scale-105 " title="Click to edit profile avatar"><img class="w-30 h-30 rounded-full"${add_attribute("src", data.avatar, 0)} alt="${escape(data.username, true) + "'s profile avatar"}"></button>`}`}</div>  ${` ${data.owner && data.show_edit ? `<div class="w-full flex flex-row justify-between items-center"><h3 class="text-2xl font-bold mb-2">${escape(data.username)}</h3>  <button class="rounded-full w-min p-2 text-gray-400 border-gray-400 hover:text-white hover:border-white transition-all duration-200 ease-in-out" title="Edit username">${validate_component(Fa, "Fa").$$render($$result, { icon: faPen }, {}, {})}</button></div> ` : `  <button class="w-full border-0 border-white transition-all duration-200 ease-in-out hover:border hover:scale-105 " title="Click to edit username"><h3 class="m-0 text-2xl font-bold mb-2">${escape(data.username)}</h3></button>`}`}</div></main></div>`;
});
export {
  Page as default
};
