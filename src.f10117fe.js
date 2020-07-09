// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/@aspnet/signalr/dist/esm/Errors.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbortError = exports.TimeoutError = exports.HttpError = void 0;

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __extends = void 0 && (void 0).__extends || function () {
  var extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
/** Error thrown when an HTTP request fails. */


var HttpError =
/** @class */
function (_super) {
  __extends(HttpError, _super);
  /** Constructs a new instance of {@link @aspnet/signalr.HttpError}.
   *
   * @param {string} errorMessage A descriptive error message.
   * @param {number} statusCode The HTTP status code represented by this error.
   */


  function HttpError(errorMessage, statusCode) {
    var _newTarget = this.constructor;

    var _this = this;

    var trueProto = _newTarget.prototype;
    _this = _super.call(this, errorMessage) || this;
    _this.statusCode = statusCode; // Workaround issue in Typescript compiler
    // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200

    _this.__proto__ = trueProto;
    return _this;
  }

  return HttpError;
}(Error);

exports.HttpError = HttpError;

/** Error thrown when a timeout elapses. */
var TimeoutError =
/** @class */
function (_super) {
  __extends(TimeoutError, _super);
  /** Constructs a new instance of {@link @aspnet/signalr.TimeoutError}.
   *
   * @param {string} errorMessage A descriptive error message.
   */


  function TimeoutError(errorMessage) {
    var _newTarget = this.constructor;

    if (errorMessage === void 0) {
      errorMessage = "A timeout occurred.";
    }

    var _this = this;

    var trueProto = _newTarget.prototype;
    _this = _super.call(this, errorMessage) || this; // Workaround issue in Typescript compiler
    // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200

    _this.__proto__ = trueProto;
    return _this;
  }

  return TimeoutError;
}(Error);

exports.TimeoutError = TimeoutError;

/** Error thrown when an action is aborted. */
var AbortError =
/** @class */
function (_super) {
  __extends(AbortError, _super);
  /** Constructs a new instance of {@link AbortError}.
   *
   * @param {string} errorMessage A descriptive error message.
   */


  function AbortError(errorMessage) {
    var _newTarget = this.constructor;

    if (errorMessage === void 0) {
      errorMessage = "An abort occurred.";
    }

    var _this = this;

    var trueProto = _newTarget.prototype;
    _this = _super.call(this, errorMessage) || this; // Workaround issue in Typescript compiler
    // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200

    _this.__proto__ = trueProto;
    return _this;
  }

  return AbortError;
}(Error);

exports.AbortError = AbortError;
},{}],"node_modules/@aspnet/signalr/dist/esm/HttpClient.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpClient = exports.HttpResponse = void 0;

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __assign = void 0 && (void 0).__assign || Object.assign || function (t) {
  for (var s, i = 1, n = arguments.length; i < n; i++) {
    s = arguments[i];

    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
  }

  return t;
};
/** Represents an HTTP response. */


var HttpResponse =
/** @class */
function () {
  function HttpResponse(statusCode, statusText, content) {
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.content = content;
  }

  return HttpResponse;
}();

exports.HttpResponse = HttpResponse;

/** Abstraction over an HTTP client.
 *
 * This class provides an abstraction over an HTTP client so that a different implementation can be provided on different platforms.
 */
var HttpClient =
/** @class */
function () {
  function HttpClient() {}

  HttpClient.prototype.get = function (url, options) {
    return this.send(__assign({}, options, {
      method: "GET",
      url: url
    }));
  };

  HttpClient.prototype.post = function (url, options) {
    return this.send(__assign({}, options, {
      method: "POST",
      url: url
    }));
  };

  HttpClient.prototype.delete = function (url, options) {
    return this.send(__assign({}, options, {
      method: "DELETE",
      url: url
    }));
  };
  /** Gets all cookies that apply to the specified URL.
   *
   * @param url The URL that the cookies are valid for.
   * @returns {string} A string containing all the key-value cookie pairs for the specified URL.
   */
  // @ts-ignore


  HttpClient.prototype.getCookieString = function (url) {
    return "";
  };

  return HttpClient;
}();

exports.HttpClient = HttpClient;
},{}],"node_modules/@aspnet/signalr/dist/esm/ILogger.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogLevel = void 0;
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
// These values are designed to match the ASP.NET Log Levels since that's the pattern we're emulating here.

/** Indicates the severity of a log message.
 *
 * Log Levels are ordered in increasing severity. So `Debug` is more severe than `Trace`, etc.
 */
var LogLevel;
exports.LogLevel = LogLevel;

(function (LogLevel) {
  /** Log level for very low severity diagnostic messages. */
  LogLevel[LogLevel["Trace"] = 0] = "Trace";
  /** Log level for low severity diagnostic messages. */

  LogLevel[LogLevel["Debug"] = 1] = "Debug";
  /** Log level for informational diagnostic messages. */

  LogLevel[LogLevel["Information"] = 2] = "Information";
  /** Log level for diagnostic messages that indicate a non-fatal problem. */

  LogLevel[LogLevel["Warning"] = 3] = "Warning";
  /** Log level for diagnostic messages that indicate a failure in the current operation. */

  LogLevel[LogLevel["Error"] = 4] = "Error";
  /** Log level for diagnostic messages that indicate a failure that will terminate the entire application. */

  LogLevel[LogLevel["Critical"] = 5] = "Critical";
  /** The highest possible log level. Used when configuring logging to indicate that no log messages should be emitted. */

  LogLevel[LogLevel["None"] = 6] = "None";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
},{}],"node_modules/@aspnet/signalr/dist/esm/Loggers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NullLogger = void 0;

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

/** A logger that does nothing when log messages are sent to it. */
var NullLogger =
/** @class */
function () {
  function NullLogger() {}
  /** @inheritDoc */
  // tslint:disable-next-line


  NullLogger.prototype.log = function (_logLevel, _message) {};
  /** The singleton instance of the {@link @aspnet/signalr.NullLogger}. */


  NullLogger.instance = new NullLogger();
  return NullLogger;
}();

exports.NullLogger = NullLogger;
},{}],"node_modules/@aspnet/signalr/dist/esm/Utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataDetail = getDataDetail;
exports.formatArrayBuffer = formatArrayBuffer;
exports.isArrayBuffer = isArrayBuffer;
exports.sendMessage = sendMessage;
exports.createLogger = createLogger;
exports.ConsoleLogger = exports.SubjectSubscription = exports.Subject = exports.Arg = void 0;

var _ILogger = require("./ILogger");

var _Loggers = require("./Loggers");

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

/** @private */
var Arg =
/** @class */
function () {
  function Arg() {}

  Arg.isRequired = function (val, name) {
    if (val === null || val === undefined) {
      throw new Error("The '" + name + "' argument is required.");
    }
  };

  Arg.isIn = function (val, values, name) {
    // TypeScript enums have keys for **both** the name and the value of each enum member on the type itself.
    if (!(val in values)) {
      throw new Error("Unknown " + name + " value: " + val + ".");
    }
  };

  return Arg;
}();

exports.Arg = Arg;

/** @private */
function getDataDetail(data, includeContent) {
  var detail = "";

  if (isArrayBuffer(data)) {
    detail = "Binary data of length " + data.byteLength;

    if (includeContent) {
      detail += ". Content: '" + formatArrayBuffer(data) + "'";
    }
  } else if (typeof data === "string") {
    detail = "String data of length " + data.length;

    if (includeContent) {
      detail += ". Content: '" + data + "'";
    }
  }

  return detail;
}
/** @private */


function formatArrayBuffer(data) {
  var view = new Uint8Array(data); // Uint8Array.map only supports returning another Uint8Array?

  var str = "";
  view.forEach(function (num) {
    var pad = num < 16 ? "0" : "";
    str += "0x" + pad + num.toString(16) + " ";
  }); // Trim of trailing space.

  return str.substr(0, str.length - 1);
} // Also in signalr-protocol-msgpack/Utils.ts

/** @private */


function isArrayBuffer(val) {
  return val && typeof ArrayBuffer !== "undefined" && (val instanceof ArrayBuffer || // Sometimes we get an ArrayBuffer that doesn't satisfy instanceof
  val.constructor && val.constructor.name === "ArrayBuffer");
}
/** @private */


function sendMessage(logger, transportName, httpClient, url, accessTokenFactory, content, logMessageContent) {
  return __awaiter(this, void 0, void 0, function () {
    var _a, headers, token, responseType, response;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (!accessTokenFactory) return [3
          /*break*/
          , 2];
          return [4
          /*yield*/
          , accessTokenFactory()];

        case 1:
          token = _b.sent();

          if (token) {
            headers = (_a = {}, _a["Authorization"] = "Bearer " + token, _a);
          }

          _b.label = 2;

        case 2:
          logger.log(_ILogger.LogLevel.Trace, "(" + transportName + " transport) sending data. " + getDataDetail(content, logMessageContent) + ".");
          responseType = isArrayBuffer(content) ? "arraybuffer" : "text";
          return [4
          /*yield*/
          , httpClient.post(url, {
            content: content,
            headers: headers,
            responseType: responseType
          })];

        case 3:
          response = _b.sent();
          logger.log(_ILogger.LogLevel.Trace, "(" + transportName + " transport) request complete. Response status: " + response.statusCode + ".");
          return [2
          /*return*/
          ];
      }
    });
  });
}
/** @private */


function createLogger(logger) {
  if (logger === undefined) {
    return new ConsoleLogger(_ILogger.LogLevel.Information);
  }

  if (logger === null) {
    return _Loggers.NullLogger.instance;
  }

  if (logger.log) {
    return logger;
  }

  return new ConsoleLogger(logger);
}
/** @private */


var Subject =
/** @class */
function () {
  function Subject() {
    this.observers = [];
  }

  Subject.prototype.next = function (item) {
    for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
      var observer = _a[_i];
      observer.next(item);
    }
  };

  Subject.prototype.error = function (err) {
    for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
      var observer = _a[_i];

      if (observer.error) {
        observer.error(err);
      }
    }
  };

  Subject.prototype.complete = function () {
    for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
      var observer = _a[_i];

      if (observer.complete) {
        observer.complete();
      }
    }
  };

  Subject.prototype.subscribe = function (observer) {
    this.observers.push(observer);
    return new SubjectSubscription(this, observer);
  };

  return Subject;
}();

exports.Subject = Subject;

/** @private */
var SubjectSubscription =
/** @class */
function () {
  function SubjectSubscription(subject, observer) {
    this.subject = subject;
    this.observer = observer;
  }

  SubjectSubscription.prototype.dispose = function () {
    var index = this.subject.observers.indexOf(this.observer);

    if (index > -1) {
      this.subject.observers.splice(index, 1);
    }

    if (this.subject.observers.length === 0 && this.subject.cancelCallback) {
      this.subject.cancelCallback().catch(function (_) {});
    }
  };

  return SubjectSubscription;
}();

exports.SubjectSubscription = SubjectSubscription;

/** @private */
var ConsoleLogger =
/** @class */
function () {
  function ConsoleLogger(minimumLogLevel) {
    this.minimumLogLevel = minimumLogLevel;
  }

  ConsoleLogger.prototype.log = function (logLevel, message) {
    if (logLevel >= this.minimumLogLevel) {
      switch (logLevel) {
        case _ILogger.LogLevel.Critical:
        case _ILogger.LogLevel.Error:
          console.error("[" + new Date().toISOString() + "] " + _ILogger.LogLevel[logLevel] + ": " + message);
          break;

        case _ILogger.LogLevel.Warning:
          console.warn("[" + new Date().toISOString() + "] " + _ILogger.LogLevel[logLevel] + ": " + message);
          break;

        case _ILogger.LogLevel.Information:
          console.info("[" + new Date().toISOString() + "] " + _ILogger.LogLevel[logLevel] + ": " + message);
          break;

        default:
          // console.debug only goes to attached debuggers in Node, so we use console.log for Trace and Debug
          console.log("[" + new Date().toISOString() + "] " + _ILogger.LogLevel[logLevel] + ": " + message);
          break;
      }
    }
  };

  return ConsoleLogger;
}();

exports.ConsoleLogger = ConsoleLogger;
},{"./ILogger":"node_modules/@aspnet/signalr/dist/esm/ILogger.js","./Loggers":"node_modules/@aspnet/signalr/dist/esm/Loggers.js"}],"node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"node_modules/ieee754/index.js":[function(require,module,exports) {
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"node_modules/base64-js/index.js","ieee754":"node_modules/ieee754/index.js","isarray":"node_modules/isarray/index.js","buffer":"node_modules/buffer/index.js"}],"node_modules/@aspnet/signalr/dist/esm/NodeHttpClient.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NodeHttpClient = void 0;

var _Errors = require("./Errors");

var _HttpClient = require("./HttpClient");

var _ILogger = require("./ILogger");

