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
exports.edit_message = exports.delete_message = exports.add_message = exports.delete_chat = exports.get_chat = exports.exists_chat = exports.create_chat = void 0;
var crypto_1 = require("crypto");
var db_1 = require("./db");
/**
 *  Create a chat with the given users
 * @param users
 * @returns The chat object
 */
function create_chat(users) {
    return __awaiter(this, void 0, void 0, function () {
        var chat, _i, users_1, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exists_chat(users)];
                case 1:
                    if (_a.sent()) {
                        return [2 /*return*/];
                    }
                    chat = {
                        attachments: [],
                        last_message: null,
                        id: (0, crypto_1.randomUUID)(),
                        messages: [],
                        members: users
                    };
                    return [4 /*yield*/, db_1.db.collection("chats").insertOne(chat)];
                case 2:
                    _a.sent();
                    _i = 0, users_1 = users;
                    _a.label = 3;
                case 3:
                    if (!(_i < users_1.length)) return [3 /*break*/, 6];
                    user = users_1[_i];
                    return [4 /*yield*/, db_1.db.collection("users").updateOne({ username: user }, {
                            $push: {
                                chats: {
                                    id: chat.id,
                                    members: users
                                }
                            }
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.create_chat = create_chat;
/**
 * Find an existing chat between the given users
 * @param users
 * @returns The chat id or null if no chat exists
 */
function exists_chat(users) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.collection("chats").findOne({ members: { $all: users } }, { projection: { id: 1 } })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.exists_chat = exists_chat;
/**
 * Get a chat by id
 * Returns the last 30 messages
 * @param id
 * @returns The chat object
 */
function get_chat(id) {
    return __awaiter(this, void 0, void 0, function () {
        var chats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chats = db_1.db.collection("chats");
                    return [4 /*yield*/, chats.findOne({ id: id }, { projection: { _id: 0, messages: { $slice: -30 } } })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.get_chat = get_chat;
/**
 * Delete a chat
 * @param chat_id
 */
function delete_chat(chat_id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.collection("chats").deleteOne({ id: chat_id })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.delete_chat = delete_chat;
/**
 * MESSAGES --------------------------------------------------------------------
 */
/**
 * Add a message to a chat
 * @param chat_id
 * @param message
 */
function add_message(chat_id, message) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    message.id = (0, crypto_1.randomUUID)();
                    message.attachments || (message.attachments = []);
                    return [4 /*yield*/, db_1.db.collection("chats").updateOne({ id: chat_id }, { $push: { messages: message } })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.add_message = add_message;
/**
 * Delete a message from a chat
 * @param chat_id
 * @param message_id
 */
function delete_message(chat_id, message_id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.collection("chats").updateOne({ id: chat_id }, { $pull: { messages: { id: message_id } } })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.delete_message = delete_message;
/**
 * Edit a message from a chat
 * @param chat_id
 * @param message_id
 * @param new_message
 */
function edit_message(chat_id, message_id, new_message) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    new_message.id = (0, crypto_1.randomUUID)();
                    new_message.attachments || (new_message.attachments = []);
                    return [4 /*yield*/, db_1.db.collection("chats").updateOne({ id: chat_id, "messages.id": message_id }, { $set: { "messages.$": new_message } })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.edit_message = edit_message;
