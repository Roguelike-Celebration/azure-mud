"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoginInfo = exports.sendSignalData = exports.fetchProfile = exports.sendChatMessage = exports.moveToRoom = exports.connect = void 0;
var SignalR = __importStar(require("@aspnet/signalr"));
var axios = require("axios").default;
var Actions_1 = require("./Actions");
var webRTC_1 = require("./webRTC");
var config_1 = __importDefault(require("./config"));
var myUserId;
var myDispatch;
function connect(userId, dispatch) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    myUserId = userId;
                    myDispatch = dispatch;
                    return [4 /*yield*/, callAzureFunction("connect")];
                case 1:
                    result = _a.sent();
                    console.log(result);
                    dispatch(Actions_1.UpdatedRoomAction(result.room.displayName, result.room.description));
                    dispatch(Actions_1.UpdatedPresenceAction(result.roomOccupants));
                    dispatch(Actions_1.UserMapAction(result.users));
                    connectSignalR(userId, dispatch);
                    return [2 /*return*/];
            }
        });
    });
}
exports.connect = connect;
function moveToRoom(roomId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, callAzureFunction("moveRoom", {
                        to: roomId,
                    })];
                case 1:
                    result = _a.sent();
                    console.log(result);
                    if (result.error) {
                        myDispatch(Actions_1.ErrorAction(result.error));
                    }
                    else {
                        myDispatch(Actions_1.UpdatedRoomAction(result.room.displayName, result.room.description, result.room.allowsMedia));
                        myDispatch(Actions_1.UpdatedPresenceAction(result.roomOccupants));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.moveToRoom = moveToRoom;
function sendChatMessage(text) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, callAzureFunction("sendChatMessage", {
                        text: text,
                    })];
                case 1:
                    result = _a.sent();
                    console.log(result);
                    // If it's a /move command
                    if (result && result.room && result.roomOccupants) {
                        myDispatch(Actions_1.UpdatedRoomAction(result.room.displayName, result.room.description));
                        myDispatch(Actions_1.UpdatedPresenceAction(result.roomOccupants));
                    }
                    else if (result && result.user) {
                        myDispatch(Actions_1.ShowProfileActionForFetchedUser(result.user));
                    }
                    else if (result && result.error) {
                        myDispatch(Actions_1.ErrorAction(result.error));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendChatMessage = sendChatMessage;
function fetchProfile(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, callAzureFunction("fetchProfile", { userId: userId })];
                case 1:
                    result = _a.sent();
                    if (result.error) {
                        console.log("Could not fetch profile", result.erroc);
                    }
                    else {
                        return [2 /*return*/, result.user];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.fetchProfile = fetchProfile;
// WebRTC
function sendSignalData(peerId, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, callAzureFunction("sendSignalData", { peerId: peerId, data: data })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.sendSignalData = sendSignalData;
// Setup
function connectSignalR(userId, dispatch) {
    return __awaiter(this, void 0, void 0, function () {
        var connection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connection = new SignalR.HubConnectionBuilder()
                        .withUrl(config_1.default.SERVER_HOSTNAME + "/api")
                        .configureLogging(SignalR.LogLevel.Debug)
                        .build();
                    connection.on("playerConnected", function (otherId, otherName) {
                        console.log("Player joined!", otherId, otherName);
                        dispatch(Actions_1.PlayerConnectedAction(otherId, otherName));
                    });
                    connection.on("playerDisconnected", function (otherId) {
                        console.log("Player left!", otherId);
                        dispatch(Actions_1.PlayerDisconnectedAction(otherId));
                    });
                    connection.on("chatMessage", function (otherId, message) {
                        console.log("Received chat", otherId, message);
                        console.log(otherId, message, userId);
                        if (otherId === userId)
                            return;
                        dispatch(Actions_1.ChatMessageAction(otherId, message));
                    });
                    connection.on("playerEntered", function (name, from) {
                        if (name === userId)
                            return;
                        dispatch(Actions_1.PlayerEnteredAction(name, from));
                    });
                    connection.on("whisper", function (otherId, message) {
                        dispatch(Actions_1.WhisperAction(otherId, message));
                    });
                    connection.on("playerLeft", function (name, to) {
                        if (name === userId)
                            return;
                        dispatch(Actions_1.PlayerLeftAction(name, to));
                    });
                    connection.on("usernameMap", function (map) {
                        console.log("Received map", map);
                        dispatch(Actions_1.UserMapAction(map));
                    });
                    connection.on("shout", function (name, message) {
                        // We don't gate on your own userId here.
                        // Because shouting can fail at the server level, we don't show it preemptively.
                        dispatch(Actions_1.ShoutAction(name, message));
                    });
                    connection.on("webrtcSignalData", function (peerId, data) {
                        console.log("Received signaling data from", peerId);
                        webRTC_1.receiveSignalData(peerId, data, dispatch);
                    });
                    connection.on("webrtcPeerId", function (peerId) {
                        console.log("Starting signaling with", peerId);
                        webRTC_1.startSignaling(peerId, dispatch);
                    });
                    connection.onclose(function () {
                        console.log("disconnected");
                        callAzureFunction("disconnect");
                    });
                    connection.on("ping", function () {
                        console.log("Received heartbeat ping");
                        callAzureFunction("pong");
                    });
                    window.addEventListener("beforeunload", function (e) {
                        callAzureFunction("disconnect");
                    });
                    console.log("connecting...");
                    return [4 /*yield*/, connection
                            .start()
                            .then(function () {
                            console.log("Connected!");
                            callAzureFunction("broadcastPeerId");
                        })
                            .catch(console.error)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function callAzureFunction(endpoint, body) {
    return __awaiter(this, void 0, void 0, function () {
        var r, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.post(config_1.default.SERVER_HOSTNAME + "/api/" + endpoint, body, { withCredentials: true })];
                case 1:
                    r = _a.sent();
                    console.log(r);
                    return [2 /*return*/, r.data];
                case 2:
                    e_1 = _a.sent();
                    console.log("Error", e_1);
                    return [2 /*return*/, undefined];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getLoginInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var r, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("Fetching");
                    return [4 /*yield*/, axios.post(config_1.default.SERVER_HOSTNAME + "/.auth/me", null, {
                            withCredentials: true,
                        })];
                case 1:
                    r = _a.sent();
                    console.log(r);
                    return [2 /*return*/, r.data[0]];
                case 2:
                    e_2 = _a.sent();
                    console.log(e_2);
                    return [2 /*return*/, undefined];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getLoginInfo = getLoginInfo;