var _Utils = require("./Utils");

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __extends = void 0 && (void 0).__extends || function () {
  var extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __assign = void 0 && (void 0).__assign || Object.assign || function (t) {
  for (var s, i = 1, n = arguments.length; i < n; i++) {
    s = arguments[i];

    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
  }

  return t;
};

var requestModule;

if (typeof XMLHttpRequest === "undefined") {
  // In order to ignore the dynamic require in webpack builds we need to do this magic
  // @ts-ignore: TS doesn't know about these names
  var requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
  requestModule = requireFunc("request");
}

var NodeHttpClient =
/** @class */
function (_super) {
  __extends(NodeHttpClient, _super);

  function NodeHttpClient(logger) {
    var _this = _super.call(this) || this;

    if (typeof requestModule === "undefined") {
      throw new Error("The 'request' module could not be loaded.");
    }

    _this.logger = logger;
    _this.cookieJar = requestModule.jar();
    _this.request = requestModule.defaults({
      jar: _this.cookieJar
    });
    return _this;
  }

  NodeHttpClient.prototype.send = function (httpRequest) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      var requestBody;

      if ((0, _Utils.isArrayBuffer)(httpRequest.content)) {
        requestBody = Buffer.from(httpRequest.content);
      } else {
        requestBody = httpRequest.content || "";
      }

      var currentRequest = _this.request(httpRequest.url, {
        body: requestBody,
        // If binary is expected 'null' should be used, otherwise for text 'utf8'
        encoding: httpRequest.responseType === "arraybuffer" ? null : "utf8",
        headers: __assign({
          // Tell auth middleware to 401 instead of redirecting
          "X-Requested-With": "XMLHttpRequest"
        }, httpRequest.headers),
        method: httpRequest.method,
        timeout: httpRequest.timeout
      }, function (error, response, body) {
        if (httpRequest.abortSignal) {
          httpRequest.abortSignal.onabort = null;
        }

        if (error) {
          if (error.code === "ETIMEDOUT") {
            _this.logger.log(_ILogger.LogLevel.Warning, "Timeout from HTTP request.");

            reject(new _Errors.TimeoutError());
          }

          _this.logger.log(_ILogger.LogLevel.Warning, "Error from HTTP request. " + error);

          reject(error);
          return;
        }

        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(new _HttpClient.HttpResponse(response.statusCode, response.statusMessage || "", body));
        } else {
          reject(new _Errors.HttpError(response.statusMessage || "", response.statusCode || 0));
        }
      });

      if (httpRequest.abortSignal) {
        httpRequest.abortSignal.onabort = function () {
          currentRequest.abort();
          reject(new _Errors.AbortError());
        };
      }
    });
  };

  NodeHttpClient.prototype.getCookieString = function (url) {
    return this.cookieJar.getCookieString(url);
  };

  return NodeHttpClient;
}(_HttpClient.HttpClient);

exports.NodeHttpClient = NodeHttpClient;
},{"./Errors":"node_modules/@aspnet/signalr/dist/esm/Errors.js","./HttpClient":"node_modules/@aspnet/signalr/dist/esm/HttpClient.js","./ILogger":"node_modules/@aspnet/signalr/dist/esm/ILogger.js","./Utils":"node_modules/@aspnet/signalr/dist/esm/Utils.js","buffer":"node_modules/buffer/index.js"}],"node_modules/@aspnet/signalr/dist/esm/XhrHttpClient.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XhrHttpClient = void 0;

var _Errors = require("./Errors");

var _HttpClient = require("./HttpClient");

var _ILogger = require("./ILogger");

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __extends = void 0 && (void 0).__extends || function () {
  var extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var XhrHttpClient =
/** @class */
function (_super) {
  __extends(XhrHttpClient, _super);

  function XhrHttpClient(logger) {
    var _this = _super.call(this) || this;

    _this.logger = logger;
    return _this;
  }
  /** @inheritDoc */


  XhrHttpClient.prototype.send = function (request) {
    var _this = this; // Check that abort was not signaled before calling send


    if (request.abortSignal && request.abortSignal.aborted) {
      return Promise.reject(new _Errors.AbortError());
    }

    if (!request.method) {
      return Promise.reject(new Error("No method defined."));
    }

    if (!request.url) {
      return Promise.reject(new Error("No url defined."));
    }

    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(request.method, request.url, true);
      xhr.withCredentials = true;
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); // Explicitly setting the Content-Type header for React Native on Android platform.

      xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
      var headers = request.headers;

      if (headers) {
        Object.keys(headers).forEach(function (header) {
          xhr.setRequestHeader(header, headers[header]);
        });
      }

      if (request.responseType) {
        xhr.responseType = request.responseType;
      }

      if (request.abortSignal) {
        request.abortSignal.onabort = function () {
          xhr.abort();
          reject(new _Errors.AbortError());
        };
      }

      if (request.timeout) {
        xhr.timeout = request.timeout;
      }

      xhr.onload = function () {
        if (request.abortSignal) {
          request.abortSignal.onabort = null;
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(new _HttpClient.HttpResponse(xhr.status, xhr.statusText, xhr.response || xhr.responseText));
        } else {
          reject(new _Errors.HttpError(xhr.statusText, xhr.status));
        }
      };

      xhr.onerror = function () {
        _this.logger.log(_ILogger.LogLevel.Warning, "Error from HTTP request. " + xhr.status + ": " + xhr.statusText + ".");

        reject(new _Errors.HttpError(xhr.statusText, xhr.status));
      };

      xhr.ontimeout = function () {
        _this.logger.log(_ILogger.LogLevel.Warning, "Timeout from HTTP request.");

        reject(new _Errors.TimeoutError());
      };

      xhr.send(request.content || "");
    });
  };

  return XhrHttpClient;
}(_HttpClient.HttpClient);

exports.XhrHttpClient = XhrHttpClient;
},{"./Errors":"node_modules/@aspnet/signalr/dist/esm/Errors.js","./HttpClient":"node_modules/@aspnet/signalr/dist/esm/HttpClient.js","./ILogger":"node_modules/@aspnet/signalr/dist/esm/ILogger.js"}],"node_modules/@aspnet/signalr/dist/esm/DefaultHttpClient.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultHttpClient = void 0;

var _Errors = require("./Errors");

var _HttpClient = require("./HttpClient");

var _NodeHttpClient = require("./NodeHttpClient");

var _XhrHttpClient = require("./XhrHttpClient");

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __extends = void 0 && (void 0).__extends || function () {
  var extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

/** Default implementation of {@link @aspnet/signalr.HttpClient}. */
var DefaultHttpClient =
/** @class */
function (_super) {
  __extends(DefaultHttpClient, _super);
  /** Creates a new instance of the {@link @aspnet/signalr.DefaultHttpClient}, using the provided {@link @aspnet/signalr.ILogger} to log messages. */


  function DefaultHttpClient(logger) {
    var _this = _super.call(this) || this;

    if (typeof XMLHttpRequest !== "undefined") {
      _this.httpClient = new _XhrHttpClient.XhrHttpClient(logger);
    } else {
      _this.httpClient = new _NodeHttpClient.NodeHttpClient(logger);
    }

    return _this;
  }
  /** @inheritDoc */


  DefaultHttpClient.prototype.send = function (request) {
    // Check that abort was not signaled before calling send
    if (request.abortSignal && request.abortSignal.aborted) {
      return Promise.reject(new _Errors.AbortError());
    }

    if (!request.method) {
      return Promise.reject(new Error("No method defined."));
    }

    if (!request.url) {
      return Promise.reject(new Error("No url defined."));
    }

    return this.httpClient.send(request);
  };

  DefaultHttpClient.prototype.getCookieString = function (url) {
    return this.httpClient.getCookieString(url);
  };

  return DefaultHttpClient;
}(_HttpClient.HttpClient);

exports.DefaultHttpClient = DefaultHttpClient;
},{"./Errors":"node_modules/@aspnet/signalr/dist/esm/Errors.js","./HttpClient":"node_modules/@aspnet/signalr/dist/esm/HttpClient.js","./NodeHttpClient":"node_modules/@aspnet/signalr/dist/esm/NodeHttpClient.js","./XhrHttpClient":"node_modules/@aspnet/signalr/dist/esm/XhrHttpClient.js"}],"node_modules/@aspnet/signalr/dist/esm/TextMessageFormat.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextMessageFormat = void 0;

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
// Not exported from index

/** @private */
var TextMessageFormat =
/** @class */
function () {
  function TextMessageFormat() {}

  TextMessageFormat.write = function (output) {
    return "" + output + TextMessageFormat.RecordSeparator;
  };

  TextMessageFormat.parse = function (input) {
    if (input[input.length - 1] !== TextMessageFormat.RecordSeparator) {
      throw new Error("Message is incomplete.");
    }

    var messages = input.split(TextMessageFormat.RecordSeparator);
    messages.pop();
    return messages;
  };

  TextMessageFormat.RecordSeparatorCode = 0x1e;
  TextMessageFormat.RecordSeparator = String.fromCharCode(TextMessageFormat.RecordSeparatorCode);
  return TextMessageFormat;
}();

exports.TextMessageFormat = TextMessageFormat;
},{}],"node_modules/@aspnet/signalr/dist/esm/HandshakeProtocol.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HandshakeProtocol = void 0;

var _TextMessageFormat = require("./TextMessageFormat");

var _Utils = require("./Utils");

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

/** @private */
var HandshakeProtocol =
/** @class */
function () {
  function HandshakeProtocol() {} // Handshake request is always JSON


  HandshakeProtocol.prototype.writeHandshakeRequest = function (handshakeRequest) {
    return _TextMessageFormat.TextMessageFormat.write(JSON.stringify(handshakeRequest));
  };

  HandshakeProtocol.prototype.parseHandshakeResponse = function (data) {
    var responseMessage;
    var messageData;
    var remainingData;

    if ((0, _Utils.isArrayBuffer)(data) || typeof Buffer !== "undefined" && data instanceof Buffer) {
      // Format is binary but still need to read JSON text from handshake response
      var binaryData = new Uint8Array(data);
      var separatorIndex = binaryData.indexOf(_TextMessageFormat.TextMessageFormat.RecordSeparatorCode);

      if (separatorIndex === -1) {
        throw new Error("Message is incomplete.");
      } // content before separator is handshake response
      // optional content after is additional messages


      var responseLength = separatorIndex + 1;
      messageData = String.fromCharCode.apply(null, binaryData.slice(0, responseLength));
      remainingData = binaryData.byteLength > responseLength ? binaryData.slice(responseLength).buffer : null;
    } else {
      var textData = data;
      var separatorIndex = textData.indexOf(_TextMessageFormat.TextMessageFormat.RecordSeparator);

      if (separatorIndex === -1) {
        throw new Error("Message is incomplete.");
      } // content before separator is handshake response
      // optional content after is additional messages


      var responseLength = separatorIndex + 1;
      messageData = textData.substring(0, responseLength);
      remainingData = textData.length > responseLength ? textData.substring(responseLength) : null;
    } // At this point we should have just the single handshake message


    var messages = _TextMessageFormat.TextMessageFormat.parse(messageData);

    var response = JSON.parse(messages[0]);

    if (response.type) {
      throw new Error("Expected a handshake response from the server.");
    }

    responseMessage = response; // multiple messages could have arrived with handshake
    // return additional data to be parsed as usual, or null if all parsed

    return [remainingData, responseMessage];
  };

  return HandshakeProtocol;
}();

exports.HandshakeProtocol = HandshakeProtocol;
},{"./TextMessageFormat":"node_modules/@aspnet/signalr/dist/esm/TextMessageFormat.js","./Utils":"node_modules/@aspnet/signalr/dist/esm/Utils.js","buffer":"node_modules/buffer/index.js"}],"node_modules/@aspnet/signalr/dist/esm/IHubProtocol.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageType = void 0;
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

/** Defines the type of a Hub Message. */
var MessageType;
exports.MessageType = MessageType;

(function (MessageType) {
  /** Indicates the message is an Invocation message and implements the {@link @aspnet/signalr.InvocationMessage} interface. */
  MessageType[MessageType["Invocation"] = 1] = "Invocation";
  /** Indicates the message is a StreamItem message and implements the {@link @aspnet/signalr.StreamItemMessage} interface. */

  MessageType[MessageType["StreamItem"] = 2] = "StreamItem";
  /** Indicates the message is a Completion message and implements the {@link @aspnet/signalr.CompletionMessage} interface. */

  MessageType[MessageType["Completion"] = 3] = "Completion";
  /** Indicates the message is a Stream Invocation message and implements the {@link @aspnet/signalr.StreamInvocationMessage} interface. */

  MessageType[MessageType["StreamInvocation"] = 4] = "StreamInvocation";
  /** Indicates the message is a Cancel Invocation message and implements the {@link @aspnet/signalr.CancelInvocationMessage} interface. */

  MessageType[MessageType["CancelInvocation"] = 5] = "CancelInvocation";
  /** Indicates the message is a Ping message and implements the {@link @aspnet/signalr.PingMessage} interface. */

  MessageType[MessageType["Ping"] = 6] = "Ping";
  /** Indicates the message is a Close message and implements the {@link @aspnet/signalr.CloseMessage} interface. */

  MessageType[MessageType["Close"] = 7] = "Close";
})(MessageType || (exports.MessageType = MessageType = {}));
},{}],"node_modules/@aspnet/signalr/dist/esm/HubConnection.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HubConnection = exports.HubConnectionState = void 0;

