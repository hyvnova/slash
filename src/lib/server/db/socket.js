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
exports.get_socket_id = exports.get_online_members = exports.is_online = exports.get_username = exports.disconnect = exports.connect = exports.set_status = exports.get_status = exports.exists = exports.create_user_online = void 0;
var chat_1 = require("./chat");
var db_1 = require("./db");
/**
 * Create "online" collection if it doesn't exist
 */
var collection = db_1.db.collection("online");
await collection.createIndex({ username: 1 }, { unique: true });
/**
 * Create a user online record
 * @param username
 * @returns
 */
function create_user_online(username) {
    return __awaiter(this, void 0, void 0, function () {
        var collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    collection = db_1.db.collection("online");
                    return [4 /*yield*/, collection.insertOne({
                            username: username,
                            socket_id: "",
                            status: "offline" /* Status.OFFLINE */
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.create_user_online = create_user_online;
/**
 * Check if record exists
 * @param username
 * @returns boolean
 */
function exists(username) {
    return __awaiter(this, void 0, void 0, function () {
        var collection, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    collection = db_1.db.collection("online");
                    return [4 /*yield*/, collection.findOne({
                            username: username
                        }, {
                            projection: {
                                username: 1
                            }
                        })];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, user !== null];
            }
        });
    });
}
exports.exists = exists;
/**
 * Get the status of a user
 * @param username - The username of the user
 * @returns The status of the user or null if the user doesn't exist
 */
function get_status(username) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var collection, user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    collection = db_1.db.collection("online");
                    return [4 /*yield*/, exists(username)];
                case 1:
                    if (!!(_b.sent())) return [3 /*break*/, 3];
                    return [4 /*yield*/, create_user_online(username)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [4 /*yield*/, collection.findOne({
                        username: username
                    }, {
                        projection: {
                            status: 1
                        }
                    })];
                case 4:
                    user = _b.sent();
                    return [2 /*return*/, (_a = user === null || user === void 0 ? void 0 : user.status) !== null && _a !== void 0 ? _a : "offline" /* Status.OFFLINE */];
            }
        });
    });
}
exports.get_status = get_status;
/**
 * Set the status of a user
 * @param username - The username of the user
 * @param status - The status of the user
 * @returns The status of the user or null if the user doesn't exist
 */
function set_status(username, status) {
    return __awaiter(this, void 0, void 0, function () {
        var collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    collection = db_1.db.collection("online");
                    return [4 /*yield*/, exists(username)];
                case 1:
                    if (!!(_a.sent())) return [3 /*break*/, 3];
                    return [4 /*yield*/, create_user_online(username)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: 
                // Update the user
                return [4 /*yield*/, collection.updateOne({
                        username: username
                    }, {
                        $set: {
                            status: status
                        }
                    })];
                case 4:
                    // Update the user
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.set_status = set_status;
/**
 * log a user socket connection - used for online status
 * @param socket_id - The socket id of the user
 * @param username - The username of the user
 */
function connect(socket_id, username) {
    return __awaiter(this, void 0, void 0, function () {
        var collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    collection = db_1.db.collection("online");
                    // Update the user
                    return [4 /*yield*/, collection.updateOne({
                            username: username
                        }, {
                            $set: {
                                socket_id: socket_id,
                                status: "online" /* Status.ONLINE */
                            }
                        })];
                case 1:
                    // Update the user
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.connect = connect;
/**
 * log a user socket disconnection - used for online status
 * @param socket_id - The socket id of the user
 */
function disconnect(socket_id) {
    return __awaiter(this, void 0, void 0, function () {
        var collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    collection = db_1.db.collection("online");
                    // Update the user
                    return [4 /*yield*/, collection.updateOne({
                            socket_id: socket_id
                        }, {
                            $set: {
                                socket_id: "",
                                status: "offline" /* Status.OFFLINE */
                            }
                        })];
                case 1:
                    // Update the user
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.disconnect = disconnect;
/**
 * Get the username of a user from their socket id
 * @param socket_id - The socket id of the user
 * @returns The username of the user or null if the user doesn't exist
*/
function get_username(socket_id) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var collection, user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    collection = db_1.db.collection("online");
                    return [4 /*yield*/, collection.findOne({
                            socket_id: socket_id
                        }, {
                            projection: {
                                username: 1
                            }
                        })];
                case 1:
                    user = _b.sent();
                    return [2 /*return*/, (_a = user === null || user === void 0 ? void 0 : user.username) !== null && _a !== void 0 ? _a : null];
            }
        });
    });
}
exports.get_username = get_username;
/**
 * Check if a user is online
 * @param username - The username of the user
 * @returns True if the user is online, otherwise false
 */
function is_online(identifier) {
    return __awaiter(this, void 0, void 0, function () {
        var collection, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    collection = db_1.db.collection("online");
                    return [4 /*yield*/, collection.findOne({
                            $or: [
                                { username: identifier },
                                { socket_id: identifier }
                            ]
                        }, {
                            projection: {
                                status: 1
                            }
                        })];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, (user === null || user === void 0 ? void 0 : user.status) == "online" /* Status.ONLINE */];
            }
        });
    });
}
exports.is_online = is_online;
/**
 * Get online chat members
 * @param chat_id - The id of the chat
 * @returns An array of online members
 */
function get_online_members(chat_id) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var collection, members, _c, _d;
        var _e, _f;
        var _this = this;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    collection = db_1.db.collection("online");
                    _d = (_c = collection).find;
                    _e = {};
                    _f = {};
                    return [4 /*yield*/, (0, chat_1.get_chat)(chat_id)];
                case 1: return [4 /*yield*/, _d.apply(_c, [(_e.username = (_f.$in = (_b = (_a = (_g.sent())) === null || _a === void 0 ? void 0 : _a.members) !== null && _b !== void 0 ? _b : [],
                            _f),
                            _e), {
                            projection: {
                                username: 1
                            }
                        }]).toArray()];
                case 2:
                    members = _g.sent();
                    // Filter out offline members
                    return [2 /*return*/, members.filter(function (members) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = members.username !== null;
                                    if (!_a) return [3 /*break*/, 2];
                                    return [4 /*yield*/, is_online(members.username)];
                                case 1:
                                    _a = (_b.sent());
                                    _b.label = 2;
                                case 2: return [2 /*return*/, _a];
                            }
                        }); }); })];
            }
        });
    });
}
exports.get_online_members = get_online_members;
/**
 * Get socket id of a user
 * @param username - The username of the user
 * @returns The socket id of the user or null if the user doesn't exist
 */
function get_socket_id(username) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var collection, user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    collection = db_1.db.collection("online");
                    return [4 /*yield*/, collection.findOne({
                            username: username
                        }, {
                            projection: {
                                socket_id: 1
                            }
                        })];
                case 1:
                    user = _b.sent();
                    return [2 /*return*/, (_a = user === null || user === void 0 ? void 0 : user.socket_id) !== null && _a !== void 0 ? _a : null];
            }
        });
    });
}
exports.get_socket_id = get_socket_id;
