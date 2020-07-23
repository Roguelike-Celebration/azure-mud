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
var App_1 = require("../App");
var Actions_1 = require("../Actions");
exports.default = (function (props) {
    var dispatch = react_1.useContext(App_1.DispatchContext);
    var _a = react_1.useState(""), input = _a[0], setInput = _a[1];
    var handleInputChange = function (e) { return setInput(e.currentTarget.value); };
    var checkEnter = function (e) {
        if (e.key === "Enter") {
            onClick();
        }
    };
    var onClick = function () {
        dispatch(Actions_1.SendMessageAction(input));
        setInput("");
    };
    react_1.useEffect(function () {
        console.log("useEffect");
        document.getElementById("chat-input").focus();
        if (props.prepopulated) {
            setInput(props.prepopulated);
        }
    }, [props.prepopulated]);
    return (react_1.default.createElement("div", { id: "input" },
        react_1.default.createElement("input", { type: "text", id: "chat-input", onChange: handleInputChange, onKeyPress: checkEnter, value: input }),
        react_1.default.createElement("button", { id: "send", onClick: onClick }, "Send")));
});