var _HandshakeProtocol = require("./HandshakeProtocol");

var _IHubProtocol = require("./IHubProtocol");

var _ILogger = require("./ILogger");

var _Utils = require("./Utils");

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var DEFAULT_TIMEOUT_IN_MS = 30 * 1000;
var DEFAULT_PING_INTERVAL_IN_MS = 15 * 1000;
/** Describes the current state of the {@link HubConnection} to the server. */

var HubConnectionState;
exports.HubConnectionState = HubConnectionState;

(function (HubConnectionState) {
  /** The hub connection is disconnected. */
  HubConnectionState[HubConnectionState["Disconnected"] = 0] = "Disconnected";
  /** The hub connection is connected. */

  HubConnectionState[HubConnectionState["Connected"] = 1] = "Connected";
})(HubConnectionState || (exports.HubConnectionState = HubConnectionState = {}));
/** Represents a connection to a SignalR Hub. */


var HubConnection =
/** @class */
function () {
  function HubConnection(connection, logger, protocol) {
    var _this = this;

    _Utils.Arg.isRequired(connection, "connection");

    _Utils.Arg.isRequired(logger, "logger");

    _Utils.Arg.isRequired(protocol, "protocol");

    this.serverTimeoutInMilliseconds = DEFAULT_TIMEOUT_IN_MS;
    this.keepAliveIntervalInMilliseconds = DEFAULT_PING_INTERVAL_IN_MS;
    this.logger = logger;
    this.protocol = protocol;
    this.connection = connection;
    this.handshakeProtocol = new _HandshakeProtocol.HandshakeProtocol();

    this.connection.onreceive = function (data) {
      return _this.processIncomingData(data);
    };

    this.connection.onclose = function (error) {
      return _this.connectionClosed(error);
    };

    this.callbacks = {};
    this.methods = {};
    this.closedCallbacks = [];
    this.id = 0;
    this.receivedHandshakeResponse = false;
    this.connectionState = HubConnectionState.Disconnected;
    this.cachedPingMessage = this.protocol.writeMessage({
      type: _IHubProtocol.MessageType.Ping
    });
  }
  /** @internal */
  // Using a public static factory method means we can have a private constructor and an _internal_
  // create method that can be used by HubConnectionBuilder. An "internal" constructor would just
  // be stripped away and the '.d.ts' file would have no constructor, which is interpreted as a
  // public parameter-less constructor.


  HubConnection.create = function (connection, logger, protocol) {
    return new HubConnection(connection, logger, protocol);
  };

  Object.defineProperty(HubConnection.prototype, "state", {
    /** Indicates the state of the {@link HubConnection} to the server. */
    get: function () {
      return this.connectionState;
    },
    enumerable: true,
    configurable: true
  });
  /** Starts the connection.
   *
   * @returns {Promise<void>} A Promise that resolves when the connection has been successfully established, or rejects with an error.
   */

  HubConnection.prototype.start = function () {
    return __awaiter(this, void 0, void 0, function () {
      var handshakeRequest, handshakePromise;

      var _this = this;

      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            handshakeRequest = {
              protocol: this.protocol.name,
              version: this.protocol.version
            };
            this.logger.log(_ILogger.LogLevel.Debug, "Starting HubConnection.");
            this.receivedHandshakeResponse = false;
            handshakePromise = new Promise(function (resolve, reject) {
              _this.handshakeResolver = resolve;
              _this.handshakeRejecter = reject;
            });
            return [4
            /*yield*/
            , this.connection.start(this.protocol.transferFormat)];

          case 1:
            _a.sent();

            this.logger.log(_ILogger.LogLevel.Debug, "Sending handshake request.");
            return [4
            /*yield*/
            , this.sendMessage(this.handshakeProtocol.writeHandshakeRequest(handshakeRequest))];

          case 2:
            _a.sent();

            this.logger.log(_ILogger.LogLevel.Information, "Using HubProtocol '" + this.protocol.name + "'."); // defensively cleanup timeout in case we receive a message from the server before we finish start

            this.cleanupTimeout();
            this.resetTimeoutPeriod();
            this.resetKeepAliveInterval(); // Wait for the handshake to complete before marking connection as connected

            return [4
            /*yield*/
            , handshakePromise];

          case 3:
            // Wait for the handshake to complete before marking connection as connected
            _a.sent();

            this.connectionState = HubConnectionState.Connected;
            return [2
            /*return*/
            ];
        }
      });
    });
  };
  /** Stops the connection.
   *
   * @returns {Promise<void>} A Promise that resolves when the connection has been successfully terminated, or rejects with an error.
   */


  HubConnection.prototype.stop = function () {
    this.logger.log(_ILogger.LogLevel.Debug, "Stopping HubConnection.");
    this.cleanupTimeout();
    this.cleanupPingTimer();
    return this.connection.stop();
  };
  /** Invokes a streaming hub method on the server using the specified name and arguments.
   *
   * @typeparam T The type of the items returned by the server.
   * @param {string} methodName The name of the server method to invoke.
   * @param {any[]} args The arguments used to invoke the server method.
   * @returns {IStreamResult<T>} An object that yields results from the server as they are received.
   */


  HubConnection.prototype.stream = function (methodName) {
    var _this = this;

    var args = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }

    var invocationDescriptor = this.createStreamInvocation(methodName, args);
    var promiseQueue;
    var subject = new _Utils.Subject();

    subject.cancelCallback = function () {
      var cancelInvocation = _this.createCancelInvocation(invocationDescriptor.invocationId);

      var cancelMessage = _this.protocol.writeMessage(cancelInvocation);

      delete _this.callbacks[invocationDescriptor.invocationId];
      return promiseQueue.then(function () {
        return _this.sendMessage(cancelMessage);
      });
    };

    this.callbacks[invocationDescriptor.invocationId] = function (invocationEvent, error) {
      if (error) {
        subject.error(error);
        return;
      } else if (invocationEvent) {
        // invocationEvent will not be null when an error is not passed to the callback
        if (invocationEvent.type === _IHubProtocol.MessageType.Completion) {
          if (invocationEvent.error) {
            subject.error(new Error(invocationEvent.error));
          } else {
            subject.complete();
          }
        } else {
          subject.next(invocationEvent.item);
        }
      }
    };

    var message = this.protocol.writeMessage(invocationDescriptor);
    promiseQueue = this.sendMessage(message).catch(function (e) {
      subject.error(e);
      delete _this.callbacks[invocationDescriptor.invocationId];
    });
    return subject;
  };

  HubConnection.prototype.sendMessage = function (message) {
    this.resetKeepAliveInterval();
    return this.connection.send(message);
  };
  /** Invokes a hub method on the server using the specified name and arguments. Does not wait for a response from the receiver.
   *
   * The Promise returned by this method resolves when the client has sent the invocation to the server. The server may still
   * be processing the invocation.
   *
   * @param {string} methodName The name of the server method to invoke.
   * @param {any[]} args The arguments used to invoke the server method.
   * @returns {Promise<void>} A Promise that resolves when the invocation has been successfully sent, or rejects with an error.
   */


  HubConnection.prototype.send = function (methodName) {
    var args = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }

    var invocationDescriptor = this.createInvocation(methodName, args, true);
    var message = this.protocol.writeMessage(invocationDescriptor);
    return this.sendMessage(message);
  };
  /** Invokes a hub method on the server using the specified name and arguments.
   *
   * The Promise returned by this method resolves when the server indicates it has finished invoking the method. When the promise
   * resolves, the server has finished invoking the method. If the server method returns a result, it is produced as the result of
   * resolving the Promise.
   *
   * @typeparam T The expected return type.
   * @param {string} methodName The name of the server method to invoke.
   * @param {any[]} args The arguments used to invoke the server method.
   * @returns {Promise<T>} A Promise that resolves with the result of the server method (if any), or rejects with an error.
   */


  HubConnection.prototype.invoke = function (methodName) {
    var _this = this;

    var args = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }

    var invocationDescriptor = this.createInvocation(methodName, args, false);
    var p = new Promise(function (resolve, reject) {
      // invocationId will always have a value for a non-blocking invocation
      _this.callbacks[invocationDescriptor.invocationId] = function (invocationEvent, error) {
        if (error) {
          reject(error);
          return;
        } else if (invocationEvent) {
          // invocationEvent will not be null when an error is not passed to the callback
          if (invocationEvent.type === _IHubProtocol.MessageType.Completion) {
            if (invocationEvent.error) {
              reject(new Error(invocationEvent.error));
            } else {
              resolve(invocationEvent.result);
            }
          } else {
            reject(new Error("Unexpected message type: " + invocationEvent.type));
          }
        }
      };

      var message = _this.protocol.writeMessage(invocationDescriptor);

      _this.sendMessage(message).catch(function (e) {
        reject(e); // invocationId will always have a value for a non-blocking invocation

        delete _this.callbacks[invocationDescriptor.invocationId];
      });
    });
    return p;
  };
  /** Registers a handler that will be invoked when the hub method with the specified method name is invoked.
   *
   * @param {string} methodName The name of the hub method to define.
   * @param {Function} newMethod The handler that will be raised when the hub method is invoked.
   */


  HubConnection.prototype.on = function (methodName, newMethod) {
    if (!methodName || !newMethod) {
      return;
    }

    methodName = methodName.toLowerCase();

    if (!this.methods[methodName]) {
      this.methods[methodName] = [];
    } // Preventing adding the same handler multiple times.


    if (this.methods[methodName].indexOf(newMethod) !== -1) {
      return;
    }

    this.methods[methodName].push(newMethod);
  };

  HubConnection.prototype.off = function (methodName, method) {
    if (!methodName) {
      return;
    }

    methodName = methodName.toLowerCase();
    var handlers = this.methods[methodName];

    if (!handlers) {
      return;
    }

    if (method) {
      var removeIdx = handlers.indexOf(method);

      if (removeIdx !== -1) {
        handlers.splice(removeIdx, 1);

        if (handlers.length === 0) {
          delete this.methods[methodName];
        }
      }
    } else {
      delete this.methods[methodName];
    }
  };
  /** Registers a handler that will be invoked when the connection is closed.
   *
   * @param {Function} callback The handler that will be invoked when the connection is closed. Optionally receives a single argument containing the error that caused the connection to close (if any).
   */


  HubConnection.prototype.onclose = function (callback) {
    if (callback) {
      this.closedCallbacks.push(callback);
    }
  };

  HubConnection.prototype.processIncomingData = function (data) {
    this.cleanupTimeout();

    if (!this.receivedHandshakeResponse) {
      data = this.processHandshakeResponse(data);
      this.receivedHandshakeResponse = true;
    } // Data may have all been read when processing handshake response


    if (data) {
      // Parse the messages
      var messages = this.protocol.parseMessages(data, this.logger);

      for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
        var message = messages_1[_i];

        switch (message.type) {
          case _IHubProtocol.MessageType.Invocation:
            this.invokeClientMethod(message);
            break;

          case _IHubProtocol.MessageType.StreamItem:
          case _IHubProtocol.MessageType.Completion:
            var callback = this.callbacks[message.invocationId];

            if (callback != null) {
              if (message.type === _IHubProtocol.MessageType.Completion) {
                delete this.callbacks[message.invocationId];
              }

              callback(message);
            }

            break;

          case _IHubProtocol.MessageType.Ping:
            // Don't care about pings
            break;

          case _IHubProtocol.MessageType.Close:
            this.logger.log(_ILogger.LogLevel.Information, "Close message received from server."); // We don't want to wait on the stop itself.
            // tslint:disable-next-line:no-floating-promises

            this.connection.stop(message.error ? new Error("Server returned an error on close: " + message.error) : undefined);
            break;

          default:
            this.logger.log(_ILogger.LogLevel.Warning, "Invalid message type: " + message.type + ".");
            break;
        }
      }
    }

    this.resetTimeoutPeriod();
  };

  HubConnection.prototype.processHandshakeResponse = function (data) {
    var _a;

    var responseMessage;
    var remainingData;

    try {
      _a = this.handshakeProtocol.parseHandshakeResponse(data), remainingData = _a[0], responseMessage = _a[1];
    } catch (e) {
      var message = "Error parsing handshake response: " + e;
      this.logger.log(_ILogger.LogLevel.Error, message);
      var error = new Error(message); // We don't want to wait on the stop itself.
      // tslint:disable-next-line:no-floating-promises

      this.connection.stop(error);
      this.handshakeRejecter(error);
      throw error;
    }

    if (responseMessage.error) {
      var message = "Server returned handshake error: " + responseMessage.error;
      this.logger.log(_ILogger.LogLevel.Error, message);
      this.handshakeRejecter(message); // We don't want to wait on the stop itself.
      // tslint:disable-next-line:no-floating-promises

      this.connection.stop(new Error(message));
      throw new Error(message);
    } else {
      this.logger.log(_ILogger.LogLevel.Debug, "Server handshake complete.");
    }

    this.handshakeResolver();
    return remainingData;
  };

  HubConnection.prototype.resetKeepAliveInterval = function () {
    var _this = this;

    this.cleanupPingTimer();
    this.pingServerHandle = setTimeout(function () {
      return __awaiter(_this, void 0, void 0, function () {
        var _a;

        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              if (!(this.connectionState === HubConnectionState.Connected)) return [3
              /*break*/
              , 4];
              _b.label = 1;

            case 1:
              _b.trys.push([1, 3,, 4]);

              return [4
              /*yield*/
              , this.sendMessage(this.cachedPingMessage)];

            case 2:
              _b.sent();

              return [3
              /*break*/
              , 4];

            case 3:
              _a = _b.sent(); // We don't care about the error. It should be seen elsewhere in the client.
              // The connection is probably in a bad or closed state now, cleanup the timer so it stops triggering

              this.cleanupPingTimer();
              return [3
              /*break*/
              , 4];

            case 4:
              return [2
              /*return*/
              ];
          }
        });
      });
    }, this.keepAliveIntervalInMilliseconds);
  };

  HubConnection.prototype.resetTimeoutPeriod = function () {
    var _this = this;

    if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
      // Set the timeout timer
      this.timeoutHandle = setTimeout(function () {
        return _this.serverTimeout();
      }, this.serverTimeoutInMilliseconds);
    }
  };

  HubConnection.prototype.serverTimeout = function () {
    // The server hasn't talked to us in a while. It doesn't like us anymore ... :(
    // Terminate the connection, but we don't need to wait on the promise.
    // tslint:disable-next-line:no-floating-promises
    this.connection.stop(new Error("Server timeout elapsed without receiving a message from the server."));
  };

  HubConnection.prototype.invokeClientMethod = function (invocationMessage) {
    var _this = this;

    var methods = this.methods[invocationMessage.target.toLowerCase()];

    if (methods) {
      methods.forEach(function (m) {
        return m.apply(_this, invocationMessage.arguments);
      });

      if (invocationMessage.invocationId) {
        // This is not supported in v1. So we return an error to avoid blocking the server waiting for the response.
        var message = "Server requested a response, which is not supported in this version of the client.";
        this.logger.log(_ILogger.LogLevel.Error, message); // We don't need to wait on this Promise.
        // tslint:disable-next-line:no-floating-promises

        this.connection.stop(new Error(message));
      }
    } else {
      this.logger.log(_ILogger.LogLevel.Warning, "No client method with the name '" + invocationMessage.target + "' found.");
    }
  };

  HubConnection.prototype.connectionClosed = function (error) {
    var _this = this;

    var callbacks = this.callbacks;
    this.callbacks = {};
    this.connectionState = HubConnectionState.Disconnected; // if handshake is in progress start will be waiting for the handshake promise, so we complete it
    // if it has already completed this should just noop

    if (this.handshakeRejecter) {
      this.handshakeRejecter(error);
    }

    Object.keys(callbacks).forEach(function (key) {
      var callback = callbacks[key];
      callback(null, error ? error : new Error("Invocation canceled due to connection being closed."));
    });
    this.cleanupTimeout();
    this.cleanupPingTimer();
    this.closedCallbacks.forEach(function (c) {
      return c.apply(_this, [error]);
    });
  };

  HubConnection.prototype.cleanupPingTimer = function () {
    if (this.pingServerHandle) {
      clearTimeout(this.pingServerHandle);
    }
  };

  HubConnection.prototype.cleanupTimeout = function () {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
  };

  HubConnection.prototype.createInvocation = function (methodName, args, nonblocking) {
    if (nonblocking) {
      return {
        arguments: args,
        target: methodName,
        type: _IHubProtocol.MessageType.Invocation
      };
    } else {
      var id = this.id;
      this.id++;
      return {
        arguments: args,
        invocationId: id.toString(),
        target: methodName,
        type: _IHubProtocol.MessageType.Invocation
      };
    }
  };

  HubConnection.prototype.createStreamInvocation = function (methodName, args) {
    var id = this.id;
    this.id++;
    return {
      arguments: args,
      invocationId: id.toString(),
      target: methodName,
      type: _IHubProtocol.MessageType.StreamInvocation
    };
  };

  HubConnection.prototype.createCancelInvocation = function (id) {
    return {
      invocationId: id,
      type: _IHubProtocol.MessageType.CancelInvocation
    };
  };

  return HubConnection;
}();

