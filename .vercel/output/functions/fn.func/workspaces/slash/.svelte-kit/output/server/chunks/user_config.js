import { w as writable } from "./index2.js";
const FONTS = [
  "Ubuntu",
  "Roboto",
  "Open Sans",
  "Writer",
  "Fira Code",
  "Fira Sans"
];
const default_value = {
  font: "Ubuntu",
  font_size: 16,
  background: {
    type: "color",
    value: "transparent"
  }
};
const initial_value = default_value;
const user_config = writable(initial_value);
user_config.subscribe((value) => {
});
export {
  FONTS as F,
  user_config as u
};
