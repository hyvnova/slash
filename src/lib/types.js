"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendshipStatusType = void 0;
var BASE = "/app"; /* Base route, where the app is hosted. Accessed after login. */
/**
 * Represents the relationship between two users
 */
var FriendshipStatusType;
(function (FriendshipStatusType) {
    FriendshipStatusType["NONE"] = "none";
    FriendshipStatusType["FRIENDS"] = "friends";
    FriendshipStatusType["REQUESTED"] = "requested";
    FriendshipStatusType["REJECTED"] = "rejected";
    FriendshipStatusType["WAS_REJECTED"] = "was_rejected"; // for rejected side; after rejecting a friend request
})(FriendshipStatusType || (exports.FriendshipStatusType = FriendshipStatusType = {}));