exports.HubConnection = HubConnection;
},{"./HandshakeProtocol":"node_modules/@aspnet/signalr/dist/esm/HandshakeProtocol.js","./IHubProtocol":"node_modules/@aspnet/signalr/dist/esm/IHubProtocol.js","./ILogger":"node_modules/@aspnet/signalr/dist/esm/ILogger.js","./Utils":"node_modules/@aspnet/signalr/dist/esm/Utils.js"}],"node_modules/@aspnet/signalr/dist/esm/ITransport.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransferFormat = exports.HttpTransportType = void 0;
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
// This will be treated as a bit flag in the future, so we keep it using power-of-two values.

/** Specifies a specific HTTP transport type. */
var HttpTransportType;
exports.HttpTransportType = HttpTransportType;

(function (HttpTransportType) {
  /** Specifies no transport preference. */
  HttpTransportType[HttpTransportType["None"] = 0] = "None";
  /** Specifies the WebSockets transport. */

  HttpTransportType[HttpTransportType["WebSockets"] = 1] = "WebSockets";
  /** Specifies the Server-Sent Events transport. */

  HttpTransportType[HttpTransportType["ServerSentEvents"] = 2] = "ServerSentEvents";
  /** Specifies the Long Polling transport. */

  HttpTransportType[HttpTransportType["LongPolling"] = 4] = "LongPolling";
})(HttpTransportType || (exports.HttpTransportType = HttpTransportType = {}));
/** Specifies the transfer format for a connection. */


var TransferFormat;
exports.TransferFormat = TransferFormat;

(function (TransferFormat) {
  /** Specifies that only text data will be transmitted over the connection. */
  TransferFormat[TransferFormat["Text"] = 1] = "Text";
  /** Specifies that binary data will be transmitted over the connection. */

  TransferFormat[TransferFormat["Binary"] = 2] = "Binary";
})(TransferFormat || (exports.TransferFormat = TransferFormat = {}));
},{}],"node_modules/@aspnet/signalr/dist/esm/AbortController.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbortController = void 0;

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
// Rough polyfill of https://developer.mozilla.org/en-US/docs/Web/API/AbortController
// We don't actually ever use the API being polyfilled, we always use the polyfill because
// it's a very new API right now.
// Not exported from index.

/** @private */
var AbortController =
/** @class */
function () {
  function AbortController() {
    this.isAborted = false;
    this.onabort = null;
  }

  AbortController.prototype.abort = function () {
    if (!this.isAborted) {
      this.isAborted = true;

      if (this.onabort) {
        this.onabort();
      }
    }
  };

  Object.defineProperty(AbortController.prototype, "signal", {
    get: function () {
      return this;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(AbortController.prototype, "aborted", {
    get: function () {
      return this.isAborted;
    },
    enumerable: true,
    configurable: true
  });
  return AbortController;
}();

exports.AbortController = AbortController;
},{}],"node_modules/@aspnet/signalr/dist/esm/LongPollingTransport.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LongPollingTransport = void 0;

var _AbortController = require("./AbortController");

var _Errors = require("./Errors");

var _ILogger = require("./ILogger");

var _ITransport = require("./ITransport");

var _Utils = require("./Utils");

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

// Not exported from 'index', this type is internal.

/** @private */
var LongPollingTransport =
/** @class */
function () {
  function LongPollingTransport(httpClient, accessTokenFactory, logger, logMessageContent) {
    this.httpClient = httpClient;
    this.accessTokenFactory = accessTokenFactory;
    this.logger = logger;
    this.pollAbort = new _AbortController.AbortController();
    this.logMessageContent = logMessageContent;
    this.running = false;
    this.onreceive = null;
    this.onclose = null;
  }

  Object.defineProperty(LongPollingTransport.prototype, "pollAborted", {
    // This is an internal type, not exported from 'index' so this is really just internal.
    get: function () {
      return this.pollAbort.aborted;
    },
    enumerable: true,
    configurable: true
  });

  LongPollingTransport.prototype.connect = function (url, transferFormat) {
    return __awaiter(this, void 0, void 0, function () {
      var pollOptions, token, pollUrl, response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _Utils.Arg.isRequired(url, "url");

            _Utils.Arg.isRequired(transferFormat, "transferFormat");

            _Utils.Arg.isIn(transferFormat, _ITransport.TransferFormat, "transferFormat");

            this.url = url;
            this.logger.log(_ILogger.LogLevel.Trace, "(LongPolling transport) Connecting."); // Allow binary format on Node and Browsers that support binary content (indicated by the presence of responseType property)

            if (transferFormat === _ITransport.TransferFormat.Binary && typeof XMLHttpRequest !== "undefined" && typeof new XMLHttpRequest().responseType !== "string") {
              throw new Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
            }

            pollOptions = {
              abortSignal: this.pollAbort.signal,
              headers: {},
              timeout: 100000
            };

            if (transferFormat === _ITransport.TransferFormat.Binary) {
              pollOptions.responseType = "arraybuffer";
            }

            return [4
            /*yield*/
            , this.getAccessToken()];

          case 1:
            token = _a.sent();
            this.updateHeaderToken(pollOptions, token);
            pollUrl = url + "&_=" + Date.now();
            this.logger.log(_ILogger.LogLevel.Trace, "(LongPolling transport) polling: " + pollUrl + ".");
            return [4
            /*yield*/
            , this.httpClient.get(pollUrl, pollOptions)];

          case 2:
            response = _a.sent();

            if (response.statusCode !== 200) {
              this.logger.log(_ILogger.LogLevel.Error, "(LongPolling transport) Unexpected response code: " + response.statusCode + "."); // Mark running as false so that the poll immediately ends and runs the close logic

              this.closeError = new _Errors.HttpError(response.statusText || "", response.statusCode);
              this.running = false;
            } else {
              this.running = true;
            }

            this.receiving = this.poll(this.url, pollOptions);
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  LongPollingTransport.prototype.getAccessToken = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!this.accessTokenFactory) return [3
            /*break*/
            , 2];
            return [4
            /*yield*/
            , this.accessTokenFactory()];

          case 1:
            return [2
            /*return*/
            , _a.sent()];

          case 2:
            return [2
            /*return*/
            , null];
        }
      });
    });
  };

  LongPollingTransport.prototype.updateHeaderToken = function (request, token) {
    if (!request.headers) {
      request.headers = {};
    }

    if (token) {
      // tslint:disable-next-line:no-string-literal
      request.headers["Authorization"] = "Bearer " + token;
      return;
    } // tslint:disable-next-line:no-string-literal


    if (request.headers["Authorization"]) {
      // tslint:disable-next-line:no-string-literal
      delete request.headers["Authorization"];
    }
  };

  LongPollingTransport.prototype.poll = function (url, pollOptions) {
    return __awaiter(this, void 0, void 0, function () {
      var token, pollUrl, response, e_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0,, 8, 9]);

            _a.label = 1;

          case 1:
            if (!this.running) return [3
            /*break*/
            , 7];
            return [4
            /*yield*/
            , this.getAccessToken()];

          case 2:
            token = _a.sent();
            this.updateHeaderToken(pollOptions, token);
            _a.label = 3;

          case 3:
            _a.trys.push([3, 5,, 6]);

            pollUrl = url + "&_=" + Date.now();
            this.logger.log(_ILogger.LogLevel.Trace, "(LongPolling transport) polling: " + pollUrl + ".");
            return [4
            /*yield*/
            , this.httpClient.get(pollUrl, pollOptions)];

          case 4:
            response = _a.sent();

            if (response.statusCode === 204) {
              this.logger.log(_ILogger.LogLevel.Information, "(LongPolling transport) Poll terminated by server.");
              this.running = false;
            } else if (response.statusCode !== 200) {
              this.logger.log(_ILogger.LogLevel.Error, "(LongPolling transport) Unexpected response code: " + response.statusCode + "."); // Unexpected status code

              this.closeError = new _Errors.HttpError(response.statusText || "", response.statusCode);
              this.running = false;
            } else {
              // Process the response
              if (response.content) {
                this.logger.log(_ILogger.LogLevel.Trace, "(LongPolling transport) data received. " + (0, _Utils.getDataDetail)(response.content, this.logMessageContent) + ".");

                if (this.onreceive) {
                  this.onreceive(response.content);
                }
              } else {
                // This is another way timeout manifest.
                this.logger.log(_ILogger.LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
              }
            }

            return [3
            /*break*/
            , 6];

          case 5:
            e_1 = _a.sent();

            if (!this.running) {
              // Log but disregard errors that occur after stopping
              this.logger.log(_ILogger.LogLevel.Trace, "(LongPolling transport) Poll errored after shutdown: " + e_1.message);
            } else {
              if (e_1 instanceof _Errors.TimeoutError) {
                // Ignore timeouts and reissue the poll.
                this.logger.log(_ILogger.LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
              } else {
                // Close the connection with the error as the result.
                this.closeError = e_1;
                this.running = false;
              }
            }

            return [3
            /*break*/
            , 6];

          case 6:
            return [3
            /*break*/
            , 1];

          case 7:
            return [3
            /*break*/
            , 9];

          case 8:
            this.logger.log(_ILogger.LogLevel.Trace, "(LongPolling transport) Polling complete."); // We will reach here with pollAborted==false when the server returned a response causing the transport to stop.
            // If pollAborted==true then client initiated the stop and the stop method will raise the close event after DELETE is sent.

            if (!this.pollAborted) {
              this.raiseOnClose();
            }

            return [7
            /*endfinally*/
            ];

          case 9:
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  LongPollingTransport.prototype.send = function (data) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        if (!this.running) {
          return [2
          /*return*/
          , Promise.reject(new Error("Cannot send until the transport is connected"))];
        }

        return [2
        /*return*/
        , (0, _Utils.sendMessage)(this.logger, "LongPolling", this.httpClient, this.url, this.accessTokenFactory, data, this.logMessageContent)];
      });
    });
  };

  LongPollingTransport.prototype.stop = function () {
    return __awaiter(this, void 0, void 0, function () {
      var deleteOptions, token;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            this.logger.log(_ILogger.LogLevel.Trace, "(LongPolling transport) Stopping polling."); // Tell receiving loop to stop, abort any current request, and then wait for it to finish

            this.running = false;
            this.pollAbort.abort();
            _a.label = 1;

          case 1:
            _a.trys.push([1,, 5, 6]);

            return [4
            /*yield*/
            , this.receiving];

          case 2:
            _a.sent(); // Send DELETE to clean up long polling on the server


            this.logger.log(_ILogger.LogLevel.Trace, "(LongPolling transport) sending DELETE request to " + this.url + ".");
            deleteOptions = {
              headers: {}
            };
            return [4
            /*yield*/
            , this.getAccessToken()];

          case 3:
            token = _a.sent();
            this.updateHeaderToken(deleteOptions, token);
            return [4
            /*yield*/
            , this.httpClient.delete(this.url, deleteOptions)];

          case 4:
            _a.sent();

            this.logger.log(_ILogger.LogLevel.Trace, "(LongPolling transport) DELETE request sent.");
            return [3
            /*break*/
            , 6];

          case 5:
            this.logger.log(_ILogger.LogLevel.Trace, "(LongPolling transport) Stop finished."); // Raise close event here instead of in polling
            // It needs to happen after the DELETE request is sent

            this.raiseOnClose();
            return [7
            /*endfinally*/
            ];

          case 6:
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  LongPollingTransport.prototype.raiseOnClose = function () {
    if (this.onclose) {
      var logMessage = "(LongPolling transport) Firing onclose event.";

      if (this.closeError) {
        logMessage += " Error: " + this.closeError;
      }

      this.logger.log(_ILogger.LogLevel.Trace, logMessage);
      this.onclose(this.closeError);
    }
  };

  return LongPollingTransport;
}();

exports.LongPollingTransport = LongPollingTransport;
},{"./AbortController":"node_modules/@aspnet/signalr/dist/esm/AbortController.js","./Errors":"node_modules/@aspnet/signalr/dist/esm/Errors.js","./ILogger":"node_modules/@aspnet/signalr/dist/esm/ILogger.js","./ITransport":"node_modules/@aspnet/signalr/dist/esm/ITransport.js","./Utils":"node_modules/@aspnet/signalr/dist/esm/Utils.js"}],"node_modules/@aspnet/signalr/dist/esm/ServerSentEventsTransport.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServerSentEventsTransport = void 0;

