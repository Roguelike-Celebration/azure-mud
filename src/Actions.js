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
        while (_) try {
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
exports.AuthenticateAction = exports.ShowProfileActionForFetchedUser = exports.ShowProfileAction = exports.StartWhisperAction = exports.SetNameAction = exports.SendMessageAction = exports.ErrorAction = exports.LocalMediaStreamOpenedAction = exports.P2PStreamReceivedAction = exports.P2PDataReceivedAction = exports.UserMapAction = exports.PlayerLeftAction = exports.PlayerEnteredAction = exports.ShoutAction = exports.WhisperAction = exports.ChatMessageAction = exports.PlayerDisconnectedAction = exports.PlayerConnectedAction = exports.UpdatedPresenceAction = exports.UpdatedRoomAction = exports.ActionType = void 0;
var networking_1 = require("./networking");
var ActionType;
(function (ActionType) {
    // Server-driven action
    ActionType["UpdatedRoom"] = "UPDATED_ROOM";
    ActionType["UpdatedPresence"] = "UPDATED_PRESENCE";
    ActionType["PlayerConnected"] = "PLAYER_CONNECTED";
    ActionType["PlayerDisconnected"] = "PLAYER_DISCONNECTED";
    ActionType["ChatMessage"] = "CHAT_MESSAGE";
    ActionType["Whisper"] = "WHISPER";
    ActionType["Shout"] = "SHOUT";
    ActionType["PlayerEntered"] = "PLAYER_ENTERED";
    ActionType["PlayerLeft"] = "PLAYER_LEFT";
    ActionType["Error"] = "ERROR";
    ActionType["UserMap"] = "USER_MAP";
    // WebRTC
    ActionType["P2PDataReceived"] = "P2P_DATA_RECEIVED";
    ActionType["P2PStreamReceived"] = "P2P_STREAM_RECEIVED";
    ActionType["LocalMediaStreamOpened"] = "LOCAL_MEDIASTREAM_OPENED";
    // UI actions
    ActionType["SendMessage"] = "SEND_MESSAGE";
    ActionType["SetName"] = "SET_NAME";
    ActionType["StartWhisper"] = "START_WHISPER";
    ActionType["ShowProfile"] = "SHOW_PROFILE";
    ActionType["Authenticate"] = "AUTHENTICATE";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
exports.UpdatedRoomAction = function (name, description, allowsMedia) {
    if (allowsMedia === void 0) { allowsMedia = false; }
    return {
        type: ActionType.UpdatedRoom,
        value: { name: name, description: description, allowsMedia: allowsMedia },
    };
};
exports.UpdatedPresenceAction = function (users) {
    return {
        type: ActionType.UpdatedPresence,
        value: users,
    };
};
exports.PlayerConnectedAction = function (userId, username) {
    return {
        type: ActionType.PlayerConnected,
        value: { userId: userId, username: username },
    };
};
exports.PlayerDisconnectedAction = function (name) {
    return {
        type: ActionType.PlayerDisconnected,
        value: name,
    };
};
exports.ChatMessageAction = function (name, message) {
    return {
        type: ActionType.ChatMessage,
        value: { name: name, message: message },
    };
};
exports.WhisperAction = function (name, message) {
    return {
        type: ActionType.Whisper,
        value: { name: name, message: message },
    };
};
exports.ShoutAction = function (name, message) {
    return {
        type: ActionType.Shout,
        value: { name: name, message: message },
    };
};
exports.PlayerEnteredAction = function (name, from) {
    return {
        type: ActionType.PlayerEntered,
        value: { name: name, from: from },
    };
};
exports.PlayerLeftAction = function (name, to) {
    return {
        type: ActionType.PlayerLeft,
        value: { name: name, to: to },
    };
};
exports.UserMapAction = function (map) {
    return {
        type: ActionType.UserMap,
        value: map,
    };
};
exports.P2PDataReceivedAction = function (peerId, data) {
    return {
        type: ActionType.P2PDataReceived,
        value: { peerId: peerId, data: data },
    };
};
exports.P2PStreamReceivedAction = function (peerId, stream) {
    return {
        type: ActionType.P2PStreamReceived,
        value: { peerId: peerId, stream: stream },
    };
};
exports.LocalMediaStreamOpenedAction = function (stream) {
    return { type: ActionType.LocalMediaStreamOpened, value: stream };
};
exports.ErrorAction = function (error) {
    return {
        type: ActionType.Error,
        value: error,
    };
};
exports.SendMessageAction = function (message) {
    return {
        type: ActionType.SendMessage,
        value: message,
    };
};
exports.SetNameAction = function (name) {
    return {
        type: ActionType.SetName,
        value: name,
    };
};
exports.StartWhisperAction = function (name) {
    return { type: ActionType.StartWhisper, value: name };
};
exports.ShowProfileAction = function (name) {
    return function (dispatch) { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("lol");
                    return [4 /*yield*/, networking_1.fetchProfile(name)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        console.log("No user");
                        return [2 /*return*/];
                    }
                    dispatch(exports.ShowProfileActionForFetchedUser(user));
                    return [2 /*return*/];
            }
        });
    }); };
};
exports.ShowProfileActionForFetchedUser = function (user) {
    return {
        type: ActionType.ShowProfile,
        value: user,
    };
};
exports.AuthenticateAction = function (userId, name) {
    return { type: ActionType.Authenticate, value: { userId: userId, name: name } };
};
