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
})({"6MxjR":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "5add23ae7df3e02fdfa7b3bb8b9b35c0"; // @flow
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

},{}],"6JiaL":[function(require,module,exports) {
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
 *-----------------------------------------------------------------------------*/ // src/basic-languages/st/st.ts
var conf = {
    comments: {
        lineComment: "//",
        blockComment: [
            "(*",
            "*)"
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
            "var",
            "end_var"
        ],
        [
            "var_input",
            "end_var"
        ],
        [
            "var_output",
            "end_var"
        ],
        [
            "var_in_out",
            "end_var"
        ],
        [
            "var_temp",
            "end_var"
        ],
        [
            "var_global",
            "end_var"
        ],
        [
            "var_access",
            "end_var"
        ],
        [
            "var_external",
            "end_var"
        ],
        [
            "type",
            "end_type"
        ],
        [
            "struct",
            "end_struct"
        ],
        [
            "program",
            "end_program"
        ],
        [
            "function",
            "end_function"
        ],
        [
            "function_block",
            "end_function_block"
        ],
        [
            "action",
            "end_action"
        ],
        [
            "step",
            "end_step"
        ],
        [
            "initial_step",
            "end_step"
        ],
        [
            "transaction",
            "end_transaction"
        ],
        [
            "configuration",
            "end_configuration"
        ],
        [
            "tcp",
            "end_tcp"
        ],
        [
            "recource",
            "end_recource"
        ],
        [
            "channel",
            "end_channel"
        ],
        [
            "library",
            "end_library"
        ],
        [
            "folder",
            "end_folder"
        ],
        [
            "binaries",
            "end_binaries"
        ],
        [
            "includes",
            "end_includes"
        ],
        [
            "sources",
            "end_sources"
        ]
    ],
    autoClosingPairs: [
        {
            open: "[",
            close: "]"
        },
        {
            open: "{",
            close: "}"
        },
        {
            open: "(",
            close: ")"
        },
        {
            open: "/*",
            close: "*/"
        },
        {
            open: "'",
            close: "'",
            notIn: [
                "string_sq"
            ]
        },
        {
            open: '"',
            close: '"',
            notIn: [
                "string_dq"
            ]
        },
        {
            open: "var_input",
            close: "end_var"
        },
        {
            open: "var_output",
            close: "end_var"
        },
        {
            open: "var_in_out",
            close: "end_var"
        },
        {
            open: "var_temp",
            close: "end_var"
        },
        {
            open: "var_global",
            close: "end_var"
        },
        {
            open: "var_access",
            close: "end_var"
        },
        {
            open: "var_external",
            close: "end_var"
        },
        {
            open: "type",
            close: "end_type"
        },
        {
            open: "struct",
            close: "end_struct"
        },
        {
            open: "program",
            close: "end_program"
        },
        {
            open: "function",
            close: "end_function"
        },
        {
            open: "function_block",
            close: "end_function_block"
        },
        {
            open: "action",
            close: "end_action"
        },
        {
            open: "step",
            close: "end_step"
        },
        {
            open: "initial_step",
            close: "end_step"
        },
        {
            open: "transaction",
            close: "end_transaction"
        },
        {
            open: "configuration",
            close: "end_configuration"
        },
        {
            open: "tcp",
            close: "end_tcp"
        },
        {
            open: "recource",
            close: "end_recource"
        },
        {
            open: "channel",
            close: "end_channel"
        },
        {
            open: "library",
            close: "end_library"
        },
        {
            open: "folder",
            close: "end_folder"
        },
        {
            open: "binaries",
            close: "end_binaries"
        },
        {
            open: "includes",
            close: "end_includes"
        },
        {
            open: "sources",
            close: "end_sources"
        }
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
            open: '"',
            close: '"'
        },
        {
            open: "'",
            close: "'"
        },
        {
            open: "var",
            close: "end_var"
        },
        {
            open: "var_input",
            close: "end_var"
        },
        {
            open: "var_output",
            close: "end_var"
        },
        {
            open: "var_in_out",
            close: "end_var"
        },
        {
            open: "var_temp",
            close: "end_var"
        },
        {
            open: "var_global",
            close: "end_var"
        },
        {
            open: "var_access",
            close: "end_var"
        },
        {
            open: "var_external",
            close: "end_var"
        },
        {
            open: "type",
            close: "end_type"
        },
        {
            open: "struct",
            close: "end_struct"
        },
        {
            open: "program",
            close: "end_program"
        },
        {
            open: "function",
            close: "end_function"
        },
        {
            open: "function_block",
            close: "end_function_block"
        },
        {
            open: "action",
            close: "end_action"
        },
        {
            open: "step",
            close: "end_step"
        },
        {
            open: "initial_step",
            close: "end_step"
        },
        {
            open: "transaction",
            close: "end_transaction"
        },
        {
            open: "configuration",
            close: "end_configuration"
        },
        {
            open: "tcp",
            close: "end_tcp"
        },
        {
            open: "recource",
            close: "end_recource"
        },
        {
            open: "channel",
            close: "end_channel"
        },
        {
            open: "library",
            close: "end_library"
        },
        {
            open: "folder",
            close: "end_folder"
        },
        {
            open: "binaries",
            close: "end_binaries"
        },
        {
            open: "includes",
            close: "end_includes"
        },
        {
            open: "sources",
            close: "end_sources"
        }
    ],
    folding: {
        markers: {
            start: new RegExp("^\\s*#pragma\\s+region\\b"),
            end: new RegExp("^\\s*#pragma\\s+endregion\\b")
        }
    }
};
var language = {
    defaultToken: "",
    tokenPostfix: ".st",
    ignoreCase: true,
    brackets: [
        {
            token: "delimiter.curly",
            open: "{",
            close: "}"
        },
        {
            token: "delimiter.parenthesis",
            open: "(",
            close: ")"
        },
        {
            token: "delimiter.square",
            open: "[",
            close: "]"
        }
    ],
    keywords: [
        "if",
        "end_if",
        "elsif",
        "else",
        "case",
        "of",
        "to",
        "__try",
        "__catch",
        "__finally",
        "do",
        "with",
        "by",
        "while",
        "repeat",
        "end_while",
        "end_repeat",
        "end_case",
        "for",
        "end_for",
        "task",
        "retain",
        "non_retain",
        "constant",
        "with",
        "at",
        "exit",
        "return",
        "interval",
        "priority",
        "address",
        "port",
        "on_channel",
        "then",
        "iec",
        "file",
        "uses",
        "version",
        "packagetype",
        "displayname",
        "copyright",
        "summary",
        "vendor",
        "common_source",
        "from",
        "extends"
    ],
    constant: [
        "false",
        "true",
        "null"
    ],
    defineKeywords: [
        "var",
        "var_input",
        "var_output",
        "var_in_out",
        "var_temp",
        "var_global",
        "var_access",
        "var_external",
        "end_var",
        "type",
        "end_type",
        "struct",
        "end_struct",
        "program",
        "end_program",
        "function",
        "end_function",
        "function_block",
        "end_function_block",
        "interface",
        "end_interface",
        "method",
        "end_method",
        "property",
        "end_property",
        "namespace",
        "end_namespace",
        "configuration",
        "end_configuration",
        "tcp",
        "end_tcp",
        "resource",
        "end_resource",
        "channel",
        "end_channel",
        "library",
        "end_library",
        "folder",
        "end_folder",
        "binaries",
        "end_binaries",
        "includes",
        "end_includes",
        "sources",
        "end_sources",
        "action",
        "end_action",
        "step",
        "initial_step",
        "end_step",
        "transaction",
        "end_transaction"
    ],
    typeKeywords: [
        "int",
        "sint",
        "dint",
        "lint",
        "usint",
        "uint",
        "udint",
        "ulint",
        "real",
        "lreal",
        "time",
        "date",
        "time_of_day",
        "date_and_time",
        "string",
        "bool",
        "byte",
        "word",
        "dword",
        "array",
        "pointer",
        "lword"
    ],
    operators: [
        "=",
        ">",
        "<",
        ":",
        ":=",
        "<=",
        ">=",
        "<>",
        "&",
        "+",
        "-",
        "*",
        "**",
        "MOD",
        "^",
        "or",
        "and",
        "not",
        "xor",
        "abs",
        "acos",
        "asin",
        "atan",
        "cos",
        "exp",
        "expt",
        "ln",
        "log",
        "sin",
        "sqrt",
        "tan",
        "sel",
        "max",
        "min",
        "limit",
        "mux",
        "shl",
        "shr",
        "rol",
        "ror",
        "indexof",
        "sizeof",
        "adr",
        "adrinst",
        "bitadr",
        "is_valid",
        "ref",
        "ref_to"
    ],
    builtinVariables: [],
    builtinFunctions: [
        "sr",
        "rs",
        "tp",
        "ton",
        "tof",
        "eq",
        "ge",
        "le",
        "lt",
        "ne",
        "round",
        "trunc",
        "ctd",
        "\u0441tu",
        "ctud",
        "r_trig",
        "f_trig",
        "move",
        "concat",
        "delete",
        "find",
        "insert",
        "left",
        "len",
        "replace",
        "right",
        "rtc"
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    tokenizer: {
        root: [
            [
                /(\.\.)/,
                "delimiter"
            ],
            [
                /\b(16#[0-9A-Fa-f\_]*)+\b/,
                "number.hex"
            ],
            [
                /\b(2#[01\_]+)+\b/,
                "number.binary"
            ],
            [
                /\b(8#[0-9\_]*)+\b/,
                "number.octal"
            ],
            [
                /\b\d*\.\d+([eE][\-+]?\d+)?\b/,
                "number.float"
            ],
            [
                /\b(L?REAL)#[0-9\_\.e]+\b/,
                "number.float"
            ],
            [
                /\b(BYTE|(?:D|L)?WORD|U?(?:S|D|L)?INT)#[0-9\_]+\b/,
                "number"
            ],
            [
                /\d+/,
                "number"
            ],
            [
                /\b(T|DT|TOD)#[0-9:-_shmyd]+\b/,
                "tag"
            ],
            [
                /\%(I|Q|M)(X|B|W|D|L)[0-9\.]+/,
                "tag"
            ],
            [
                /\%(I|Q|M)[0-9\.]*/,
                "tag"
            ],
            [
                /\b[A-Za-z]{1,6}#[0-9]+\b/,
                "tag"
            ],
            [
                /\b(TO_|CTU_|CTD_|CTUD_|MUX_|SEL_)[A_Za-z]+\b/,
                "predefined"
            ],
            [
                /\b[A_Za-z]+(_TO_)[A_Za-z]+\b/,
                "predefined"
            ],
            [
                /[;]/,
                "delimiter"
            ],
            [
                /[.]/,
                {
                    token: "delimiter",
                    next: "@params"
                }
            ],
            [
                /[a-zA-Z_]\w*/,
                {
                    cases: {
                        "@operators": "operators",
                        "@keywords": "keyword",
                        "@typeKeywords": "type",
                        "@defineKeywords": "variable",
                        "@constant": "constant",
                        "@builtinVariables": "predefined",
                        "@builtinFunctions": "predefined",
                        "@default": "identifier"
                    }
                }
            ],
            {
                include: "@whitespace"
            },
            [
                /[{}()\[\]]/,
                "@brackets"
            ],
            [
                /"([^"\\]|\\.)*$/,
                "string.invalid"
            ],
            [
                /"/,
                {
                    token: "string.quote",
                    bracket: "@open",
                    next: "@string_dq"
                }
            ],
            [
                /'/,
                {
                    token: "string.quote",
                    bracket: "@open",
                    next: "@string_sq"
                }
            ],
            [
                /'[^\\']'/,
                "string"
            ],
            [
                /(')(@escapes)(')/,
                [
                    "string",
                    "string.escape",
                    "string"
                ]
            ],
            [
                /'/,
                "string.invalid"
            ]
        ],
        params: [
            [
                /\b[A-Za-z0-9_]+\b(?=\()/,
                {
                    token: "identifier",
                    next: "@pop"
                }
            ],
            [
                /\b[A-Za-z0-9_]+\b/,
                "variable.name",
                "@pop"
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
        comment2: [
            [
                /[^\(*]+/,
                "comment"
            ],
            [
                /\(\*/,
                "comment",
                "@push"
            ],
            [
                "\\*\\)",
                "comment",
                "@pop"
            ],
            [
                /[\(*]/,
                "comment"
            ]
        ],
        whitespace: [
            [
                /[ \t\r\n]+/,
                "white"
            ],
            [
                /\/\/.*$/,
                "comment"
            ],
            [
                /\/\*/,
                "comment",
                "@comment"
            ],
            [
                /\(\*/,
                "comment",
                "@comment2"
            ]
        ],
        string_dq: [
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
        string_sq: [
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
        ]
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}]},["6MxjR"], null, "parcelRequire4f3a")

//# sourceMappingURL=st.8b9b35c0.js.map