var _ILogger = require("./ILogger");

var _ITransport = require("./ITransport");

var _Utils = require("./Utils");

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

/** @private */
var ServerSentEventsTransport =
/** @class */
function () {
  function ServerSentEventsTransport(httpClient, accessTokenFactory, logger, logMessageContent, eventSourceConstructor) {
    this.httpClient = httpClient;
    this.accessTokenFactory = accessTokenFactory;
    this.logger = logger;
    this.logMessageContent = logMessageContent;
    this.eventSourceConstructor = eventSourceConstructor;
    this.onreceive = null;
    this.onclose = null;
  }

  ServerSentEventsTransport.prototype.connect = function (url, transferFormat) {
    return __awaiter(this, void 0, void 0, function () {
      var token;

      var _this = this;

      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _Utils.Arg.isRequired(url, "url");

            _Utils.Arg.isRequired(transferFormat, "transferFormat");

            _Utils.Arg.isIn(transferFormat, _ITransport.TransferFormat, "transferFormat");

            this.logger.log(_ILogger.LogLevel.Trace, "(SSE transport) Connecting."); // set url before accessTokenFactory because this.url is only for send and we set the auth header instead of the query string for send

            this.url = url;
            if (!this.accessTokenFactory) return [3
            /*break*/
            , 2];
            return [4
            /*yield*/
            , this.accessTokenFactory()];

          case 1:
            token = _a.sent();

            if (token) {
              url += (url.indexOf("?") < 0 ? "?" : "&") + ("access_token=" + encodeURIComponent(token));
            }

            _a.label = 2;

          case 2:
            return [2
            /*return*/
            , new Promise(function (resolve, reject) {
              var opened = false;

              if (transferFormat !== _ITransport.TransferFormat.Text) {
                reject(new Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
                return;
              }

              var eventSource;

              if (typeof window !== "undefined") {
                eventSource = new _this.eventSourceConstructor(url, {
                  withCredentials: true
                });
              } else {
                // Non-browser passes cookies via the dictionary
                var cookies = _this.httpClient.getCookieString(url);

                eventSource = new _this.eventSourceConstructor(url, {
                  withCredentials: true,
                  headers: {
                    Cookie: cookies
                  }
                });
              }

              try {
                eventSource.onmessage = function (e) {
                  if (_this.onreceive) {
                    try {
                      _this.logger.log(_ILogger.LogLevel.Trace, "(SSE transport) data received. " + (0, _Utils.getDataDetail)(e.data, _this.logMessageContent) + ".");

                      _this.onreceive(e.data);
                    } catch (error) {
                      _this.close(error);

                      return;
                    }
                  }
                };

                eventSource.onerror = function (e) {
                  var error = new Error(e.data || "Error occurred");

                  if (opened) {
                    _this.close(error);
                  } else {
                    reject(error);
                  }
                };

                eventSource.onopen = function () {
                  _this.logger.log(_ILogger.LogLevel.Information, "SSE connected to " + _this.url);

                  _this.eventSource = eventSource;
                  opened = true;
                  resolve();
                };
              } catch (e) {
                reject(e);
                return;
              }
            })];
        }
      });
    });
  };

  ServerSentEventsTransport.prototype.send = function (data) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        if (!this.eventSource) {
          return [2
          /*return*/
          , Promise.reject(new Error("Cannot send until the transport is connected"))];
        }

        return [2
        /*return*/
        , (0, _Utils.sendMessage)(this.logger, "SSE", this.httpClient, this.url, this.accessTokenFactory, data, this.logMessageContent)];
      });
    });
  };

  ServerSentEventsTransport.prototype.stop = function () {
    this.close();
    return Promise.resolve();
  };

  ServerSentEventsTransport.prototype.close = function (e) {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;

      if (this.onclose) {
        this.onclose(e);
      }
    }
  };

  return ServerSentEventsTransport;
}();

exports.ServerSentEventsTransport = ServerSentEventsTransport;
},{"./ILogger":"node_modules/@aspnet/signalr/dist/esm/ILogger.js","./ITransport":"node_modules/@aspnet/signalr/dist/esm/ITransport.js","./Utils":"node_modules/@aspnet/signalr/dist/esm/Utils.js"}],"node_modules/@aspnet/signalr/dist/esm/WebSocketTransport.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebSocketTransport = void 0;

var _ILogger = require("./ILogger");

var _ITransport = require("./ITransport");

var _Utils = require("./Utils");

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

/** @private */
var WebSocketTransport =
/** @class */
function () {
  function WebSocketTransport(httpClient, accessTokenFactory, logger, logMessageContent, webSocketConstructor) {
    this.logger = logger;
    this.accessTokenFactory = accessTokenFactory;
    this.logMessageContent = logMessageContent;
    this.webSocketConstructor = webSocketConstructor;
    this.httpClient = httpClient;
    this.onreceive = null;
    this.onclose = null;
  }

  WebSocketTransport.prototype.connect = function (url, transferFormat) {
    return __awaiter(this, void 0, void 0, function () {
      var token;

      var _this = this;

      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _Utils.Arg.isRequired(url, "url");

            _Utils.Arg.isRequired(transferFormat, "transferFormat");

            _Utils.Arg.isIn(transferFormat, _ITransport.TransferFormat, "transferFormat");

            this.logger.log(_ILogger.LogLevel.Trace, "(WebSockets transport) Connecting.");
            if (!this.accessTokenFactory) return [3
            /*break*/
            , 2];
            return [4
            /*yield*/
            , this.accessTokenFactory()];

          case 1:
            token = _a.sent();

            if (token) {
              url += (url.indexOf("?") < 0 ? "?" : "&") + ("access_token=" + encodeURIComponent(token));
            }

            _a.label = 2;

          case 2:
            return [2
            /*return*/
            , new Promise(function (resolve, reject) {
              url = url.replace(/^http/, "ws");
              var webSocket;

              var cookies = _this.httpClient.getCookieString(url);

              if (typeof window === "undefined" && cookies) {
                // Only pass cookies when in non-browser environments
                webSocket = new _this.webSocketConstructor(url, undefined, {
                  headers: {
                    Cookie: "" + cookies
                  }
                });
              }

              if (!webSocket) {
                // Chrome is not happy with passing 'undefined' as protocol
                webSocket = new _this.webSocketConstructor(url);
              }

              if (transferFormat === _ITransport.TransferFormat.Binary) {
                webSocket.binaryType = "arraybuffer";
              } // tslint:disable-next-line:variable-name


              webSocket.onopen = function (_event) {
                _this.logger.log(_ILogger.LogLevel.Information, "WebSocket connected to " + url + ".");

                _this.webSocket = webSocket;
                resolve();
              };

              webSocket.onerror = function (event) {
                var error = null; // ErrorEvent is a browser only type we need to check if the type exists before using it

                if (typeof ErrorEvent !== "undefined" && event instanceof ErrorEvent) {
                  error = event.error;
                }

                reject(error);
              };

              webSocket.onmessage = function (message) {
                _this.logger.log(_ILogger.LogLevel.Trace, "(WebSockets transport) data received. " + (0, _Utils.getDataDetail)(message.data, _this.logMessageContent) + ".");

                if (_this.onreceive) {
                  _this.onreceive(message.data);
                }
              };

              webSocket.onclose = function (event) {
                return _this.close(event);
              };
            })];
        }
      });
    });
  };

  WebSocketTransport.prototype.send = function (data) {
    if (this.webSocket && this.webSocket.readyState === this.webSocketConstructor.OPEN) {
      this.logger.log(_ILogger.LogLevel.Trace, "(WebSockets transport) sending data. " + (0, _Utils.getDataDetail)(data, this.logMessageContent) + ".");
      this.webSocket.send(data);
      return Promise.resolve();
    }

    return Promise.reject("WebSocket is not in the OPEN state");
  };

  WebSocketTransport.prototype.stop = function () {
    if (this.webSocket) {
      // Clear websocket handlers because we are considering the socket closed now
      this.webSocket.onclose = function () {};

      this.webSocket.onmessage = function () {};

      this.webSocket.onerror = function () {};

      this.webSocket.close();
      this.webSocket = undefined; // Manually invoke onclose callback inline so we know the HttpConnection was closed properly before returning
      // This also solves an issue where websocket.onclose could take 18+ seconds to trigger during network disconnects

      this.close(undefined);
    }

    return Promise.resolve();
  };

  WebSocketTransport.prototype.close = function (event) {
    // webSocket will be null if the transport did not start successfully
    this.logger.log(_ILogger.LogLevel.Trace, "(WebSockets transport) socket closed.");

    if (this.onclose) {
      if (event && (event.wasClean === false || event.code !== 1000)) {
        this.onclose(new Error("WebSocket closed with status code: " + event.code + " (" + event.reason + ")."));
      } else {
        this.onclose();
      }
    }
  };

  return WebSocketTransport;
}();

