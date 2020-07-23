"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var MessageView_1 = __importDefault(require("./MessageView"));
exports.default = (function (props) {
    react_1.default.useEffect(function () {
        var lastMessage = document.querySelector("#messages div:last-of-type");
        if (lastMessage) {
            lastMessage.scrollIntoView();
        }
    });
    return (react_1.default.createElement("div", { id: "messages" }, props.messages.map(function (m, idx) {
        var id = "message-" + idx;
        return react_1.default.createElement(MessageView_1.default, { message: m, key: id, id: id });
    })));
});
