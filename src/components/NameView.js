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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_contextmenu_1 = require("react-contextmenu");
var App_1 = require("../App");
var Actions_1 = require("../Actions");
exports.default = (function (props) {
    var dispatch = react_1.useContext(App_1.DispatchContext);
    var userMap = react_1.useContext(App_1.UserMapContext);
    var handleWhisper = function (e, data) {
        dispatch(Actions_1.StartWhisperAction(data.name));
    };
    var handleProfile = function (e, data) {
        dispatch(Actions_1.ShowProfileAction(data.name));
    };
    return (react_1.default.createElement("span", { className: "name" },
        react_1.default.createElement(react_contextmenu_1.ContextMenuTrigger, { id: props.id, renderTag: "span" },
            react_1.default.createElement("strong", null, userMap[props.userId])),
        react_1.default.createElement(react_contextmenu_1.ContextMenu, { id: props.id },
            react_1.default.createElement(react_contextmenu_1.MenuItem, { data: { name: props.userId }, onClick: handleProfile }, "Profile"),
            react_1.default.createElement(react_contextmenu_1.MenuItem, { data: { name: props.userId }, onClick: handleWhisper }, "Whisper"))));
});