exports.WebSocketTransport = WebSocketTransport;
},{"./ILogger":"node_modules/@aspnet/signalr/dist/esm/ILogger.js","./ITransport":"node_modules/@aspnet/signalr/dist/esm/ITransport.js","./Utils":"node_modules/@aspnet/signalr/dist/esm/Utils.js"}],"node_modules/@aspnet/signalr/dist/esm/HttpConnection.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpConnection = void 0;

var _DefaultHttpClient = require("./DefaultHttpClient");

var _ILogger = require("./ILogger");

var _ITransport = require("./ITransport");

var _LongPollingTransport = require("./LongPollingTransport");

var _ServerSentEventsTransport = require("./ServerSentEventsTransport");

var _Utils = require("./Utils");

var _WebSocketTransport = require("./WebSocketTransport");

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var MAX_REDIRECTS = 100;
var WebSocketModule = null;
var EventSourceModule = null;

if (typeof window === "undefined" && typeof require !== "undefined") {
  // In order to ignore the dynamic require in webpack builds we need to do this magic
  // @ts-ignore: TS doesn't know about these names
  var requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
  WebSocketModule = requireFunc("ws");
  EventSourceModule = requireFunc("eventsource");
}
/** @private */


var HttpConnection =
/** @class */
function () {
  function HttpConnection(url, options) {
    if (options === void 0) {
      options = {};
    }

    this.features = {};

    _Utils.Arg.isRequired(url, "url");

    this.logger = (0, _Utils.createLogger)(options.logger);
    this.baseUrl = this.resolveUrl(url);
    options = options || {};
    options.logMessageContent = options.logMessageContent || false;
    var isNode = typeof window === "undefined";

    if (!isNode && typeof WebSocket !== "undefined" && !options.WebSocket) {
      options.WebSocket = WebSocket;
    } else if (isNode && !options.WebSocket) {
      if (WebSocketModule) {
        options.WebSocket = WebSocketModule;
      }
    }

    if (!isNode && typeof EventSource !== "undefined" && !options.EventSource) {
      options.EventSource = EventSource;
    } else if (isNode && !options.EventSource) {
      if (typeof EventSourceModule !== "undefined") {
        options.EventSource = EventSourceModule;
      }
    }

    this.httpClient = options.httpClient || new _DefaultHttpClient.DefaultHttpClient(this.logger);
    this.connectionState = 2
    /* Disconnected */
    ;
    this.options = options;
    this.onreceive = null;
    this.onclose = null;
  }

  HttpConnection.prototype.start = function (transferFormat) {
    transferFormat = transferFormat || _ITransport.TransferFormat.Binary;

    _Utils.Arg.isIn(transferFormat, _ITransport.TransferFormat, "transferFormat");

    this.logger.log(_ILogger.LogLevel.Debug, "Starting connection with transfer format '" + _ITransport.TransferFormat[transferFormat] + "'.");

    if (this.connectionState !== 2
    /* Disconnected */
    ) {
        return Promise.reject(new Error("Cannot start a connection that is not in the 'Disconnected' state."));
      }

    this.connectionState = 0
    /* Connecting */
    ;
    this.startPromise = this.startInternal(transferFormat);
    return this.startPromise;
  };

  HttpConnection.prototype.send = function (data) {
    if (this.connectionState !== 1
    /* Connected */
    ) {
        throw new Error("Cannot send data if the connection is not in the 'Connected' State.");
      } // Transport will not be null if state is connected


    return this.transport.send(data);
  };

  HttpConnection.prototype.stop = function (error) {
    return __awaiter(this, void 0, void 0, function () {
      var e_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            this.connectionState = 2
            /* Disconnected */
            ; // Set error as soon as possible otherwise there is a race between
            // the transport closing and providing an error and the error from a close message
            // We would prefer the close message error.

            this.stopError = error;
            _a.label = 1;

          case 1:
            _a.trys.push([1, 3,, 4]);

            return [4
            /*yield*/
            , this.startPromise];

          case 2:
            _a.sent();

            return [3
            /*break*/
            , 4];

          case 3:
            e_1 = _a.sent();
            return [3
            /*break*/
            , 4];

          case 4:
            if (!this.transport) return [3
            /*break*/
            , 6];
            return [4
            /*yield*/
            , this.transport.stop()];

          case 5:
            _a.sent();

            this.transport = undefined;
            _a.label = 6;

          case 6:
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  HttpConnection.prototype.startInternal = function (transferFormat) {
    return __awaiter(this, void 0, void 0, function () {
      var url, negotiateResponse, redirects, _loop_1, this_1, state_1, e_2;

      var _this = this;

      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            url = this.baseUrl;
            this.accessTokenFactory = this.options.accessTokenFactory;
            _a.label = 1;

          case 1:
            _a.trys.push([1, 12,, 13]);

            if (!this.options.skipNegotiation) return [3
            /*break*/
            , 5];
            if (!(this.options.transport === _ITransport.HttpTransportType.WebSockets)) return [3
            /*break*/
            , 3]; // No need to add a connection ID in this case

            this.transport = this.constructTransport(_ITransport.HttpTransportType.WebSockets); // We should just call connect directly in this case.
            // No fallback or negotiate in this case.

            return [4
            /*yield*/
            , this.transport.connect(url, transferFormat)];

          case 2:
            // We should just call connect directly in this case.
            // No fallback or negotiate in this case.
            _a.sent();

            return [3
            /*break*/
            , 4];

          case 3:
            throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");

          case 4:
            return [3
            /*break*/
            , 11];

          case 5:
            negotiateResponse = null;
            redirects = 0;

            _loop_1 = function () {
              var accessToken_1;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    return [4
                    /*yield*/
                    , this_1.getNegotiationResponse(url)];

                  case 1:
                    negotiateResponse = _a.sent(); // the user tries to stop the connection when it is being started

                    if (this_1.connectionState === 2
                    /* Disconnected */
                    ) {
                        return [2
                        /*return*/
                        , {
                          value: void 0
                        }];
                      }

                    if (negotiateResponse.error) {
                      throw Error(negotiateResponse.error);
                    }

                    if (negotiateResponse.ProtocolVersion) {
                      throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
                    }

                    if (negotiateResponse.url) {
                      url = negotiateResponse.url;
                    }

                    if (negotiateResponse.accessToken) {
                      accessToken_1 = negotiateResponse.accessToken;

                      this_1.accessTokenFactory = function () {
                        return accessToken_1;
                      };
                    }

                    redirects++;
                    return [2
                    /*return*/
                    ];
                }
              });
            };

            this_1 = this;
            _a.label = 6;

          case 6:
            return [5
            /*yield**/
            , _loop_1()];

          case 7:
            state_1 = _a.sent();
            if (typeof state_1 === "object") return [2
            /*return*/
            , state_1.value];
            _a.label = 8;

          case 8:
            if (negotiateResponse.url && redirects < MAX_REDIRECTS) return [3
            /*break*/
            , 6];
            _a.label = 9;

          case 9:
            if (redirects === MAX_REDIRECTS && negotiateResponse.url) {
              throw Error("Negotiate redirection limit exceeded.");
            }

            return [4
            /*yield*/
            , this.createTransport(url, this.options.transport, negotiateResponse, transferFormat)];

          case 10:
            _a.sent();

            _a.label = 11;

          case 11:
            if (this.transport instanceof _LongPollingTransport.LongPollingTransport) {
              this.features.inherentKeepAlive = true;
            }

            this.transport.onreceive = this.onreceive;

            this.transport.onclose = function (e) {
              return _this.stopConnection(e);
            }; // only change the state if we were connecting to not overwrite
            // the state if the connection is already marked as Disconnected


            this.changeState(0
            /* Connecting */
            , 1
            /* Connected */
            );
            return [3
            /*break*/
            , 13];

          case 12:
            e_2 = _a.sent();
            this.logger.log(_ILogger.LogLevel.Error, "Failed to start the connection: " + e_2);
            this.connectionState = 2
            /* Disconnected */
            ;
            this.transport = undefined;
            throw e_2;

          case 13:
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  HttpConnection.prototype.getNegotiationResponse = function (url) {
    return __awaiter(this, void 0, void 0, function () {
      var _a, headers, token, negotiateUrl, response, e_3;

      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            if (!this.accessTokenFactory) return [3
            /*break*/
            , 2];
            return [4
            /*yield*/
            , this.accessTokenFactory()];

          case 1:
            token = _b.sent();

            if (token) {
              headers = (_a = {}, _a["Authorization"] = "Bearer " + token, _a);
            }

            _b.label = 2;

          case 2:
            negotiateUrl = this.resolveNegotiateUrl(url);
            this.logger.log(_ILogger.LogLevel.Debug, "Sending negotiation request: " + negotiateUrl + ".");
            _b.label = 3;

          case 3:
            _b.trys.push([3, 5,, 6]);

            return [4
            /*yield*/
            , this.httpClient.post(negotiateUrl, {
              content: "",
              headers: headers
            })];

          case 4:
            response = _b.sent();

            if (response.statusCode !== 200) {
              throw Error("Unexpected status code returned from negotiate " + response.statusCode);
            }

            return [2
            /*return*/
            , JSON.parse(response.content)];

          case 5:
            e_3 = _b.sent();
            this.logger.log(_ILogger.LogLevel.Error, "Failed to complete negotiation with the server: " + e_3);
            throw e_3;

          case 6:
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  HttpConnection.prototype.createConnectUrl = function (url, connectionId) {
    if (!connectionId) {
      return url;
    }

    return url + (url.indexOf("?") === -1 ? "?" : "&") + ("id=" + connectionId);
  };

  HttpConnection.prototype.createTransport = function (url, requestedTransport, negotiateResponse, requestedTransferFormat) {
    return __awaiter(this, void 0, void 0, function () {
      var connectUrl, transports, _i, transports_1, endpoint, transport, ex_1;

      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            connectUrl = this.createConnectUrl(url, negotiateResponse.connectionId);
            if (!this.isITransport(requestedTransport)) return [3
            /*break*/
            , 2];
            this.logger.log(_ILogger.LogLevel.Debug, "Connection was provided an instance of ITransport, using that directly.");
            this.transport = requestedTransport;
            return [4
            /*yield*/
            , this.transport.connect(connectUrl, requestedTransferFormat)];

          case 1:
            _a.sent(); // only change the state if we were connecting to not overwrite
            // the state if the connection is already marked as Disconnected


            this.changeState(0
            /* Connecting */
            , 1
            /* Connected */
            );
            return [2
            /*return*/
            ];

          case 2:
            transports = negotiateResponse.availableTransports || [];
            _i = 0, transports_1 = transports;
            _a.label = 3;

          case 3:
            if (!(_i < transports_1.length)) return [3
            /*break*/
            , 9];
            endpoint = transports_1[_i];
            this.connectionState = 0
            /* Connecting */
            ;
            transport = this.resolveTransport(endpoint, requestedTransport, requestedTransferFormat);
            if (!(typeof transport === "number")) return [3
            /*break*/
            , 8];
            this.transport = this.constructTransport(transport);
            if (!!negotiateResponse.connectionId) return [3
            /*break*/
            , 5];
            return [4
            /*yield*/
            , this.getNegotiationResponse(url)];

          case 4:
            negotiateResponse = _a.sent();
            connectUrl = this.createConnectUrl(url, negotiateResponse.connectionId);
            _a.label = 5;

          case 5:
            _a.trys.push([5, 7,, 8]);

            return [4
            /*yield*/
            , this.transport.connect(connectUrl, requestedTransferFormat)];

          case 6:
            _a.sent();

            this.changeState(0
            /* Connecting */
            , 1
            /* Connected */
            );
            return [2
            /*return*/
            ];

          case 7:
            ex_1 = _a.sent();
            this.logger.log(_ILogger.LogLevel.Error, "Failed to start the transport '" + _ITransport.HttpTransportType[transport] + "': " + ex_1);
            this.connectionState = 2
            /* Disconnected */
            ;
            negotiateResponse.connectionId = undefined;
            return [3
            /*break*/
            , 8];

          case 8:
            _i++;
            return [3
            /*break*/
            , 3];

          case 9:
            throw new Error("Unable to initialize any of the available transports.");
        }
      });
    });
  };

  HttpConnection.prototype.constructTransport = function (transport) {
    switch (transport) {
      case _ITransport.HttpTransportType.WebSockets:
        if (!this.options.WebSocket) {
          throw new Error("'WebSocket' is not supported in your environment.");
        }

        return new _WebSocketTransport.WebSocketTransport(this.httpClient, this.accessTokenFactory, this.logger, this.options.logMessageContent || false, this.options.WebSocket);

      case _ITransport.HttpTransportType.ServerSentEvents:
        if (!this.options.EventSource) {
          throw new Error("'EventSource' is not supported in your environment.");
        }

        return new _ServerSentEventsTransport.ServerSentEventsTransport(this.httpClient, this.accessTokenFactory, this.logger, this.options.logMessageContent || false, this.options.EventSource);

      case _ITransport.HttpTransportType.LongPolling:
        return new _LongPollingTransport.LongPollingTransport(this.httpClient, this.accessTokenFactory, this.logger, this.options.logMessageContent || false);

      default:
        throw new Error("Unknown transport: " + transport + ".");
    }
  };

  HttpConnection.prototype.resolveTransport = function (endpoint, requestedTransport, requestedTransferFormat) {
    var transport = _ITransport.HttpTransportType[endpoint.transport];

    if (transport === null || transport === undefined) {
      this.logger.log(_ILogger.LogLevel.Debug, "Skipping transport '" + endpoint.transport + "' because it is not supported by this client.");
    } else {
      var transferFormats = endpoint.transferFormats.map(function (s) {
        return _ITransport.TransferFormat[s];
      });

      if (transportMatches(requestedTransport, transport)) {
        if (transferFormats.indexOf(requestedTransferFormat) >= 0) {
          if (transport === _ITransport.HttpTransportType.WebSockets && !this.options.WebSocket || transport === _ITransport.HttpTransportType.ServerSentEvents && !this.options.EventSource) {
            this.logger.log(_ILogger.LogLevel.Debug, "Skipping transport '" + _ITransport.HttpTransportType[transport] + "' because it is not supported in your environment.'");
          } else {
            this.logger.log(_ILogger.LogLevel.Debug, "Selecting transport '" + _ITransport.HttpTransportType[transport] + "'.");
            return transport;
          }
        } else {
          this.logger.log(_ILogger.LogLevel.Debug, "Skipping transport '" + _ITransport.HttpTransportType[transport] + "' because it does not support the requested transfer format '" + _ITransport.TransferFormat[requestedTransferFormat] + "'.");
        }
      } else {
        this.logger.log(_ILogger.LogLevel.Debug, "Skipping transport '" + _ITransport.HttpTransportType[transport] + "' because it was disabled by the client.");
      }
    }

    return null;
  };

  HttpConnection.prototype.isITransport = function (transport) {
    return transport && typeof transport === "object" && "connect" in transport;
  };

  HttpConnection.prototype.changeState = function (from, to) {
    if (this.connectionState === from) {
      this.connectionState = to;
      return true;
    }

    return false;
  };

  HttpConnection.prototype.stopConnection = function (error) {
    this.transport = undefined; // If we have a stopError, it takes precedence over the error from the transport

    error = this.stopError || error;

    if (error) {
      this.logger.log(_ILogger.LogLevel.Error, "Connection disconnected with error '" + error + "'.");
    } else {
      this.logger.log(_ILogger.LogLevel.Information, "Connection disconnected.");
    }

    this.connectionState = 2
    /* Disconnected */
    ;

    if (this.onclose) {
      this.onclose(error);
    }
  };

  HttpConnection.prototype.resolveUrl = function (url) {
    // startsWith is not supported in IE
    if (url.lastIndexOf("https://", 0) === 0 || url.lastIndexOf("http://", 0) === 0) {
      return url;
    }

    if (typeof window === "undefined" || !window || !window.document) {
      throw new Error("Cannot resolve '" + url + "'.");
    } // Setting the url to the href propery of an anchor tag handles normalization
    // for us. There are 3 main cases.
    // 1. Relative  path normalization e.g "b" -> "http://localhost:5000/a/b"
    // 2. Absolute path normalization e.g "/a/b" -> "http://localhost:5000/a/b"
    // 3. Networkpath reference normalization e.g "//localhost:5000/a/b" -> "http://localhost:5000/a/b"


    var aTag = window.document.createElement("a");
    aTag.href = url;
    this.logger.log(_ILogger.LogLevel.Information, "Normalizing '" + url + "' to '" + aTag.href + "'.");
    return aTag.href;
  };

  HttpConnection.prototype.resolveNegotiateUrl = function (url) {
    var index = url.indexOf("?");
    var negotiateUrl = url.substring(0, index === -1 ? url.length : index);

    if (negotiateUrl[negotiateUrl.length - 1] !== "/") {
      negotiateUrl += "/";
    }

    negotiateUrl += "negotiate";
    negotiateUrl += index === -1 ? "" : url.substring(index);
    return negotiateUrl;
  };

  return HttpConnection;
}();

exports.HttpConnection = HttpConnection;

function transportMatches(requestedTransport, actualTransport) {
  return !requestedTransport || (actualTransport & requestedTransport) !== 0;
}
},{"./DefaultHttpClient":"node_modules/@aspnet/signalr/dist/esm/DefaultHttpClient.js","./ILogger":"node_modules/@aspnet/signalr/dist/esm/ILogger.js","./ITransport":"node_modules/@aspnet/signalr/dist/esm/ITransport.js","./LongPollingTransport":"node_modules/@aspnet/signalr/dist/esm/LongPollingTransport.js","./ServerSentEventsTransport":"node_modules/@aspnet/signalr/dist/esm/ServerSentEventsTransport.js","./Utils":"node_modules/@aspnet/signalr/dist/esm/Utils.js","./WebSocketTransport":"node_modules/@aspnet/signalr/dist/esm/WebSocketTransport.js"}],"node_modules/@aspnet/signalr/dist/esm/JsonHubProtocol.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JsonHubProtocol = void 0;

var _IHubProtocol = require("./IHubProtocol");

var _ILogger = require("./ILogger");

var _ITransport = require("./ITransport");

var _Loggers = require("./Loggers");

var _TextMessageFormat = require("./TextMessageFormat");

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var JSON_HUB_PROTOCOL_NAME = "json";
/** Implements the JSON Hub Protocol. */

var JsonHubProtocol =
/** @class */
function () {
  function JsonHubProtocol() {
    /** @inheritDoc */
    this.name = JSON_HUB_PROTOCOL_NAME;
    /** @inheritDoc */

    this.version = 1;
    /** @inheritDoc */

    this.transferFormat = _ITransport.TransferFormat.Text;
  }
  /** Creates an array of {@link @aspnet/signalr.HubMessage} objects from the specified serialized representation.
   *
   * @param {string} input A string containing the serialized representation.
   * @param {ILogger} logger A logger that will be used to log messages that occur during parsing.
   */


  JsonHubProtocol.prototype.parseMessages = function (input, logger) {
    // The interface does allow "ArrayBuffer" to be passed in, but this implementation does not. So let's throw a useful error.
    if (typeof input !== "string") {
      throw new Error("Invalid input for JSON hub protocol. Expected a string.");
    }

    if (!input) {
      return [];
    }

    if (logger === null) {
      logger = _Loggers.NullLogger.instance;
    } // Parse the messages


    var messages = _TextMessageFormat.TextMessageFormat.parse(input);

    var hubMessages = [];

    for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
      var message = messages_1[_i];
      var parsedMessage = JSON.parse(message);

      if (typeof parsedMessage.type !== "number") {
        throw new Error("Invalid payload.");
      }

      switch (parsedMessage.type) {
        case _IHubProtocol.MessageType.Invocation:
          this.isInvocationMessage(parsedMessage);
          break;

        case _IHubProtocol.MessageType.StreamItem:
          this.isStreamItemMessage(parsedMessage);
          break;

        case _IHubProtocol.MessageType.Completion:
          this.isCompletionMessage(parsedMessage);
          break;

        case _IHubProtocol.MessageType.Ping:
          // Single value, no need to validate
          break;

        case _IHubProtocol.MessageType.Close:
          // All optional values, no need to validate
          break;

        default:
          // Future protocol changes can add message types, old clients can ignore them
          logger.log(_ILogger.LogLevel.Information, "Unknown message type '" + parsedMessage.type + "' ignored.");
          continue;
      }

      hubMessages.push(parsedMessage);
    }

    return hubMessages;
  };
  /** Writes the specified {@link @aspnet/signalr.HubMessage} to a string and returns it.
   *
   * @param {HubMessage} message The message to write.
   * @returns {string} A string containing the serialized representation of the message.
   */


  JsonHubProtocol.prototype.writeMessage = function (message) {
    return _TextMessageFormat.TextMessageFormat.write(JSON.stringify(message));
  };

  JsonHubProtocol.prototype.isInvocationMessage = function (message) {
    this.assertNotEmptyString(message.target, "Invalid payload for Invocation message.");

    if (message.invocationId !== undefined) {
      this.assertNotEmptyString(message.invocationId, "Invalid payload for Invocation message.");
    }
  };

  JsonHubProtocol.prototype.isStreamItemMessage = function (message) {
    this.assertNotEmptyString(message.invocationId, "Invalid payload for StreamItem message.");

    if (message.item === undefined) {
      throw new Error("Invalid payload for StreamItem message.");
    }
  };

  JsonHubProtocol.prototype.isCompletionMessage = function (message) {
    if (message.result && message.error) {
      throw new Error("Invalid payload for Completion message.");
    }

    if (!message.result && message.error) {
      this.assertNotEmptyString(message.error, "Invalid payload for Completion message.");
    }

    this.assertNotEmptyString(message.invocationId, "Invalid payload for Completion message.");
  };

  JsonHubProtocol.prototype.assertNotEmptyString = function (value, errorMessage) {
    if (typeof value !== "string" || value === "") {
      throw new Error(errorMessage);
    }
  };

  return JsonHubProtocol;
}();

