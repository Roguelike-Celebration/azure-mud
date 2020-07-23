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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
var react_1 = __importStar(require("react"));
var NameView_1 = __importDefault(require("./NameView"));
function default_1(props) {
    var playerStream = props.playerStream, otherStreams = props.otherStreams;
    var playerVideo, otherVideos;
    playerVideo = (react_1.default.createElement("div", { id: "my-video" },
        "You:",
        react_1.default.createElement(Video, { srcObject: playerStream })));
    if (otherStreams) {
        otherVideos = Object.entries(otherStreams).map(function (_a) {
            var peerId = _a[0], stream = _a[1];
            return (react_1.default.createElement("div", null,
                react_1.default.createElement(NameView_1.default, { userId: peerId, id: "stream-" + peerId }),
                ":",
                react_1.default.createElement(Video, { srcObject: stream })));
        });
    }
    return (react_1.default.createElement("div", null,
        playerVideo,
        " ",
        otherVideos));
}
exports.default = default_1;
function Video(_a) {
    var srcObject = _a.srcObject, props = __rest(_a, ["srcObject"]);
    var refVideo = react_1.useRef(null);
    react_1.useEffect(function () {
        if (!refVideo.current)
            return;
        refVideo.current.srcObject = srcObject;
    }, [srcObject]);
    return react_1.default.createElement("video", __assign({ ref: refVideo }, props));
}
exports.Video = Video;
