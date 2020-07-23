"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var message_1 = require("../message");
var NameView_1 = __importDefault(require("./NameView"));
exports.default = (function (props) {
    var _a;
    var message = props.message;
    var messageMap = (_a = {},
        _a[message_1.MessageType.Connected] = ConnectedMessageView,
        _a[message_1.MessageType.Disconnected] = DisconnectedMessageView,
        _a[message_1.MessageType.Entered] = EnteredView,
        _a[message_1.MessageType.Left] = LeftView,
        _a[message_1.MessageType.Chat] = ChatMessageView,
        _a[message_1.MessageType.Whisper] = WhisperView,
        _a[message_1.MessageType.Shout] = ShoutView,
        _a[message_1.MessageType.Error] = ErrorView,
        _a);
    var component = messageMap[message.type];
    if (!component) {
        console.log("Unexpected message type", message.type);
        return react_1.default.createElement("div", null);
    }
    return react_1.default.createElement(component, __assign(__assign({}, message), { id: props.id }));
});
var ConnectedMessageView = function (props) { return (react_1.default.createElement("div", null,
    react_1.default.createElement(NameView_1.default, { userId: props.userId, id: props.id }),
    " has connected.")); };
var DisconnectedMessageView = function (props) { return (react_1.default.createElement("div", null,
    react_1.default.createElement(NameView_1.default, { userId: props.userId, id: props.id }),
    " has disconnected.")); };
var EnteredView = function (props) {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(NameView_1.default, { userId: props.userId, id: props.id }),
        " has entered from",
        " ",
        props.from,
        "."));
};
var LeftView = function (props) { return (react_1.default.createElement("div", null,
    react_1.default.createElement(NameView_1.default, { id: props.id, userId: props.userId }),
    " has wandered off to",
    " ",
    props.to,
    ".")); };
var ChatMessageView = function (props) { return (react_1.default.createElement("div", null,
    react_1.default.createElement(NameView_1.default, { userId: props.userId, id: props.id }),
    ": ",
    props.message)); };
var WhisperView = function (props) {
    if (props.senderIsSelf) {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("em", null,
                "You whisper to ",
                react_1.default.createElement(NameView_1.default, { id: props.id, userId: props.userId }),
                ":",
                " ",
                props.message)));
    }
    else {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("em", null,
                react_1.default.createElement(NameView_1.default, { userId: props.userId, id: props.id }),
                " whispers:",
                " ",
                props.message)));
    }
};
var ShoutView = function (props) {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(NameView_1.default, { userId: props.userId, id: props.id }),
        " shouts: ",
        props.message));
};
var ErrorView = function (props) {
    return react_1.default.createElement("div", null, props.error);
};