exports.JsonHubProtocol = JsonHubProtocol;
},{"./IHubProtocol":"node_modules/@aspnet/signalr/dist/esm/IHubProtocol.js","./ILogger":"node_modules/@aspnet/signalr/dist/esm/ILogger.js","./ITransport":"node_modules/@aspnet/signalr/dist/esm/ITransport.js","./Loggers":"node_modules/@aspnet/signalr/dist/esm/Loggers.js","./TextMessageFormat":"node_modules/@aspnet/signalr/dist/esm/TextMessageFormat.js"}],"node_modules/@aspnet/signalr/dist/esm/HubConnectionBuilder.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HubConnectionBuilder = void 0;

var _HttpConnection = require("./HttpConnection");

var _HubConnection = require("./HubConnection");

var _JsonHubProtocol = require("./JsonHubProtocol");

var _Loggers = require("./Loggers");

var _Utils = require("./Utils");

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

/** A builder for configuring {@link @aspnet/signalr.HubConnection} instances. */
var HubConnectionBuilder =
/** @class */
function () {
  function HubConnectionBuilder() {}

  HubConnectionBuilder.prototype.configureLogging = function (logging) {
    _Utils.Arg.isRequired(logging, "logging");

    if (isLogger(logging)) {
      this.logger = logging;
    } else {
      this.logger = new _Utils.ConsoleLogger(logging);
    }

    return this;
  };

  HubConnectionBuilder.prototype.withUrl = function (url, transportTypeOrOptions) {
    _Utils.Arg.isRequired(url, "url");

    this.url = url; // Flow-typing knows where it's at. Since HttpTransportType is a number and IHttpConnectionOptions is guaranteed
    // to be an object, we know (as does TypeScript) this comparison is all we need to figure out which overload was called.

    if (typeof transportTypeOrOptions === "object") {
      this.httpConnectionOptions = transportTypeOrOptions;
    } else {
      this.httpConnectionOptions = {
        transport: transportTypeOrOptions
      };
    }

    return this;
  };
  /** Configures the {@link @aspnet/signalr.HubConnection} to use the specified Hub Protocol.
   *
   * @param {IHubProtocol} protocol The {@link @aspnet/signalr.IHubProtocol} implementation to use.
   */


  HubConnectionBuilder.prototype.withHubProtocol = function (protocol) {
    _Utils.Arg.isRequired(protocol, "protocol");

    this.protocol = protocol;
    return this;
  };
  /** Creates a {@link @aspnet/signalr.HubConnection} from the configuration options specified in this builder.
   *
   * @returns {HubConnection} The configured {@link @aspnet/signalr.HubConnection}.
   */


  HubConnectionBuilder.prototype.build = function () {
    // If httpConnectionOptions has a logger, use it. Otherwise, override it with the one
    // provided to configureLogger
    var httpConnectionOptions = this.httpConnectionOptions || {}; // If it's 'null', the user **explicitly** asked for null, don't mess with it.

    if (httpConnectionOptions.logger === undefined) {
      // If our logger is undefined or null, that's OK, the HttpConnection constructor will handle it.
      httpConnectionOptions.logger = this.logger;
    } // Now create the connection


    if (!this.url) {
      throw new Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
    }

    var connection = new _HttpConnection.HttpConnection(this.url, httpConnectionOptions);
    return _HubConnection.HubConnection.create(connection, this.logger || _Loggers.NullLogger.instance, this.protocol || new _JsonHubProtocol.JsonHubProtocol());
  };

  return HubConnectionBuilder;
}();

