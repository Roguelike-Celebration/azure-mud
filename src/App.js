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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapContext = exports.DispatchContext = void 0;
var react_1 = __importStar(require("react"));
var RoomView_1 = __importDefault(require("./components/RoomView"));
var ChatView_1 = __importDefault(require("./components/ChatView"));
var InputView_1 = __importDefault(require("./components/InputView"));
var networking_1 = require("./networking");
var reducer_1 = __importDefault(require("./reducer"));
var Actions_1 = require("./Actions");
var ProfileView_1 = __importDefault(require("./components/ProfileView"));
var useReducerWithThunk_1 = require("./useReducerWithThunk");
var config_1 = __importDefault(require("./config"));
exports.DispatchContext = react_1.createContext(null);
exports.UserMapContext = react_1.createContext(null);
var App = function () {
    var _a = useReducerWithThunk_1.useReducerWithThunk(reducer_1.default, {
        authenticated: false,
        inMediaChat: false,
        messages: [],
        userMap: {},
    }), state = _a[0], dispatch = _a[1];
    react_1.useEffect(function () {
        networking_1.getLoginInfo().then(function (r) {
            if (r) {
                var userId = r.user_claims[0].value;
                var name_1 = r.user_id;
                networking_1.connect(userId, dispatch);
                dispatch(Actions_1.AuthenticateAction(userId, name_1));
            }
        });
    }, []);
    var profile = state.visibleProfile ? (react_1.default.createElement(ProfileView_1.default, { user: state.visibleProfile })) : ("");
    if (!state.authenticated) {
        return (react_1.default.createElement("a", { href: config_1.default.SERVER_HOSTNAME + "/.auth/login/twitter?post_login_redirect_url=" + encodeURIComponent(window.location.href) }, "Log In"));
    }
    return (react_1.default.createElement(exports.DispatchContext.Provider, { value: dispatch },
        react_1.default.createElement(exports.UserMapContext.Provider, { value: state.userMap },
            react_1.default.createElement("div", { id: "main" },
                react_1.default.createElement(RoomView_1.default, { room: state.room }),
                profile,
                react_1.default.createElement(ChatView_1.default, { messages: state.messages }),
                react_1.default.createElement(InputView_1.default, { prepopulated: state.prepopulatedInput })))));
};
exports.default = App;
