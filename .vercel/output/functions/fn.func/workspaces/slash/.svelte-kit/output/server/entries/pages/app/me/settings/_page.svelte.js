import { c as create_ssr_component, b as subscribe, d as add_attribute, v as validate_component, a as each, e as escape } from "../../../../../chunks/ssr.js";
import { u as user_config, F as FONTS } from "../../../../../chunks/user_config.js";
import { R as Routes } from "../../../../../chunks/types.js";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { F as Fa } from "../../../../../chunks/fa.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user_config, $$unsubscribe_user_config;
  $$unsubscribe_user_config = subscribe(user_config, (value) => $user_config = value);
  $$unsubscribe_user_config();
  return `<div class="container"><nav class="mt-2 flex justify-between items-center w-full p-2 border-b border-gray-700"><a${add_attribute("href", Routes.HOME, 0)} class="rotate text-gray-400 hover:text-gray-100">${validate_component(Fa, "Fa").$$render($$result, { icon: faHome, class: "text-2xl" }, {}, {})}</a></nav></div> <main class="container flex flex-col justify-center items-center w-full h-full mt-6"><h1 class="text-4xl text-gray-200 mb-4" data-svelte-h="svelte-m6i4uw">Settings</h1> <hr>  <section class="container flex flex-col justify-center items-center w-full bg-gray-800 rounded-md p-4 mt-4"><h2 class="text-2xl text-gray-200 m-1" data-svelte-h="svelte-hs21ma">Appearance</h2>  <label for="font-family" class="text-gray-300 m-1" data-svelte-h="svelte-hkqfqk">Font family</label> <select class="p-2 border-gray-700 rounded-md text-gray-200 w-64 m-1">${each(FONTS, (font) => {
    return `<option${add_attribute("value", font, 0)}>${escape(font)}</option>`;
  })}</select>  <label for="font-size" class="text-gray-300 m-1" data-svelte-h="svelte-1cxmm0y">Font size</label> <input type="number" min="8" max="32" class="p-2 border-gray-700 rounded-md text-gray-200 m-1 max-w-[5em]"${add_attribute("value", $user_config.font_size, 0)}> </section>  <section class="container flex flex-col justify-center items-center w-full bg-gray-800 rounded-md p-4 mt-4"><h2 class="text-2xl text-gray-200 m-1" data-svelte-h="svelte-5za1pj">Account</h2> <p class="text-gray-300 m-1" data-svelte-h="svelte-1wscu7y">Manage your account settings. Be careful some of these actions are <strong>irreversible.</strong></p> <div class="container flex flex-row justify-center items-center flex-wrap w-full"><button class="p-2 border-yellow-500 hover:bg-yellow-500 rounded-md text-white w-32 m-1" data-svelte-h="svelte-iek189">Logout</button> <button class="p-2 border-red-500 hover:bg-red-500 rounded-md text-white w-32 m-1" data-svelte-h="svelte-1wzffwd">Delete</button></div></section></main>`;
});
export {
  Page as default
};