exports.HubConnectionBuilder = HubConnectionBuilder;

function isLogger(logger) {
  return logger.log !== undefined;
}
},{"./HttpConnection":"node_modules/@aspnet/signalr/dist/esm/HttpConnection.js","./HubConnection":"node_modules/@aspnet/signalr/dist/esm/HubConnection.js","./JsonHubProtocol":"node_modules/@aspnet/signalr/dist/esm/JsonHubProtocol.js","./Loggers":"node_modules/@aspnet/signalr/dist/esm/Loggers.js","./Utils":"node_modules/@aspnet/signalr/dist/esm/Utils.js"}],"node_modules/@aspnet/signalr/dist/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AbortError", {
  enumerable: true,
  get: function () {
    return _Errors.AbortError;
  }
});
Object.defineProperty(exports, "HttpError", {
  enumerable: true,
  get: function () {
    return _Errors.HttpError;
  }
});
Object.defineProperty(exports, "TimeoutError", {
  enumerable: true,
  get: function () {
    return _Errors.TimeoutError;
  }
});
Object.defineProperty(exports, "HttpClient", {
  enumerable: true,
  get: function () {
    return _HttpClient.HttpClient;
  }
});
Object.defineProperty(exports, "HttpResponse", {
  enumerable: true,
  get: function () {
    return _HttpClient.HttpResponse;
  }
});
Object.defineProperty(exports, "DefaultHttpClient", {
  enumerable: true,
  get: function () {
    return _DefaultHttpClient.DefaultHttpClient;
  }
});
Object.defineProperty(exports, "HubConnection", {
  enumerable: true,
  get: function () {
    return _HubConnection.HubConnection;
  }
});
Object.defineProperty(exports, "HubConnectionState", {
  enumerable: true,
  get: function () {
    return _HubConnection.HubConnectionState;
  }
});
Object.defineProperty(exports, "HubConnectionBuilder", {
  enumerable: true,
  get: function () {
    return _HubConnectionBuilder.HubConnectionBuilder;
  }
});
Object.defineProperty(exports, "MessageType", {
  enumerable: true,
  get: function () {
    return _IHubProtocol.MessageType;
  }
});
Object.defineProperty(exports, "LogLevel", {
  enumerable: true,
  get: function () {
    return _ILogger.LogLevel;
  }
});
Object.defineProperty(exports, "HttpTransportType", {
  enumerable: true,
  get: function () {
    return _ITransport.HttpTransportType;
  }
});
Object.defineProperty(exports, "TransferFormat", {
  enumerable: true,
  get: function () {
    return _ITransport.TransferFormat;
  }
});
Object.defineProperty(exports, "NullLogger", {
  enumerable: true,
  get: function () {
    return _Loggers.NullLogger;
  }
});
Object.defineProperty(exports, "JsonHubProtocol", {
  enumerable: true,
  get: function () {
    return _JsonHubProtocol.JsonHubProtocol;
  }
});
exports.VERSION = void 0;

var _Errors = require("./Errors");

var _HttpClient = require("./HttpClient");

var _DefaultHttpClient = require("./DefaultHttpClient");

var _HubConnection = require("./HubConnection");

var _HubConnectionBuilder = require("./HubConnectionBuilder");

var _IHubProtocol = require("./IHubProtocol");

var _ILogger = require("./ILogger");

var _ITransport = require("./ITransport");

var _Loggers = require("./Loggers");

var _JsonHubProtocol = require("./JsonHubProtocol");

// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
// Version token that will be replaced by the prepack command

/** The version of the SignalR client. */
var VERSION = "1.1.4";
exports.VERSION = VERSION;
},{"./Errors":"node_modules/@aspnet/signalr/dist/esm/Errors.js","./HttpClient":"node_modules/@aspnet/signalr/dist/esm/HttpClient.js","./DefaultHttpClient":"node_modules/@aspnet/signalr/dist/esm/DefaultHttpClient.js","./HubConnection":"node_modules/@aspnet/signalr/dist/esm/HubConnection.js","./HubConnectionBuilder":"node_modules/@aspnet/signalr/dist/esm/HubConnectionBuilder.js","./IHubProtocol":"node_modules/@aspnet/signalr/dist/esm/IHubProtocol.js","./ILogger":"node_modules/@aspnet/signalr/dist/esm/ILogger.js","./ITransport":"node_modules/@aspnet/signalr/dist/esm/ITransport.js","./Loggers":"node_modules/@aspnet/signalr/dist/esm/Loggers.js","./JsonHubProtocol":"node_modules/@aspnet/signalr/dist/esm/JsonHubProtocol.js"}],"src/networking.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendChatMessage = exports.moveToRoom = exports.connect = void 0;

var SignalR = __importStar(require("@aspnet/signalr"));

var myUserId;
var myDelegate;

function connect(userId, delegate) {
  return __awaiter(this, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          myUserId = userId;
          myDelegate = delegate;
          return [4
          /*yield*/
          , callAzureFunction("connect")];

        case 1:
          result = _a.sent();
          console.log(result);
          delegate.updatedRoom(result.room.displayName, result.room.description);
          delegate.updatedPresenceInfo(result.roomOccupants);
          connectSignalR(userId, delegate);
          return [2
          /*return*/
          ];
      }
    });
  });
}

exports.connect = connect;

function moveToRoom(roomId) {
  return __awaiter(this, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , callAzureFunction("moveRoom", {
            to: roomId
          })];

        case 1:
          result = _a.sent();
          console.log(result);
          myDelegate.updatedRoom(result.room.displayName, result.room.description);
          myDelegate.updatedPresenceInfo(result.roomOccupants);
          return [2
          /*return*/
          ];
      }
    });
  });
}

exports.moveToRoom = moveToRoom;

function sendChatMessage(text) {
  callAzureFunction("sendChatMessage", {
    text: text
  });
}

exports.sendChatMessage = sendChatMessage;

function connectSignalR(userId, delegate) {
  return __awaiter(this, void 0, void 0, function () {
    var CustomHttpClient, connection;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          CustomHttpClient =
          /** @class */
          function (_super) {
            __extends(CustomHttpClient, _super);

            function CustomHttpClient() {
              return _super !== null && _super.apply(this, arguments) || this;
            }

            CustomHttpClient.prototype.send = function (request) {
              request.headers = __assign(__assign({}, request.headers), {
                "x-ms-client-principal-id": userId
              });
              return _super.prototype.send.call(this, request);
            };

            return CustomHttpClient;
          }(SignalR.DefaultHttpClient);

          connection = new SignalR.HubConnectionBuilder().withUrl("https://mud.azurewebsites.net/api", {
            httpClient: new CustomHttpClient(console)
          }).configureLogging(SignalR.LogLevel.Information).build();
          connection.on("playerConnected", function (otherId) {
            console.log("Player joined!", otherId);
            delegate.playerConnected(otherId);
          });
          connection.on("playerDisconnected", function (otherId) {
            console.log("Player left!", otherId);
            delegate.playerDisconnected(otherId);
          });
          connection.on("chatMessage", function (otherId, message) {
            console.log(otherId, message);
            if (otherId === userId) return;
            delegate.chatMessageReceived(otherId, message);
          });
          connection.on("playerEntered", function (otherId, from) {
            if (otherId === userId) return;
            delegate.playerEntered(otherId, from);
          });
          connection.on("playerLeft", function (otherId, to) {
            if (otherId === userId) return;
            delegate.playerLeft(otherId, to);
          });
          connection.onclose(function () {
            console.log("disconnected");
            callAzureFunction("disconnect");
          });
          window.addEventListener("beforeunload", function (e) {
            callAzureFunction("disconnect");
          });
          console.log("connecting...");
          return [4
          /*yield*/
          , connection.start().then(function () {
            return console.log("Connected!");
          }).catch(console.error)];

        case 1:
          return [2
          /*return*/
          , _a.sent()];
      }
    });
  });
}

function callAzureFunction(endpoint, body, options) {
  return __awaiter(this, void 0, Promise, function () {
    var opts;
    return __generator(this, function (_a) {
      opts = __assign({
        method: "POST",
        credentials: "include"
      }, options);
      opts.body = JSON.stringify(__assign(__assign({}, body || {}), {
        userId: myUserId
      }));
      return [2
      /*return*/
      , fetch("https://mud.azurewebsites.net/api/" + endpoint, opts).then(function (r) {
        if (r.ok) {
          console.log("Updated", r);
        } else {
          console.error("Update failed", r);
        }

        return r.json();
      })];
    });
  });
}
},{"@aspnet/signalr":"node_modules/@aspnet/signalr/dist/esm/index.js"}],"src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var networking_1 = require("./networking");

var currentOtherPlayers = [];

function renderPresence(users) {
  console.log("Rendering presence", users);
  users = users.filter(function (u) {
    return u !== localStorage.getItem("name");
  });
  var names = "";

  if (users.length === 0) {
    document.getElementById("dynamic-room-description").innerText = "You are all alone here.";
    return;
  }

  if (users.length === 1) {
    names = users[0];
  } else if (users.length === 2) {
    names = users[0] + " and " + users[1];
  } else {
    names = users.slice(0, users.length - 1).join(", ") + ", and " + users[users.length - 1];
  }

  document.getElementById("dynamic-room-description").innerHTML = "Also here " + (users.length === 1 ? "is" : "are") + " " + names;
}

var delegate = {
  updatedRoom: function updatedRoom(name, description) {
    var complexLinkRegex = /\[\[([^\]]*?)\-\>([^\]]*?)\]\]/g;
    var simpleLinkRegex = /\[\[(.+?)\]\]/g;
    console.log("Updating room", name, description);
    description = description.replace(complexLinkRegex, function (match, text, roomId) {
      console.log("Replacing complex", match, text, roomId);
      return "<a class='room-link' href='#' data-room='" + roomId + "'>" + text + "</a>";
    });
    description = description.replace(simpleLinkRegex, function (match, roomId) {
      console.log("Replacing simple", match, roomId);
      return "<a class='room-link' href='#' data-room='" + roomId + "'>" + roomId + "</a>";
    });
    document.getElementById("room-name").innerText = name;
    document.getElementById("static-room-description").innerHTML = description;
    document.querySelectorAll("#static-room-description .room-link").forEach(function (el) {
      return el.addEventListener("click", function (e) {
        var roomId = el.getAttribute("data-room");
        networking_1.moveToRoom(roomId);
      });
    });
  },
  updatedPresenceInfo: function updatedPresenceInfo(users) {
    currentOtherPlayers = users;
    renderPresence(users);
  },
  playerConnected: function playerConnected(name) {
    console.log("In playerJoined", name);

    if (currentOtherPlayers.indexOf(name) === -1) {
      currentOtherPlayers.push(name);
      displayChatMessage("<strong>" + name + "</strong> has joined.");
    }

    renderPresence(currentOtherPlayers);
  },
  playerDisconnected: function playerDisconnected(name) {
    displayChatMessage("<strong>" + name + "</strong> has left.");
    currentOtherPlayers = currentOtherPlayers.filter(function (p) {
      return p !== name;
    });
    renderPresence(currentOtherPlayers);
  },
  playerEntered: function playerEntered(name, from) {
    console.log("In playerJoined", name);

    if (currentOtherPlayers.indexOf(name) === -1) {
      currentOtherPlayers.push(name);
      displayChatMessage("<strong>" + name + "</strong> walks in from " + from + ".");
    }

    renderPresence(currentOtherPlayers);
  },
  playerLeft: function playerLeft(name, to) {
    displayChatMessage("<strong>" + name + "</strong> wanders to " + to + ".");
    currentOtherPlayers = currentOtherPlayers.filter(function (p) {
      return p !== name;
    });
    renderPresence(currentOtherPlayers);
  },
  chatMessageReceived: function chatMessageReceived(name, message) {
    displayChatMessage(message, name);
  }
};

var sendMessage = function sendMessage() {
  var input = document.querySelector("#chat-input");
  var text = input.value;
  if (text === "" || text === undefined) return;
  networking_1.sendChatMessage(text);
  delegate.chatMessageReceived(localStorage.getItem("name"), text);
  input.value = "";
};

var displayChatMessage = function displayChatMessage(msg, name) {
  var el = document.createElement("div");

  if (name) {
    el.innerHTML = "<strong>" + name + ":</strong> " + msg;
  } else {
    el.innerHTML = msg;
  }

  document.getElementById("messages").append(el);
  el.scrollIntoView();
};

window.addEventListener("DOMContentLoaded", function () {
  var name = localStorage.getItem("name");

  if (!name) {
    name = prompt("What is your user ID?");
    localStorage.setItem("name", name);
  }

  networking_1.connect(name, delegate);
  document.getElementById("send").addEventListener("click", sendMessage);
  document.addEventListener("keypress", function (e) {
    if (e.code === "Enter") {
      sendMessage();
    }
  });
});
},{"./networking":"src/networking.ts"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62426" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map