import { c as create_ssr_component, b as subscribe, e as escape } from "./ssr.js";
import { w as writable } from "./index2.js";
const notification = writable(null);
const Notification = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $notification, $$unsubscribe_notification;
  $$unsubscribe_notification = subscribe(notification, (value) => $notification = value);
  let card_styles = {
    error: "bg-black border border-red-400 text-red-700",
    info: "bg-black border border-blue-400 text-blue-700"
  };
  {
    if ($notification?.duration) {
      setTimeout(
        () => {
          notification.set(null);
        },
        $notification.duration
      );
    }
  }
  $$unsubscribe_notification();
  return `${$notification ? `<div class="${"w-10/12 relative top-0 left-0 flex flex-col justify-center items-center p-2 m-4 rounded-lg z-50 mx-auto " + escape(card_styles[$notification.type], true)}"><h3>${escape($notification.title)}</h3> <p>${escape($notification.message)}</p></div>` : ``}`;
});
export {
  Notification as N,
  notification as n
};
