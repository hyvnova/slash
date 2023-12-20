import { c as create_ssr_component, e as escape, a as each, b as subscribe, v as validate_component } from "../../chunks/ssr.js";
import { u as user_config } from "../../chunks/user_config.js";
const calculateRgba = (color, opacity) => {
  if (color[0] === "#") {
    color = color.slice(1);
  }
  if (color.length === 3) {
    let res = "";
    color.split("").forEach((c) => {
      res += c;
      res += c;
    });
    color = res;
  }
  const rgbValues = (color.match(/.{2}/g) || []).map((hex) => parseInt(hex, 16)).join(", ");
  return `rgba(${rgbValues}, ${opacity})`;
};
const range = (size, startAt = 0) => [...Array(size).keys()].map((i) => i + startAt);
const css$1 = {
  code: ".wrapper.svelte-bnawe9{height:calc(var(--size) / 15);width:calc(var(--size) * 2);background-color:var(--rgba);position:relative;overflow:hidden;background-clip:padding-box}.lines.svelte-bnawe9{height:calc(var(--size) / 15);background-color:var(--color)}.small-lines.svelte-bnawe9{position:absolute;overflow:hidden;background-clip:padding-box;display:block;border-radius:2px;will-change:left, right;animation-fill-mode:forwards}.small-lines.\\31 .svelte-bnawe9{animation:var(--duration) cubic-bezier(0.65, 0.815, 0.735, 0.395) 0s infinite normal none\n			running svelte-bnawe9-long}.small-lines.\\32 .svelte-bnawe9{animation:var(--duration) cubic-bezier(0.165, 0.84, 0.44, 1) calc((var(--duration) + 0.1) / 2)\n			infinite normal none running svelte-bnawe9-short}.pause-animation.svelte-bnawe9{animation-play-state:paused}@keyframes svelte-bnawe9-long{0%{left:-35%;right:100%}60%{left:100%;right:-90%}100%{left:100%;right:-90%}}@keyframes svelte-bnawe9-short{0%{left:-200%;right:100%}60%{left:107%;right:-8%}100%{left:107%;right:-8%}}",
  map: null
};
const BarLoader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "#FF3E00" } = $$props;
  let { unit = "px" } = $$props;
  let { duration = "2.1s" } = $$props;
  let { size = "60" } = $$props;
  let { pause = false } = $$props;
  let rgba;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.pause === void 0 && $$bindings.pause && pause !== void 0)
    $$bindings.pause(pause);
  $$result.css.add(css$1);
  rgba = calculateRgba(color, 0.2);
  return `<div class="wrapper svelte-bnawe9" style="${"--size: " + escape(size, true) + escape(unit, true) + "; --rgba:" + escape(rgba, true)}">${each(range(2, 1), (version) => {
    return `<div class="${[
      "lines small-lines " + escape(version, true) + " svelte-bnawe9",
      pause ? "pause-animation" : ""
    ].join(" ").trim()}" style="${"--color: " + escape(color, true) + "; --duration: " + escape(duration, true) + ";"}"></div>`;
  })} </div>`;
});
function client_method(key) {
  {
    if (key === "before_navigate" || key === "after_navigate" || key === "on_navigate" || key === "push_state" || key === "replace_state") {
      return () => {
      };
    } else {
      const name_lookup = {
        disable_scroll_handling: "disableScrollHandling",
        preload_data: "preloadData",
        preload_code: "preloadCode",
        invalidate_all: "invalidateAll"
      };
      return () => {
        throw new Error(`Cannot call ${name_lookup[key] ?? key}(...) on the server`);
      };
    }
  }
}
const beforeNavigate = /* @__PURE__ */ client_method("before_navigate");
const afterNavigate = /* @__PURE__ */ client_method("after_navigate");
const css = {
  code: ".svelte-xgivsu{font-family:'Noto Color Emoji', Arial, Helvetica, sans-serif}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user_config, $$unsubscribe_user_config;
  $$unsubscribe_user_config = subscribe(user_config, (value) => $user_config = value);
  let isLoading = false;
  beforeNavigate(({ to }) => isLoading = !!to?.route.id);
  afterNavigate(() => isLoading = false);
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  $$unsubscribe_user_config();
  return `${isLoading ? `${validate_component(BarLoader, "BarLoader").$$render($$result, {}, {}, {})}` : ``} <div class="svelte-xgivsu"><div style="${"font-family:" + escape($user_config.font, true) + " !important; font-size:" + escape($user_config.font_size, true) + "px !important;"}" class="svelte-xgivsu">${slots.default ? slots.default({}) : ``}</div></div>`;
});
export {
  Layout as default
};
