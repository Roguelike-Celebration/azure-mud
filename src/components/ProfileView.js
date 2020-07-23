"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
exports.default = (function (props) {
    var user = props.user;
    var realName = user.realName ? (react_1.default.createElement("div", { id: "profile-realName" }, user.realName)) : ("");
    var twitterHandle = user.twitterHandle ? (react_1.default.createElement("div", { id: "profile-twitter" },
        react_1.default.createElement("strong", null, "Twitter"),
        ":",
        " ",
        react_1.default.createElement("a", { href: "https://twitter.com/" + user.twitterHandle, target: "_blank" },
            "@",
            user.twitterHandle))) : ("");
    var url = user.url ? (react_1.default.createElement("div", { id: "profile-url" },
        react_1.default.createElement("strong", null, "Web Site"),
        ":",
        " ",
        react_1.default.createElement("a", { href: user.url, target: "_blank" }, user.url))) : ("");
    var description = user.description ? (react_1.default.createElement("div", { id: "profile-description" }, user.description)) : ("");
    var askMeAbout = user.askMeAbout ? (react_1.default.createElement("div", { id: "profile-askme" },
        react_1.default.createElement("strong", null, "Ask me about:"),
        user.askMeAbout)) : ("");
    return (react_1.default.createElement("div", { id: "profile" },
        react_1.default.createElement("h1", null, user.id),
        realName,
        react_1.default.createElement("div", { id: "profile-pronouns" }, user.pronouns),
        description,
        twitterHandle,
        url,
        askMeAbout));
});
