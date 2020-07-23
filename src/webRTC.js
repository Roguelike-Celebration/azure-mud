"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastToPeers = exports.sendToPeer = exports.receiveSignalData = exports.startSignaling = void 0;
var simple_peer_1 = __importDefault(require("simple-peer"));
var networking_1 = require("./networking");
// TODO: How am I threading through a dispatch function to this?
var mediaStream;
var getMediaStream = function (dispatch) { return __awaiter(void 0, void 0, void 0, function () {
    var stream, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Getting media stream");
                if (mediaStream) {
                    return [2 /*return*/, mediaStream];
                }
                stream = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: { facingMode: "user" },
                    })];
            case 2:
                stream = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log("Video error", err_1);
                return [3 /*break*/, 4];
            case 4:
                mediaStream = stream;
                // TODO: Dispatch a stream action that sets the media stream
                return [2 /*return*/, stream];
        }
    });
}); };
function startSignaling(peerId, dispatch) {
    return __awaiter(this, void 0, void 0, function () {
        var stream, peer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMediaStream(dispatch)];
                case 1:
                    stream = _a.sent();
                    peer = new simple_peer_1.default({ initiator: true, stream: stream });
                    peers[peerId] = peer;
                    setUpPeer(peerId, peer, dispatch);
                    return [2 /*return*/];
            }
        });
    });
}
exports.startSignaling = startSignaling;
function receiveSignalData(peerId, data, dispatch) {
    return __awaiter(this, void 0, void 0, function () {
        var stream, peer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMediaStream(dispatch)];
                case 1:
                    stream = _a.sent();
                    peer = peers[peerId];
                    if (!peer) {
                        peer = new simple_peer_1.default({ stream: stream });
                        peers[peerId] = peer;
                        setUpPeer(peerId, peer, dispatch);
                    }
                    peer.signal(data);
                    return [2 /*return*/];
            }
        });
    });
}
exports.receiveSignalData = receiveSignalData;
var peers = {};
function sendToPeer(id, msg) {
    peers[id].send(msg);
}
exports.sendToPeer = sendToPeer;
function broadcastToPeers(msg) {
    Object.values(peers).forEach(function (c) {
        if (!c.connected)
            return;
        c.send(msg);
    });
}
exports.broadcastToPeers = broadcastToPeers;
function setUpPeer(peerId, peer, dispatch) {
    peer.on("signal", function (data) {
        console.log("SIGNAL", JSON.stringify(data));
        networking_1.sendSignalData(peerId, data);
    });
    peer.on("connect", function () {
        console.log("Peer " + peerId + " connected!");
    });
    peer.on("data", function (data) {
        // TODO: Dispatch a data action
        // receivedDataHandler(peerId, data);
    });
    peer.on("stream", function (stream) {
        console.log("Received stream", peerId);
        // TODO: Dispatch a stream action that sets the media stream
        // receivedStreamHandler(peerId, stream);
    });
}
