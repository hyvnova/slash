"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var socket_1 = require("./db/socket");
function injectSocketIO(server) {
    var _this = this;
    server.maxHttpBufferSize = 1e6; // 10MB 
    var io = new socket_io_1.Server(server);
    io.on('connection', function (socket) {
        socket.on("user connect" /* Events.CONNECT */, function (username) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        socket.join(username);
                        return [4 /*yield*/, (0, socket_1.connect)(socket.id, username)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        socket.on("handshake" /* Events.HANDSHAKE */, function (callback) { callback(true); });
        socket.on('disconnect', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, socket_1.disconnect)(socket.id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        /**
         * Join Chat
         */
        socket.on("join chat" /* Events.JOIN_CHAT */, function (chat_id, username) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, members;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, socket_1.get_username)(socket.id)];
                    case 1:
                        if (!!(_d.sent())) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, socket_1.connect)(socket.id, username)];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        // Leave all other rooms
                        Object.keys(socket.rooms).forEach(function (room) {
                            if (room !== socket.id && room !== chat_id && room !== username) {
                                socket.leave(room);
                            }
                        });
                        socket.join(chat_id);
                        // Emit online status to all members of the chat
                        _b = (_a = io.to(chat_id)).emit;
                        _c = ["status" /* Events.STATUS */];
                        return [4 /*yield*/, (0, socket_1.get_username)(socket.id)];
                    case 4:
                        // Emit online status to all members of the chat
                        _b.apply(_a, _c.concat([_d.sent(), "online" /* Status.ONLINE */]));
                        return [4 /*yield*/, (0, socket_1.get_online_members)(chat_id)];
                    case 5:
                        members = _d.sent();
                        members.forEach(function (member) {
                            io.to(socket.id).emit("status" /* Events.STATUS */, member.username, member.status);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        /**
         * Receive Status
         * username - user who sent the status
         * status - status of the user
         */
        socket.on("status" /* Events.STATUS */, function (username, status) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("status", username, status);
                        return [4 /*yield*/, (0, socket_1.is_online)(socket.id)];
                    case 1:
                        if (_a.sent()) {
                            console.log("status", username, status);
                            io.to(socket.id).emit("status" /* Events.STATUS */, username, status);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        /**
         * Set Status
         */
        socket.on("set status" /* Events.SET_STATUS */, function (status, friends) { return __awaiter(_this, void 0, void 0, function () {
            var username;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, socket_1.get_username)(socket.id)];
                    case 1:
                        username = _a.sent();
                        if (!username) {
                            return [2 /*return*/];
                        }
                        // Set status
                        return [4 /*yield*/, (0, socket_1.set_status)(username, status)];
                    case 2:
                        // Set status
                        _a.sent();
                        friends.forEach(function (friend) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, socket_1.is_online)(friend)];
                                    case 1:
                                        if (_a.sent()) {
                                            io.to(friend).emit("status" /* Events.STATUS */, username, status);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        }); });
        /**
         * Get status of friends
         */
        socket.on("get friends status" /* Events.GET_FRIENDS_STATUS */, function (friends) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                friends.forEach(function (friend) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _b = (_a = io.to(socket.id)).emit;
                                _c = ["status" /* Events.STATUS */, friend];
                                return [4 /*yield*/, (0, socket_1.get_status)(friend)];
                            case 1:
                                _b.apply(_a, _c.concat([_d.sent()]));
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        /**
         * Friend Requests
         * Used to update other's friend requests UI on the fly
         */
        var friend_requests_states = [
            "new friend request" /* Events.NEW_FRIEND_REQUEST */,
            "cancel friend request" /* Events.CANCEL_FRIEND_REQUEST */,
            "accept friend request" /* Events.ACCEPT_FRIEND_REQUEST */,
            "reject friend request" /* Events.REJECT_FRIEND_REQUEST */,
        ];
        var _loop_1 = function (state) {
            socket.on(state, function (friend) { return __awaiter(_this, void 0, void 0, function () {
                var username;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, socket_1.get_username)(socket.id)];
                        case 1:
                            username = _a.sent();
                            return [4 /*yield*/, (0, socket_1.is_online)(friend)];
                        case 2:
                            if (_a.sent()) {
                                io.to(friend).emit(state, username);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        for (var _i = 0, friend_requests_states_1 = friend_requests_states; _i < friend_requests_states_1.length; _i++) {
            var state = friend_requests_states_1[_i];
            _loop_1(state);
        }
        socket.on("unfriend" /* Events.UNFRIEND */, function (friend) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, socket_1.is_online)(friend)];
                    case 1:
                        if (!_d.sent()) return [3 /*break*/, 3];
                        _b = (_a = io.to(friend)).emit;
                        _c = ["unfriend" /* Events.UNFRIEND */];
                        return [4 /*yield*/, (0, socket_1.get_username)(socket.id)];
                    case 2:
                        _b.apply(_a, _c.concat([_d.sent()]));
                        _d.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        /**
         * Messages: send, delete, edit
         */
        socket.on("new message" /* Events.NEW_MESSAGE */, function (chat_id, message) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                io.to(chat_id).emit("new message" /* Events.NEW_MESSAGE */, message);
                return [2 /*return*/];
            });
        }); });
        socket.on("delete message" /* Events.DELETE_MESSAGE */, function (chat_id, message_id) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                io.to(chat_id).emit("delete message" /* Events.DELETE_MESSAGE */, message_id);
                return [2 /*return*/];
            });
        }); });
        socket.on("edit message" /* Events.EDIT_MESSAGE */, function (chat_id, message) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                io.to(chat_id).emit("edit message" /* Events.EDIT_MESSAGE */, message);
                return [2 /*return*/];
            });
        }); });
    });
}
exports.default = injectSocketIO;
