const BASE = "/app";
var Routes = ((Routes2) => {
  Routes2["HOME"] = BASE + "/me";
  Routes2["SETTINGS"] = BASE + "/me/settings";
  Routes2["CHAT"] = BASE + "/chat";
  Routes2["CHAT_REDIRECT"] = BASE + "/me/chat";
  Routes2["PROFILE"] = BASE + "/profile";
  return Routes2;
})(Routes || {});
var Status = /* @__PURE__ */ ((Status2) => {
  Status2["OFFLINE"] = "offline";
  Status2["ONLINE"] = "online";
  Status2["TYPING"] = "typing";
  return Status2;
})(Status || {});
var FriendshipStatusType = /* @__PURE__ */ ((FriendshipStatusType2) => {
  FriendshipStatusType2["NONE"] = "none";
  FriendshipStatusType2["FRIENDS"] = "friends";
  FriendshipStatusType2["REQUESTED"] = "requested";
  FriendshipStatusType2["REJECTED"] = "rejected";
  FriendshipStatusType2["WAS_REJECTED"] = "was_rejected";
  return FriendshipStatusType2;
})(FriendshipStatusType || {});
var FileLoadState = /* @__PURE__ */ ((FileLoadState2) => {
  FileLoadState2[FileLoadState2["LOADING"] = 0] = "LOADING";
  FileLoadState2[FileLoadState2["LOADED"] = 1] = "LOADED";
  FileLoadState2[FileLoadState2["FAILED"] = 2] = "FAILED";
  return FileLoadState2;
})(FileLoadState || {});
export {
  FriendshipStatusType as F,
  Routes as R,
  Status as S,
  FileLoadState as a
};
