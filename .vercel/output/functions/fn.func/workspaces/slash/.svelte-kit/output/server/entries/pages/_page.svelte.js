import { c as create_ssr_component, v as validate_component, d as add_attribute } from "../../chunks/ssr.js";
import { n as notification, N as Notification } from "../../chunks/Notification.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let username = "";
  let password = "";
  let { form } = $$props;
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  {
    if (form) {
      notification.set({
        title: "Couldn't log in",
        message: form.error,
        type: "error",
        duration: 5e3
      });
    }
  }
  return `<main class="container h-screen flex flex-col justify-center items-center" title="Login or sing up page"> ${validate_component(Notification, "Notification").$$render($$result, {}, {}, {})} <header class="mb-4" data-svelte-h="svelte-vfowd5"><h1 class="text-4xl">Join</h1> <p>Enter your credentials to <strong>log in</strong> or <strong>sign up</strong>.</p></header>  <div class="flex flex-row w-10/12 justify-center items-center"><section class="w-max"><form title="Login or sing up form" class="m-2 flex flex-col justify-center items-center" action="/" method="POST"> <input class="hover:border-blue-700" type="text" title="username" placeholder="some_username78" minlength="1" maxlength="16" required autofocus name="username" autocomplete="username" pattern="[a-z0-9_]+"${add_attribute("value", username, 0)}> <input class="hover:border-blue-700" type="password" title="password" placeholder="password" minlength="4" maxlength="128" required name="password" autocomplete="current-password"${add_attribute("value", password, 0)}> <button type="submit" class="mt-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border-blue-700" title="Submit" data-svelte-h="svelte-1pwz8km">Submit</button></form></section></div></main> <footer class="absolute w-full text-center" data-svelte-h="svelte-1296ewl"><p class="text-sm text-gray-500">Made with <span class="text-red-500">♥</span> by
		<a href="https://github.com/ezsnova/"><strong>NoVa</strong></a></p></footer>`;
});
export {
  Page as default
};
