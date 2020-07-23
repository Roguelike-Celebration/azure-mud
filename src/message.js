"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorMessage = exports.createShoutMessage = exports.createWhisperMessage = exports.createChatMessage = exports.createLeftMessage = exports.createEnteredMessage = exports.createDisconnectedMessage = exports.createConnectedMessage = exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["Connected"] = "CONNECTED";
    MessageType["Disconnected"] = "DISCONNECTED";
    MessageType["Entered"] = "ENTERED";
    MessageType["Left"] = "LEFT";
    MessageType["Chat"] = "CHAT";
    MessageType["Whisper"] = "WHISPER";
    MessageType["Shout"] = "SHOUT";
    MessageType["Error"] = "ERROR";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
exports.createConnectedMessage = function (userId) {
    return { type: MessageType.Connected, userId: userId };
};
exports.createDisconnectedMessage = function (userId) {
    return { type: MessageType.Disconnected, userId: userId };
};
exports.createEnteredMessage = function (userId, from) {
    return { type: MessageType.Entered, userId: userId, from: from };
};
exports.createLeftMessage = function (userId, to) {
    return { type: MessageType.Left, userId: userId, to: to };
};
exports.createChatMessage = function (userId, message) {
    return { type: MessageType.Chat, userId: userId, message: message };
};
exports.createWhisperMessage = function (userId, message, senderIsSelf) {
    if (senderIsSelf === void 0) { senderIsSelf = false; }
    return { type: MessageType.Whisper, userId: userId, message: message, senderIsSelf: senderIsSelf };
};
exports.createShoutMessage = function (userId, message) {
    return { type: MessageType.Shout, userId: userId, message: message };
};
exports.createErrorMessage = function (error) {
    return { type: MessageType.Error, error: error };
};
