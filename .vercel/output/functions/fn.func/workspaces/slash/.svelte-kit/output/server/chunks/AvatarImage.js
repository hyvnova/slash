import { c as create_ssr_component, b as subscribe, d as add_attribute, e as escape } from "./ssr.js";
import { w as writable } from "./index2.js";
const cached_images = writable({});
const AvatarImage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_cached_images;
  $$unsubscribe_cached_images = subscribe(cached_images, (value) => value);
  let { username } = $$props;
  let { use_cache = true } = $$props;
  let url = `/avatar/${username}`;
  if ($$props.username === void 0 && $$bindings.username && username !== void 0)
    $$bindings.username(username);
  if ($$props.use_cache === void 0 && $$bindings.use_cache && use_cache !== void 0)
    $$bindings.use_cache(use_cache);
  $$unsubscribe_cached_images();
  return `<img${add_attribute("src", url, 0)} alt="${escape(username, true) + "'s Slash Avatar"}" class="max-w-[2.5em] max-h-[2.5em] rounded-full" loading="lazy">`;
});
export {
  AvatarImage as A,
  cached_images as c
};
