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
Object.defineProperty(exports, "__esModule", { value: true });
var Actions_1 = require("./Actions");
var message_1 = require("./message");
var networking_1 = require("./networking");
var lodash_1 = require("lodash");
// TODO: Split this out into separate reducers based on worldstate actions vs UI actions?
exports.default = (function (oldState, action) {
    console.log("In reducer", action);
    // TODO: This could hurt perf when we have a lot of messages
    var state = JSON.parse(JSON.stringify(oldState));
    state.prepopulatedInput = undefined;
    if (action.type === Actions_1.ActionType.UpdatedRoom) {
        var _a = action.value, name_1 = _a.name, description = _a.description, allowsMedia = _a.allowsMedia;
        description = parseDescription(description);
        state.room = {
            name: name_1,
            description: description,
            users: [],
            allowsMedia: allowsMedia,
        };
    }
    if (action.type === Actions_1.ActionType.UpdatedPresence) {
        state.room.users = action.value.filter(function (u) { return u !== state.userId; });
    }
    if (action.type === Actions_1.ActionType.PlayerConnected) {
        if (!state.room.users.includes(action.value.userId)) {
            state.room.users.push(action.value.userId);
            state.messages.push(message_1.createConnectedMessage(action.value.userId));
        }
        state.userMap[action.value.userId] = action.value.username;
        console.log(action.value.userId, action.value.username, state.userMap);
    }
    if (action.type === Actions_1.ActionType.PlayerDisconnected) {
        state.room.users = state.room.users.filter(function (u) { return u !== action.value; });
        state.messages.push(message_1.createDisconnectedMessage(action.value));
    }
    if (action.type === Actions_1.ActionType.PlayerEntered) {
        if (!state.room.users.includes(action.value.name)) {
            state.room.users.push(action.value.name);
            state.messages.push(message_1.createEnteredMessage(action.value.name, action.value.from));
        }
    }
    if (action.type === Actions_1.ActionType.PlayerLeft) {
        state.room.users = state.room.users.filter(function (u) { return u !== action.value.name; });
        state.messages.push(message_1.createLeftMessage(action.value.name, action.value.to));
    }
    if (action.type === Actions_1.ActionType.ChatMessage) {
        state.messages.push(message_1.createChatMessage(action.value.name, action.value.message));
    }
    if (action.type === Actions_1.ActionType.Whisper) {
        state.messages.push(message_1.createWhisperMessage(action.value.name, action.value.message));
    }
    if (action.type === Actions_1.ActionType.Shout) {
        state.messages.push(message_1.createShoutMessage(action.value.name, action.value.message));
    }
    if (action.type === Actions_1.ActionType.UserMap) {
        state.userMap = __assign(__assign({}, state.userMap), action.value);
    }
    if (action.type === Actions_1.ActionType.Error) {
        state.messages.push(message_1.createErrorMessage(action.value));
    }
    // WebRTC
    if (action.type === Actions_1.ActionType.LocalMediaStreamOpened) {
        state.localMediaStream = action.value;
    }
    if (action.type === Actions_1.ActionType.P2PStreamReceived) {
        if (!state.otherMediaStreams) {
            state.otherMediaStreams = {};
        }
        state.otherMediaStreams[action.value.peerId] = action.value.stream;
    }
    if (action.type === Actions_1.ActionType.P2PDataReceived) {
        console.log("Received P2P data!", action.value.peerId, action.value.data);
    }
    // UI Actions
    if (action.type === Actions_1.ActionType.SendMessage) {
        networking_1.sendChatMessage(action.value);
        var isCommand = /^\/(.+?) (.+)/.exec(action.value);
        if (isCommand) {
            if (isCommand[1] === "whisper") {
                var _b = /^(.+?) (.+)/.exec(isCommand[2]), _ = _b[0], username = _b[1], message = _b[2];
                var userId = lodash_1.invert(state.userMap)[username];
                console.log("Invert", username, userId);
                if (userId) {
                    state.messages.push(message_1.createWhisperMessage(userId, message, true));
                }
            }
        }
        else {
            state.messages.push(message_1.createChatMessage(state.userId, action.value));
        }
    }
    if (action.type === Actions_1.ActionType.StartWhisper) {
        console.log("Preopopulating");
        state.prepopulatedInput = "/whisper " + action.value + " ";
    }
    if (action.type === Actions_1.ActionType.ShowProfile) {
        state.visibleProfile = action.value;
    }
    if (action.type === Actions_1.ActionType.Authenticate) {
        state.authenticated = true;
        state.userId = action.value.userId;
        state.userMap[action.value.userId] = action.value.name;
    }
    return state;
});
function parseDescription(description) {
    var complexLinkRegex = /\[\[([^\]]*?)\-\>([^\]]*?)\]\]/g;
    var simpleLinkRegex = /\[\[(.+?)\]\]/g;
    description = description.replace(complexLinkRegex, function (match, text, roomId) {
        console.log("Replacing complex", match, text, roomId);
        return "<a class='room-link' href='#' data-room='" + roomId + "'>" + text + "</a>";
    });
    description = description.replace(simpleLinkRegex, function (match, roomId) {
        console.log("Replacing simple", match, roomId);
        return "<a class='room-link' href='#' data-room='" + roomId + "'>" + roomId + "</a>";
    });
    return description;
}
