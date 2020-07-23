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
var React = __importStar(require("react"));
var networking_1 = require("../networking");
var NameView_1 = __importDefault(require("./NameView"));
exports.default = (function (props) {
    var room = props.room;
    // This is very silly.
    // Since we're manually setting raw HTML, we can't get refs to add proper click handlers
    // Instead, we just hijack ALL clicks in the description, and check if they're for a link
    var descriptionClick = function (e) {
        var roomId = e.target && e.target.getAttribute && e.target.getAttribute("data-room");
        if (roomId) {
            networking_1.moveToRoom(roomId);
        }
    };
    return (React.createElement("div", { id: "room" },
        React.createElement("h1", { id: "room-name" }, room ? room.name : "Loading..."),
        React.createElement("div", { id: "static-room-description", onClick: descriptionClick, dangerouslySetInnerHTML: {
                __html: room ? room.description : "Loading current room...",
            } }),
        room ? React.createElement(PresenceView, { users: room.users }) : ""));
});
var PresenceView = function (props) {
    var users = props.users;
    if (users) {
        // TODO: This should happen in the reducer
        var names = void 0;
        if (users.length === 0) {
            return React.createElement("div", { id: "dynamic-room-description" }, "You are all alone here.");
        }
        var userViews = users.map(function (u, idx) {
            var id = "presence-" + idx;
            return React.createElement(NameView_1.default, { userId: u, id: id, key: id });
        });
        if (users.length === 1) {
            names = userViews[0];
        }
        else if (users.length === 2) {
            names = (React.createElement("span", null,
                userViews[0],
                " and ",
                userViews[1]));
        }
        else {
            names = (React.createElement("span", null,
                intersperse(userViews.slice(0, users.length - 1), ", "),
                ", and",
                " ",
                userViews[userViews.length - 1]));
        }
        // TODO: Bold these
        return (React.createElement("div", { id: "dynamic-room-description" },
            "Also here ",
            users.length === 1 ? "is" : "are",
            " ",
            names,
            "."));
    }
    else {
        return React.createElement("div", { id: "dynamic-room-description" });
    }
};
// https://stackoverflow.com/questions/23618744/rendering-comma-separated-list-of-links
/* intersperse: Return an array with the separator interspersed between
 * each element of the input array.
 *
 * > _([1,2,3]).intersperse(0)
 * [1,0,2,0,3]
 */
function intersperse(arr, sep) {
    if (arr.length === 0) {
        return [];
    }
    return arr.slice(1).reduce(function (xs, x, i) {
        return xs.concat([sep, x]);
    }, [arr[0]]);
}
