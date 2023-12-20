import { c as create_ssr_component, b as subscribe, v as validate_component, e as escape, d as add_attribute, a as each, f as get_store_value } from "../../../../chunks/ssr.js";
import { w as writable } from "../../../../chunks/index2.js";
import { A as AvatarImage } from "../../../../chunks/AvatarImage.js";
import { faWarning, faMagnifyingGlass, faTimes, faCheck, faUserPlus, faCertificate, faCog } from "@fortawesome/free-solid-svg-icons";
import { F as Fa } from "../../../../chunks/fa.js";
import { F as FriendshipStatusType, R as Routes, S as Status } from "../../../../chunks/types.js";
import "../../../../chunks/websocket.js";
const RelationshipButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $friendship, $$unsubscribe_friendship;
  let { username } = $$props;
  let { friendship } = $$props;
  $$unsubscribe_friendship = subscribe(friendship, (value) => $friendship = value);
  let { other_user } = $$props;
  let { remove_friend } = $$props;
  if ($$props.username === void 0 && $$bindings.username && username !== void 0)
    $$bindings.username(username);
  if ($$props.friendship === void 0 && $$bindings.friendship && friendship !== void 0)
    $$bindings.friendship(friendship);
  if ($$props.other_user === void 0 && $$bindings.other_user && other_user !== void 0)
    $$bindings.other_user(other_user);
  if ($$props.remove_friend === void 0 && $$bindings.remove_friend && remove_friend !== void 0)
    $$bindings.remove_friend(remove_friend);
  $$unsubscribe_friendship();
  return ` ${$friendship === FriendshipStatusType.NONE || $friendship === FriendshipStatusType.REJECTED ? `<button class="ml-auto border-green-600 text-white rounded-lg py-1 px-4 w-auto float-right hover:bg-green-500">Add

		 ${$friendship === FriendshipStatusType.REJECTED ? `<p title="You previously rejected this user" class="inline">${validate_component(Fa, "Fa").$$render(
    $$result,
    {
      icon: faWarning,
      class: "text-yellow-600 text-lg inline"
    },
    {},
    {}
  )}</p>` : ``}</button> ` : `${$friendship === FriendshipStatusType.REQUESTED ? `<button class="ml-auto border-white text-white rounded-lg py-1 px-4 w-auto float-right hover:bg-red-500" data-svelte-h="svelte-eivj96">Cancel</button> ` : `${$friendship === FriendshipStatusType.FRIENDS ? `<button class="${"ml-auto text-white rounded-lg py-1 px-4 w-auto float-right border-white " + escape("bg-blue-500", true)}">${escape("Friends")}</button> ` : `${$friendship === FriendshipStatusType.WAS_REJECTED ? `<p class="ml-auto text-white rounded-lg py-1 px-4 w-auto float-right border-white bg-red-500" data-svelte-h="svelte-1a8t4x3">Your request was rejected</p>` : ``}`}`}`}`;
});
const css$3 = {
  code: ".grow-rotate.svelte-dsylrc{animation:svelte-dsylrc-grow 0.5s ease-in-out, svelte-dsylrc-rotate 3s ease-in-out infinite forwards;animation-delay:4s}@keyframes svelte-dsylrc-grow{50%{transform:scale(1.2)}}@keyframes svelte-dsylrc-rotate{50%{transform:rotate(65deg)}}",
  map: null
};
const SearchModal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $modal_open, $$unsubscribe_modal_open;
  let $state, $$unsubscribe_state;
  let $results, $$unsubscribe_results;
  var StateType = /* @__PURE__ */ ((StateType2) => {
    StateType2[StateType2["idle"] = 0] = "idle";
    StateType2[StateType2["searching"] = 1] = "searching";
    return StateType2;
  })(StateType || {});
  let { modal_open } = $$props;
  $$unsubscribe_modal_open = subscribe(modal_open, (value) => $modal_open = value);
  let { user } = $$props;
  let { remove_friend } = $$props;
  let query = "";
  let results = writable([]);
  $$unsubscribe_results = subscribe(results, (value) => $results = value);
  let state = writable(0);
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  if ($$props.modal_open === void 0 && $$bindings.modal_open && modal_open !== void 0)
    $$bindings.modal_open(modal_open);
  if ($$props.user === void 0 && $$bindings.user && user !== void 0)
    $$bindings.user(user);
  if ($$props.remove_friend === void 0 && $$bindings.remove_friend && remove_friend !== void 0)
    $$bindings.remove_friend(remove_friend);
  $$result.css.add(css$3);
  $$unsubscribe_modal_open();
  $$unsubscribe_state();
  $$unsubscribe_results();
  return `<button class="border-none p-1 mx-1 grow-rotate w-auto svelte-dsylrc" title="Search for users">${validate_component(Fa, "Fa").$$render(
    $$result,
    {
      icon: faMagnifyingGlass,
      class: "text-2xl text-#888 mr-2 hover:text-white"
    },
    {},
    {}
  )}</button> ${$modal_open ? ` <div class="fixed inset-0 z-10 overflow-auto bg-black bg-opacity-40"><div class="absolute top-3 left-1/2 transform -translate-x-1/2 mt-2"><button class="border-white text-white rounded-full p-2 hover:bg-slate-600">${validate_component(Fa, "Fa").$$render($$result, { icon: faTimes }, {}, {})}</button></div> <div class="bg-gray-800 m-auto mt-24 p-5 rounded-md border border-gray-700 w-4/5"><div class="mb-5"> <input autofocus type="text" placeholder="Search for some user" class="${"w-full p-2 border-white outline-none rounded-md max-h-max " + escape($state === StateType.searching ? "cursor-wait" : "", true)}"${add_attribute("value", query, 0)}></div> <div class="container flex flex-col"><ol> ${!$results ? `<p class="text-gray-400" data-svelte-h="svelte-1h5nyls">Nothing here...</p>` : `${each($results, (result) => {
    return `<button title="${"Search result: " + escape(result.username, true)}" class="w-full border-none hover:bg-gray-700 p-1 flex justify-center items-center"><li class="flex items-center justify-center mb-2 p-2 rounded-md w-full ">${validate_component(AvatarImage, "AvatarImage").$$render($$result, { username: result.username }, {}, {})} <p class="ml-2">${escape(result.username)}</p> ${validate_component(RelationshipButton, "RelationshipButton").$$render(
      $$result,
      {
        username: user.username,
        friendship: result.friendship,
        other_user: result.username,
        remove_friend
      },
      {},
      {}
    )}</li> </button>`;
  })}`}</ol></div></div></div>` : ``}`;
});
const RequestItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { username } = $$props;
  let { requester } = $$props;
  let { remove_request } = $$props;
  let { add_friend } = $$props;
  if ($$props.username === void 0 && $$bindings.username && username !== void 0)
    $$bindings.username(username);
  if ($$props.requester === void 0 && $$bindings.requester && requester !== void 0)
    $$bindings.requester(requester);
  if ($$props.remove_request === void 0 && $$bindings.remove_request && remove_request !== void 0)
    $$bindings.remove_request(remove_request);
  if ($$props.add_friend === void 0 && $$bindings.add_friend && add_friend !== void 0)
    $$bindings.add_friend(add_friend);
  return `<button class="border-none bg-none w-full m-1" title="${"Friend request from " + escape(requester, true)}"><li class="h-full flex items-center rounded-md w-full p-0 py-1 pl-2 hover:bg-gray-700 ">${validate_component(AvatarImage, "AvatarImage").$$render($$result, { username: requester }, {}, {})} <p class="ml-2 text-lg">${escape(requester)}</p> <div class="flex items-center justify-end w-full h-full p-0"> <button class="w-auto h-full m-0 p-3 rounded-sm hover:bg-red-600 hover:text-white border-none " title="Reject request">${validate_component(Fa, "Fa").$$render($$result, { icon: faTimes, class: "mx-1 text-2xl" }, {}, {})}</button>  <button class="w-auto h-full m-0 p-3 rounded-sm hover:bg-green-600 hover:text-white border-none " title="Accept request">${validate_component(Fa, "Fa").$$render($$result, { icon: faCheck, class: "text-2xl" }, {}, {})}</button></div></li></button>`;
});
const css$2 = {
  code: ".bright.svelte-8ok0sg{animation:svelte-8ok0sg-bright 3s infinite}@keyframes svelte-8ok0sg-bright{0%{filter:brightness(0.5)}50%{filter:brightness(1.5)}100%{filter:brightness(0.5)}}",
  map: null
};
const PendingRequests = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $requests, $$unsubscribe_requests;
  let $modal_open, $$unsubscribe_modal_open;
  let { requests } = $$props;
  $$unsubscribe_requests = subscribe(requests, (value) => $requests = value);
  let { friends } = $$props;
  let { username } = $$props;
  let modal_open = writable(false);
  $$unsubscribe_modal_open = subscribe(modal_open, (value) => $modal_open = value);
  const remove_request = (username2) => {
    requests.update(() => $requests.filter((request) => request != username2));
  };
  const add_friend = (username2) => {
    friends.update((friends2) => [username2, ...friends2]);
  };
  if ($$props.requests === void 0 && $$bindings.requests && requests !== void 0)
    $$bindings.requests(requests);
  if ($$props.friends === void 0 && $$bindings.friends && friends !== void 0)
    $$bindings.friends(friends);
  if ($$props.username === void 0 && $$bindings.username && username !== void 0)
    $$bindings.username(username);
  $$result.css.add(css$2);
  $$unsubscribe_requests();
  $$unsubscribe_modal_open();
  return `${$modal_open ? `<div class="fixed inset-0 z-10 overflow-auto bg-black bg-opacity-40"><div class="absolute top-3 left-1/2 transform -translate-x-1/2 mt-2"><button class="border-white text-white rounded-full p-2 hover:bg-slate-600">${validate_component(Fa, "Fa").$$render($$result, { icon: faTimes }, {}, {})}</button></div> <div class="flex flex-col items-center bg-gray-800 m-auto mt-24 p-2 rounded-md border border-gray-700 w-4/5 max-w-screen-xl"><h3 class="text-xl text-gray-100 mb-2" data-svelte-h="svelte-1ozeatd">Pending requests</h3> <ol class="w-full">${each($requests, (requester) => {
    return `${validate_component(RequestItem, "RequestItem").$$render(
      $$result,
      {
        username,
        requester,
        remove_request,
        add_friend
      },
      {},
      {}
    )}`;
  })}</ol></div></div>` : `<button class="bright border-none p-1 mx-1 grow-rotate w-auto svelte-8ok0sg" title="Pending requests">${validate_component(Fa, "Fa").$$render($$result, { icon: faUserPlus, class: "text-2xl" }, {}, {})}</button>`}`;
});
const css$1 = {
  code: ".bottom-bar.svelte-5hu0jj{position:fixed;bottom:0;left:0;width:100%;transition:transform 0.3s ease}",
  map: null
};
const BottomBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { username } = $$props;
  let { verified } = $$props;
  if ($$props.username === void 0 && $$bindings.username && username !== void 0)
    $$bindings.username(username);
  if ($$props.verified === void 0 && $$bindings.verified && verified !== void 0)
    $$bindings.verified(verified);
  $$result.css.add(css$1);
  return `  <div class="bottom-bar flex p-2 items-center justify-center svelte-5hu0jj"><div class="contanier w-8/12 p-2 rounded-lg bg-gray-800"><div class="flex justify-between items-center"> <a href="${escape(Routes.PROFILE, true) + "/" + escape(username, true)}" class="rotate text-gray-400 hover:text-gray-100" title="Profile">${validate_component(AvatarImage, "AvatarImage").$$render($$result, { username }, {}, {})}</a> <p class="inline text-gray-30 font-normal text-lg mr-4">${escape(username)} <span title="Verified">${verified ? `${validate_component(Fa, "Fa").$$render(
    $$result,
    {
      icon: faCertificate,
      class: "inline text-purple-500 text-sm"
    },
    {},
    {}
  )}` : ``}</span></p></div></div> </div>`;
});
const css = {
  code: ".rotate.svelte-33kfmv{animation:svelte-33kfmv-rotate 15s linear infinite}@keyframes svelte-33kfmv-rotate{0%{transform:rotate(0deg)}30%{transform:rotate(180deg)}60%{transform:rotate(0deg)}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $friends, $$unsubscribe_friends;
  let $requests, $$unsubscribe_requests;
  let { data } = $$props;
  let user = data.user;
  let requests = writable(user.pending_requests);
  $$unsubscribe_requests = subscribe(requests, (value) => $requests = value);
  let searching = writable(false);
  let friends = writable(user.friends);
  $$unsubscribe_friends = subscribe(friends, (value) => $friends = value);
  let friend_status = {};
  for (let friend of user.friends) {
    friend_status[friend] = writable(Status.OFFLINE);
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  $$unsubscribe_friends();
  $$unsubscribe_requests();
  return `<div class="container"><nav class="mt-2 flex justify-between items-center w-full p-2 border-b border-gray-700">${$requests.length > 0 ? `${validate_component(PendingRequests, "PendingRequests").$$render(
    $$result,
    {
      username: user.username,
      requests,
      friends
    },
    {},
    {}
  )}` : ``} ${validate_component(SearchModal, "SearchModal").$$render(
    $$result,
    {
      modal_open: searching,
      user,
      remove_friend: (username) => {
        friends.update((contacts) => contacts.filter((contact) => contact !== username));
      }
    },
    {},
    {}
  )} <a${add_attribute("href", Routes.SETTINGS, 0)} class="rotate text-gray-400 hover:text-gray-100 svelte-33kfmv" title="Settings">${validate_component(Fa, "Fa").$$render($$result, { icon: faCog, class: "text-2xl" }, {}, {})}</a></nav> <div class="rounded-sm w-full mt-4 flex flex-col justify-center items-start p-2 overflow-y-hidden overflow-x-auto ">${each($friends, (friend) => {
    return ` <a class="w-full p-1" href="${escape(Routes.CHAT_REDIRECT, true) + "/" + escape(friend, true)}"><div class="flex items-center justify-start rounded-md p-2 transition-colors hover:bg-gray-700 cursor-pointer w-full ">${validate_component(AvatarImage, "AvatarImage").$$render($$result, { username: friend }, {}, {})} <h4 class="ml-4 font-normal text-lg text-gray-200">${escape(friend)}</h4> <span class="mx-2 text-gray-500" data-svelte-h="svelte-1fp6drv">-</span> <p class="${escape(get_store_value(friend_status[friend]), true) + " text-gray-400 text-sm svelte-33kfmv"}">${escape(get_store_value(friend_status[friend]))} </p></div> </a>`;
  })} ${$friends.length === 0 ? `<div class="text-gray-400 text-center w-full" data-svelte-h="svelte-t0dwgu"><h4 class="text-xl">No friends yet</h4> <p class="text-md">Search for people to add them as friends</p></div>` : ``}</div></div> ${validate_component(BottomBar, "BottomBar").$$render(
    $$result,
    {
      username: data.user.username,
      verified: data.user.verified
    },
    {},
    {}
  )}`;
});
export {
  Page as default
};
