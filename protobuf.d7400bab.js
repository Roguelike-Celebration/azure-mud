// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
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

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this,
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
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
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function() {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"2Pn5h":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "1b5a31fd3533dc6a79c20f55d7400bab"; // @flow
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {
            });
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets/*: {|[string]: boolean|} */ , acceptedAssets/*: {|[string]: boolean|} */ , assetsToAccept/*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? 'wss' : 'ws';
    var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
    // $FlowFixMe
    ws.onmessage = function(event/*: {data: string, ...} */ ) {
        checkedAssets = {
        };
        acceptedAssets = {
        };
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === 'update') {
            // Remove error overlay if there is one
            removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH
            );
            // Handle HMR Update
            var handled = false;
            assets.forEach((asset)=>{
                var didAccept = asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
                if (didAccept) handled = true;
            });
            if (handled) {
                console.clear();
                assets.forEach(function(asset) {
                    hmrApply(module.bundle.root, asset);
                });
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else window.location.reload();
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
            }
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function(e) {
        console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log('[parcel] ✨ Error resolved');
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
        errorHTML += `\n      <div>\n        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">\n          🚨 ${diagnostic.message}\n        </div>\n        <pre>\n          ${stack}\n        </pre>\n        <div>\n          ${diagnostic.hints.map((hint)=>'<div>' + hint + '</div>'
        ).join('')}\n        </div>\n      </div>\n    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    link.getAttribute('href').split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrApply(bundle/*: ParcelRequire */ , asset/*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') {
        reloadCSS();
        return;
    }
    let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
    if (deps) {
        var fn = new Function('require', 'module', 'exports', asset.output);
        modules[asset.id] = [
            fn,
            deps
        ];
    } else if (bundle.parent) hmrApply(bundle.parent, asset);
}
function hmrAcceptCheck(bundle/*: ParcelRequire */ , id/*: string */ , depsByBundle/*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) return true;
    return getParents(module.bundle.root, id).some(function(v) {
        return hmrAcceptCheck(v[0], v[1], null);
    });
}
function hmrAcceptRun(bundle/*: ParcelRequire */ , id/*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData = {
    };
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"1aEwF":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "conf", ()=>conf
);
parcelHelpers.export(exports, "language", ()=>language
);
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.33.0(4b1abad427e58dbedc1215d99a0902ffc885fcd4)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/ // src/basic-languages/protobuf/protobuf.ts
var namedLiterals = [
    "true",
    "false"
];
var conf = {
    comments: {
        lineComment: "//",
        blockComment: [
            "/*",
            "*/"
        ]
    },
    brackets: [
        [
            "{",
            "}"
        ],
        [
            "[",
            "]"
        ],
        [
            "(",
            ")"
        ],
        [
            "<",
            ">"
        ]
    ],
    surroundingPairs: [
        {
            open: "{",
            close: "}"
        },
        {
            open: "[",
            close: "]"
        },
        {
            open: "(",
            close: ")"
        },
        {
            open: "<",
            close: ">"
        },
        {
            open: '"',
            close: '"'
        },
        {
            open: "'",
            close: "'"
        }
    ],
    autoClosingPairs: [
        {
            open: "{",
            close: "}"
        },
        {
            open: "[",
            close: "]"
        },
        {
            open: "(",
            close: ")"
        },
        {
            open: "<",
            close: ">"
        },
        {
            open: '"',
            close: '"',
            notIn: [
                "string"
            ]
        },
        {
            open: "'",
            close: "'",
            notIn: [
                "string"
            ]
        }
    ],
    autoCloseBefore: ".,=}])>' \n	",
    indentationRules: {
        increaseIndentPattern: new RegExp("^((?!\\/\\/).)*(\\{[^}\"'`]*|\\([^)\"'`]*|\\[[^\\]\"'`]*)$"),
        decreaseIndentPattern: new RegExp("^((?!.*?\\/\\*).*\\*/)?\\s*[\\}\\]].*$")
    }
};
var language = {
    defaultToken: "",
    tokenPostfix: ".proto",
    brackets: [
        {
            open: "{",
            close: "}",
            token: "delimiter.curly"
        },
        {
            open: "[",
            close: "]",
            token: "delimiter.square"
        },
        {
            open: "(",
            close: ")",
            token: "delimiter.parenthesis"
        },
        {
            open: "<",
            close: ">",
            token: "delimiter.angle"
        }
    ],
    symbols: /[=><!~?:&|+\-*/^%]+/,
    keywords: [
        "syntax",
        "import",
        "weak",
        "public",
        "package",
        "option",
        "repeated",
        "oneof",
        "map",
        "reserved",
        "to",
        "max",
        "enum",
        "message",
        "service",
        "rpc",
        "stream",
        "returns",
        "package",
        "optional",
        "true",
        "false"
    ],
    builtinTypes: [
        "double",
        "float",
        "int32",
        "int64",
        "uint32",
        "uint64",
        "sint32",
        "sint64",
        "fixed32",
        "fixed64",
        "sfixed32",
        "sfixed64",
        "bool",
        "string",
        "bytes"
    ],
    operators: [
        "=",
        "+",
        "-"
    ],
    namedLiterals,
    escapes: `\\\\(u{[0-9A-Fa-f]+}|n|r|t|\\\\|'|\\\${)`,
    identifier: /[a-zA-Z]\w*/,
    fullIdentifier: /@identifier(?:\s*\.\s*@identifier)*/,
    optionName: /(?:@identifier|\(\s*@fullIdentifier\s*\))(?:\s*\.\s*@identifier)*/,
    messageName: /@identifier/,
    enumName: /@identifier/,
    messageType: /\.?\s*(?:@identifier\s*\.\s*)*@messageName/,
    enumType: /\.?\s*(?:@identifier\s*\.\s*)*@enumName/,
    floatLit: /[0-9]+\s*\.\s*[0-9]*(?:@exponent)?|[0-9]+@exponent|\.[0-9]+(?:@exponent)?/,
    exponent: /[eE]\s*[+-]?\s*[0-9]+/,
    boolLit: /true\b|false\b/,
    decimalLit: /[1-9][0-9]*/,
    octalLit: /0[0-7]*/,
    hexLit: /0[xX][0-9a-fA-F]+/,
    type: /double|float|int32|int64|uint32|uint64|sint32|sint64|fixed32|fixed64|sfixed32|sfixed64|bool|string|bytes|@messageType|@enumType/,
    keyType: /int32|int64|uint32|uint64|sint32|sint64|fixed32|fixed64|sfixed32|sfixed64|bool|string/,
    tokenizer: {
        root: [
            {
                include: "@whitespace"
            },
            [
                /syntax/,
                "keyword"
            ],
            [
                /=/,
                "operators"
            ],
            [
                /;/,
                "delimiter"
            ],
            [
                /(")(proto3)(")/,
                [
                    "string.quote",
                    "string",
                    {
                        token: "string.quote",
                        switchTo: "@topLevel.proto3"
                    }
                ]
            ],
            [
                /(")(proto2)(")/,
                [
                    "string.quote",
                    "string",
                    {
                        token: "string.quote",
                        switchTo: "@topLevel.proto2"
                    }
                ]
            ],
            [
                /.*?/,
                {
                    token: "",
                    switchTo: "@topLevel.proto2"
                }
            ]
        ],
        topLevel: [
            {
                include: "@whitespace"
            },
            {
                include: "@constant"
            },
            [
                /=/,
                "operators"
            ],
            [
                /[;.]/,
                "delimiter"
            ],
            [
                /@fullIdentifier/,
                {
                    cases: {
                        option: {
                            token: "keyword",
                            next: "@option.$S2"
                        },
                        enum: {
                            token: "keyword",
                            next: "@enumDecl.$S2"
                        },
                        message: {
                            token: "keyword",
                            next: "@messageDecl.$S2"
                        },
                        service: {
                            token: "keyword",
                            next: "@serviceDecl.$S2"
                        },
                        extend: {
                            cases: {
                                "$S2==proto2": {
                                    token: "keyword",
                                    next: "@extendDecl.$S2"
                                }
                            }
                        },
                        "@keywords": "keyword",
                        "@default": "identifier"
                    }
                }
            ]
        ],
        enumDecl: [
            {
                include: "@whitespace"
            },
            [
                /@identifier/,
                "type.identifier"
            ],
            [
                /{/,
                {
                    token: "@brackets",
                    bracket: "@open",
                    switchTo: "@enumBody.$S2"
                }
            ]
        ],
        enumBody: [
            {
                include: "@whitespace"
            },
            {
                include: "@constant"
            },
            [
                /=/,
                "operators"
            ],
            [
                /;/,
                "delimiter"
            ],
            [
                /option\b/,
                "keyword",
                "@option.$S2"
            ],
            [
                /@identifier/,
                "identifier"
            ],
            [
                /\[/,
                {
                    token: "@brackets",
                    bracket: "@open",
                    next: "@options.$S2"
                }
            ],
            [
                /}/,
                {
                    token: "@brackets",
                    bracket: "@close",
                    next: "@pop"
                }
            ]
        ],
        messageDecl: [
            {
                include: "@whitespace"
            },
            [
                /@identifier/,
                "type.identifier"
            ],
            [
                /{/,
                {
                    token: "@brackets",
                    bracket: "@open",
                    switchTo: "@messageBody.$S2"
                }
            ]
        ],
        messageBody: [
            {
                include: "@whitespace"
            },
            {
                include: "@constant"
            },
            [
                /=/,
                "operators"
            ],
            [
                /;/,
                "delimiter"
            ],
            [
                "(map)(s*)(<)",
                [
                    "keyword",
                    "white",
                    {
                        token: "@brackets",
                        bracket: "@open",
                        next: "@map.$S2"
                    }
                ]
            ],
            [
                /@identifier/,
                {
                    cases: {
                        option: {
                            token: "keyword",
                            next: "@option.$S2"
                        },
                        enum: {
                            token: "keyword",
                            next: "@enumDecl.$S2"
                        },
                        message: {
                            token: "keyword",
                            next: "@messageDecl.$S2"
                        },
                        oneof: {
                            token: "keyword",
                            next: "@oneofDecl.$S2"
                        },
                        extensions: {
                            cases: {
                                "$S2==proto2": {
                                    token: "keyword",
                                    next: "@reserved.$S2"
                                }
                            }
                        },
                        reserved: {
                            token: "keyword",
                            next: "@reserved.$S2"
                        },
                        "(?:repeated|optional)": {
                            token: "keyword",
                            next: "@field.$S2"
                        },
                        required: {
                            cases: {
                                "$S2==proto2": {
                                    token: "keyword",
                                    next: "@field.$S2"
                                }
                            }
                        },
                        "$S2==proto3": {
                            token: "@rematch",
                            next: "@field.$S2"
                        }
                    }
                }
            ],
            [
                /\[/,
                {
                    token: "@brackets",
                    bracket: "@open",
                    next: "@options.$S2"
                }
            ],
            [
                /}/,
                {
                    token: "@brackets",
                    bracket: "@close",
                    next: "@pop"
                }
            ]
        ],
        extendDecl: [
            {
                include: "@whitespace"
            },
            [
                /@identifier/,
                "type.identifier"
            ],
            [
                /{/,
                {
                    token: "@brackets",
                    bracket: "@open",
                    switchTo: "@extendBody.$S2"
                }
            ]
        ],
        extendBody: [
            {
                include: "@whitespace"
            },
            {
                include: "@constant"
            },
            [
                /;/,
                "delimiter"
            ],
            [
                /(?:repeated|optional|required)/,
                "keyword",
                "@field.$S2"
            ],
            [
                /\[/,
                {
                    token: "@brackets",
                    bracket: "@open",
                    next: "@options.$S2"
                }
            ],
            [
                /}/,
                {
                    token: "@brackets",
                    bracket: "@close",
                    next: "@pop"
                }
            ]
        ],
        options: [
            {
                include: "@whitespace"
            },
            {
                include: "@constant"
            },
            [
                /;/,
                "delimiter"
            ],
            [
                /@optionName/,
                "annotation"
            ],
            [
                /[()]/,
                "annotation.brackets"
            ],
            [
                /=/,
                "operator"
            ],
            [
                /\]/,
                {
                    token: "@brackets",
                    bracket: "@close",
                    next: "@pop"
                }
            ]
        ],
        option: [
            {
                include: "@whitespace"
            },
            [
                /@optionName/,
                "annotation"
            ],
            [
                /[()]/,
                "annotation.brackets"
            ],
            [
                /=/,
                "operator",
                "@pop"
            ]
        ],
        oneofDecl: [
            {
                include: "@whitespace"
            },
            [
                /@identifier/,
                "identifier"
            ],
            [
                /{/,
                {
                    token: "@brackets",
                    bracket: "@open",
                    switchTo: "@oneofBody.$S2"
                }
            ]
        ],
        oneofBody: [
            {
                include: "@whitespace"
            },
            {
                include: "@constant"
            },
            [
                /;/,
                "delimiter"
            ],
            [
                /(@identifier)(\s*)(=)/,
                [
                    "identifier",
                    "white",
                    "delimiter"
                ]
            ],
            [
                /@fullIdentifier|\./,
                {
                    cases: {
                        "@builtinTypes": "keyword",
                        "@default": "type.identifier"
                    }
                }
            ],
            [
                /\[/,
                {
                    token: "@brackets",
                    bracket: "@open",
                    next: "@options.$S2"
                }
            ],
            [
                /}/,
                {
                    token: "@brackets",
                    bracket: "@close",
                    next: "@pop"
                }
            ]
        ],
        reserved: [
            {
                include: "@whitespace"
            },
            [
                /,/,
                "delimiter"
            ],
            [
                /;/,
                "delimiter",
                "@pop"
            ],
            {
                include: "@constant"
            },
            [
                /to\b|max\b/,
                "keyword"
            ]
        ],
        map: [
            {
                include: "@whitespace"
            },
            [
                /@fullIdentifier|\./,
                {
                    cases: {
                        "@builtinTypes": "keyword",
                        "@default": "type.identifier"
                    }
                }
            ],
            [
                /,/,
                "delimiter"
            ],
            [
                />/,
                {
                    token: "@brackets",
                    bracket: "@close",
                    switchTo: "identifier"
                }
            ]
        ],
        field: [
            {
                include: "@whitespace"
            },
            [
                "group",
                {
                    cases: {
                        "$S2==proto2": {
                            token: "keyword",
                            switchTo: "@groupDecl.$S2"
                        }
                    }
                }
            ],
            [
                /(@identifier)(\s*)(=)/,
                [
                    "identifier",
                    "white",
                    {
                        token: "delimiter",
                        next: "@pop"
                    }
                ]
            ],
            [
                /@fullIdentifier|\./,
                {
                    cases: {
                        "@builtinTypes": "keyword",
                        "@default": "type.identifier"
                    }
                }
            ]
        ],
        groupDecl: [
            {
                include: "@whitespace"
            },
            [
                /@identifier/,
                "identifier"
            ],
            [
                "=",
                "operator"
            ],
            [
                /{/,
                {
                    token: "@brackets",
                    bracket: "@open",
                    switchTo: "@messageBody.$S2"
                }
            ],
            {
                include: "@constant"
            }
        ],
        type: [
            {
                include: "@whitespace"
            },
            [
                /@identifier/,
                "type.identifier",
                "@pop"
            ],
            [
                /./,
                "delimiter"
            ]
        ],
        identifier: [
            {
                include: "@whitespace"
            },
            [
                /@identifier/,
                "identifier",
                "@pop"
            ]
        ],
        serviceDecl: [
            {
                include: "@whitespace"
            },
            [
                /@identifier/,
                "identifier"
            ],
            [
                /{/,
                {
                    token: "@brackets",
                    bracket: "@open",
                    switchTo: "@serviceBody.$S2"
                }
            ]
        ],
        serviceBody: [
            {
                include: "@whitespace"
            },
            {
                include: "@constant"
            },
            [
                /;/,
                "delimiter"
            ],
            [
                /option\b/,
                "keyword",
                "@option.$S2"
            ],
            [
                /rpc\b/,
                "keyword",
                "@rpc.$S2"
            ],
            [
                /\[/,
                {
                    token: "@brackets",
                    bracket: "@open",
                    next: "@options.$S2"
                }
            ],
            [
                /}/,
                {
                    token: "@brackets",
                    bracket: "@close",
                    next: "@pop"
                }
            ]
        ],
        rpc: [
            {
                include: "@whitespace"
            },
            [
                /@identifier/,
                "identifier"
            ],
            [
                /\(/,
                {
                    token: "@brackets",
                    bracket: "@open",
                    switchTo: "@request.$S2"
                }
            ],
            [
                /{/,
                {
                    token: "@brackets",
                    bracket: "@open",
                    next: "@methodOptions.$S2"
                }
            ],
            [
                /;/,
                "delimiter",
                "@pop"
            ]
        ],
        request: [
            {
                include: "@whitespace"
            },
            [
                /@messageType/,
                {
                    cases: {
                        stream: {
                            token: "keyword",
                            next: "@type.$S2"
                        },
                        "@default": "type.identifier"
                    }
                }
            ],
            [
                /\)/,
                {
                    token: "@brackets",
                    bracket: "@close",
                    switchTo: "@returns.$S2"
                }
            ]
        ],
        returns: [
            {
                include: "@whitespace"
            },
            [
                /returns\b/,
                "keyword"
            ],
            [
                /\(/,
                {
                    token: "@brackets",
                    bracket: "@open",
                    switchTo: "@response.$S2"
                }
            ]
        ],
        response: [
            {
                include: "@whitespace"
            },
            [
                /@messageType/,
                {
                    cases: {
                        stream: {
                            token: "keyword",
                            next: "@type.$S2"
                        },
                        "@default": "type.identifier"
                    }
                }
            ],
            [
                /\)/,
                {
                    token: "@brackets",
                    bracket: "@close",
                    switchTo: "@rpc.$S2"
                }
            ]
        ],
        methodOptions: [
            {
                include: "@whitespace"
            },
            {
                include: "@constant"
            },
            [
                /;/,
                "delimiter"
            ],
            [
                "option",
                "keyword"
            ],
            [
                /@optionName/,
                "annotation"
            ],
            [
                /[()]/,
                "annotation.brackets"
            ],
            [
                /=/,
                "operator"
            ],
            [
                /}/,
                {
                    token: "@brackets",
                    bracket: "@close",
                    next: "@pop"
                }
            ]
        ],
        comment: [
            [
                /[^\/*]+/,
                "comment"
            ],
            [
                /\/\*/,
                "comment",
                "@push"
            ],
            [
                "\\*/",
                "comment",
                "@pop"
            ],
            [
                /[\/*]/,
                "comment"
            ]
        ],
        string: [
            [
                /[^\\"]+/,
                "string"
            ],
            [
                /@escapes/,
                "string.escape"
            ],
            [
                /\\./,
                "string.escape.invalid"
            ],
            [
                /"/,
                {
                    token: "string.quote",
                    bracket: "@close",
                    next: "@pop"
                }
            ]
        ],
        stringSingle: [
            [
                /[^\\']+/,
                "string"
            ],
            [
                /@escapes/,
                "string.escape"
            ],
            [
                /\\./,
                "string.escape.invalid"
            ],
            [
                /'/,
                {
                    token: "string.quote",
                    bracket: "@close",
                    next: "@pop"
                }
            ]
        ],
        constant: [
            [
                "@boolLit",
                "keyword.constant"
            ],
            [
                "@hexLit",
                "number.hex"
            ],
            [
                "@octalLit",
                "number.octal"
            ],
            [
                "@decimalLit",
                "number"
            ],
            [
                "@floatLit",
                "number.float"
            ],
            [
                /("([^"\\]|\\.)*|'([^'\\]|\\.)*)$/,
                "string.invalid"
            ],
            [
                /"/,
                {
                    token: "string.quote",
                    bracket: "@open",
                    next: "@string"
                }
            ],
            [
                /'/,
                {
                    token: "string.quote",
                    bracket: "@open",
                    next: "@stringSingle"
                }
            ],
            [
                /{/,
                {
                    token: "@brackets",
                    bracket: "@open",
                    next: "@prototext"
                }
            ],
            [
                /identifier/,
                "identifier"
            ]
        ],
        whitespace: [
            [
                /[ \t\r\n]+/,
                "white"
            ],
            [
                /\/\*/,
                "comment",
                "@comment"
            ],
            [
                /\/\/.*$/,
                "comment"
            ]
        ],
        prototext: [
            {
                include: "@whitespace"
            },
            {
                include: "@constant"
            },
            [
                /@identifier/,
                "identifier"
            ],
            [
                /[:;]/,
                "delimiter"
            ],
            [
                /}/,
                {
                    token: "@brackets",
                    bracket: "@close",
                    next: "@pop"
                }
            ]
        ]
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}]},["2Pn5h"], null, "parcelRequire4f3a")

//# sourceMappingURL=protobuf.d7400bab.js.map
