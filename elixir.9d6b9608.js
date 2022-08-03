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
})({"7gn6E":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "2824b156c8b6f7dd935f54769d6b9608"; // @flow
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

},{}],"64QfN":[function(require,module,exports) {
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
 *-----------------------------------------------------------------------------*/ // src/basic-languages/elixir/elixir.ts
var conf = {
    comments: {
        lineComment: "#"
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
            open: "'",
            close: "'"
        },
        {
            open: '"',
            close: '"'
        }
    ],
    autoClosingPairs: [
        {
            open: "'",
            close: "'",
            notIn: [
                "string",
                "comment"
            ]
        },
        {
            open: '"',
            close: '"',
            notIn: [
                "comment"
            ]
        },
        {
            open: '"""',
            close: '"""'
        },
        {
            open: "`",
            close: "`",
            notIn: [
                "string",
                "comment"
            ]
        },
        {
            open: "(",
            close: ")"
        },
        {
            open: "{",
            close: "}"
        },
        {
            open: "[",
            close: "]"
        },
        {
            open: "<<",
            close: ">>"
        }
    ],
    indentationRules: {
        increaseIndentPattern: /^\s*(after|else|catch|rescue|fn|[^#]*(do|<\-|\->|\{|\[|\=))\s*$/,
        decreaseIndentPattern: /^\s*((\}|\])\s*$|(after|else|catch|rescue|end)\b)/
    }
};
var language = {
    defaultToken: "source",
    tokenPostfix: ".elixir",
    brackets: [
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
            open: "{",
            close: "}",
            token: "delimiter.curly"
        },
        {
            open: "<<",
            close: ">>",
            token: "delimiter.angle.special"
        }
    ],
    declarationKeywords: [
        "def",
        "defp",
        "defn",
        "defnp",
        "defguard",
        "defguardp",
        "defmacro",
        "defmacrop",
        "defdelegate",
        "defcallback",
        "defmacrocallback",
        "defmodule",
        "defprotocol",
        "defexception",
        "defimpl",
        "defstruct"
    ],
    operatorKeywords: [
        "and",
        "in",
        "not",
        "or",
        "when"
    ],
    namespaceKeywords: [
        "alias",
        "import",
        "require",
        "use"
    ],
    otherKeywords: [
        "after",
        "case",
        "catch",
        "cond",
        "do",
        "else",
        "end",
        "fn",
        "for",
        "if",
        "quote",
        "raise",
        "receive",
        "rescue",
        "super",
        "throw",
        "try",
        "unless",
        "unquote_splicing",
        "unquote",
        "with"
    ],
    constants: [
        "true",
        "false",
        "nil"
    ],
    nameBuiltin: [
        "__MODULE__",
        "__DIR__",
        "__ENV__",
        "__CALLER__",
        "__STACKTRACE__"
    ],
    operator: /-[->]?|!={0,2}|\*{1,2}|\/|\\\\|&{1,3}|\.\.?|\^(?:\^\^)?|\+\+?|<(?:-|<<|=|>|\|>|~>?)?|=~|={1,3}|>(?:=|>>)?|\|~>|\|>|\|{1,3}|~>>?|~~~|::/,
    variableName: /[a-z_][a-zA-Z0-9_]*[?!]?/,
    atomName: /[a-zA-Z_][a-zA-Z0-9_@]*[?!]?|@specialAtomName|@operator/,
    specialAtomName: /\.\.\.|<<>>|%\{\}|%|\{\}/,
    aliasPart: /[A-Z][a-zA-Z0-9_]*/,
    moduleName: /@aliasPart(?:\.@aliasPart)*/,
    sigilSymmetricDelimiter: /"""|'''|"|'|\/|\|/,
    sigilStartDelimiter: /@sigilSymmetricDelimiter|<|\{|\[|\(/,
    sigilEndDelimiter: /@sigilSymmetricDelimiter|>|\}|\]|\)/,
    sigilModifiers: /[a-zA-Z0-9]*/,
    decimal: /\d(?:_?\d)*/,
    hex: /[0-9a-fA-F](_?[0-9a-fA-F])*/,
    octal: /[0-7](_?[0-7])*/,
    binary: /[01](_?[01])*/,
    escape: /\\u[0-9a-fA-F]{4}|\\x[0-9a-fA-F]{2}|\\./,
    tokenizer: {
        root: [
            {
                include: "@whitespace"
            },
            {
                include: "@comments"
            },
            {
                include: "@keywordsShorthand"
            },
            {
                include: "@numbers"
            },
            {
                include: "@identifiers"
            },
            {
                include: "@strings"
            },
            {
                include: "@atoms"
            },
            {
                include: "@sigils"
            },
            {
                include: "@attributes"
            },
            {
                include: "@symbols"
            }
        ],
        whitespace: [
            [
                /\s+/,
                "white"
            ]
        ],
        comments: [
            [
                /(#)(.*)/,
                [
                    "comment.punctuation",
                    "comment"
                ]
            ]
        ],
        keywordsShorthand: [
            [
                /(@atomName)(:)/,
                [
                    "constant",
                    "constant.punctuation"
                ]
            ],
            [
                /"(?=([^"]|#\{.*?\}|\\")*":)/,
                {
                    token: "constant.delimiter",
                    next: "@doubleQuotedStringKeyword"
                }
            ],
            [
                /'(?=([^']|#\{.*?\}|\\')*':)/,
                {
                    token: "constant.delimiter",
                    next: "@singleQuotedStringKeyword"
                }
            ]
        ],
        doubleQuotedStringKeyword: [
            [
                /":/,
                {
                    token: "constant.delimiter",
                    next: "@pop"
                }
            ],
            {
                include: "@stringConstantContentInterpol"
            }
        ],
        singleQuotedStringKeyword: [
            [
                /':/,
                {
                    token: "constant.delimiter",
                    next: "@pop"
                }
            ],
            {
                include: "@stringConstantContentInterpol"
            }
        ],
        numbers: [
            [
                /0b@binary/,
                "number.binary"
            ],
            [
                /0o@octal/,
                "number.octal"
            ],
            [
                /0x@hex/,
                "number.hex"
            ],
            [
                /@decimal\.@decimal([eE]-?@decimal)?/,
                "number.float"
            ],
            [
                /@decimal/,
                "number"
            ]
        ],
        identifiers: [
            [
                /\b(defp?|defnp?|defmacrop?|defguardp?|defdelegate)(\s+)(@variableName)(?!\s+@operator)/,
                [
                    "keyword.declaration",
                    "white",
                    {
                        cases: {
                            unquote: "keyword",
                            "@default": "function"
                        }
                    }
                ]
            ],
            [
                /(@variableName)(?=\s*\.?\s*\()/,
                {
                    cases: {
                        "@declarationKeywords": "keyword.declaration",
                        "@namespaceKeywords": "keyword",
                        "@otherKeywords": "keyword",
                        "@default": "function.call"
                    }
                }
            ],
            [
                /(@moduleName)(\s*)(\.)(\s*)(@variableName)/,
                [
                    "type.identifier",
                    "white",
                    "operator",
                    "white",
                    "function.call"
                ]
            ],
            [
                /(:)(@atomName)(\s*)(\.)(\s*)(@variableName)/,
                [
                    "constant.punctuation",
                    "constant",
                    "white",
                    "operator",
                    "white",
                    "function.call"
                ]
            ],
            [
                /(\|>)(\s*)(@variableName)/,
                [
                    "operator",
                    "white",
                    {
                        cases: {
                            "@otherKeywords": "keyword",
                            "@default": "function.call"
                        }
                    }
                ]
            ],
            [
                /(&)(\s*)(@variableName)/,
                [
                    "operator",
                    "white",
                    "function.call"
                ]
            ],
            [
                /@variableName/,
                {
                    cases: {
                        "@declarationKeywords": "keyword.declaration",
                        "@operatorKeywords": "keyword.operator",
                        "@namespaceKeywords": "keyword",
                        "@otherKeywords": "keyword",
                        "@constants": "constant.language",
                        "@nameBuiltin": "variable.language",
                        "_.*": "comment.unused",
                        "@default": "identifier"
                    }
                }
            ],
            [
                /@moduleName/,
                "type.identifier"
            ]
        ],
        strings: [
            [
                /"""/,
                {
                    token: "string.delimiter",
                    next: "@doubleQuotedHeredoc"
                }
            ],
            [
                /'''/,
                {
                    token: "string.delimiter",
                    next: "@singleQuotedHeredoc"
                }
            ],
            [
                /"/,
                {
                    token: "string.delimiter",
                    next: "@doubleQuotedString"
                }
            ],
            [
                /'/,
                {
                    token: "string.delimiter",
                    next: "@singleQuotedString"
                }
            ]
        ],
        doubleQuotedHeredoc: [
            [
                /"""/,
                {
                    token: "string.delimiter",
                    next: "@pop"
                }
            ],
            {
                include: "@stringContentInterpol"
            }
        ],
        singleQuotedHeredoc: [
            [
                /'''/,
                {
                    token: "string.delimiter",
                    next: "@pop"
                }
            ],
            {
                include: "@stringContentInterpol"
            }
        ],
        doubleQuotedString: [
            [
                /"/,
                {
                    token: "string.delimiter",
                    next: "@pop"
                }
            ],
            {
                include: "@stringContentInterpol"
            }
        ],
        singleQuotedString: [
            [
                /'/,
                {
                    token: "string.delimiter",
                    next: "@pop"
                }
            ],
            {
                include: "@stringContentInterpol"
            }
        ],
        atoms: [
            [
                /(:)(@atomName)/,
                [
                    "constant.punctuation",
                    "constant"
                ]
            ],
            [
                /:"/,
                {
                    token: "constant.delimiter",
                    next: "@doubleQuotedStringAtom"
                }
            ],
            [
                /:'/,
                {
                    token: "constant.delimiter",
                    next: "@singleQuotedStringAtom"
                }
            ]
        ],
        doubleQuotedStringAtom: [
            [
                /"/,
                {
                    token: "constant.delimiter",
                    next: "@pop"
                }
            ],
            {
                include: "@stringConstantContentInterpol"
            }
        ],
        singleQuotedStringAtom: [
            [
                /'/,
                {
                    token: "constant.delimiter",
                    next: "@pop"
                }
            ],
            {
                include: "@stringConstantContentInterpol"
            }
        ],
        sigils: [
            [
                /~[a-z]@sigilStartDelimiter/,
                {
                    token: "@rematch",
                    next: "@sigil.interpol"
                }
            ],
            [
                /~[A-Z]@sigilStartDelimiter/,
                {
                    token: "@rematch",
                    next: "@sigil.noInterpol"
                }
            ]
        ],
        sigil: [
            [
                /~([a-zA-Z])\{/,
                {
                    token: "@rematch",
                    switchTo: "@sigilStart.$S2.$1.{.}"
                }
            ],
            [
                /~([a-zA-Z])\[/,
                {
                    token: "@rematch",
                    switchTo: "@sigilStart.$S2.$1.[.]"
                }
            ],
            [
                /~([a-zA-Z])\(/,
                {
                    token: "@rematch",
                    switchTo: "@sigilStart.$S2.$1.(.)"
                }
            ],
            [
                /~([a-zA-Z])\</,
                {
                    token: "@rematch",
                    switchTo: "@sigilStart.$S2.$1.<.>"
                }
            ],
            [
                /~([a-zA-Z])(@sigilSymmetricDelimiter)/,
                {
                    token: "@rematch",
                    switchTo: "@sigilStart.$S2.$1.$2.$2"
                }
            ]
        ],
        "sigilStart.interpol.s": [
            [
                /~s@sigilStartDelimiter/,
                {
                    token: "string.delimiter",
                    switchTo: "@sigilContinue.$S2.$S3.$S4.$S5"
                }
            ]
        ],
        "sigilContinue.interpol.s": [
            [
                /(@sigilEndDelimiter)@sigilModifiers/,
                {
                    cases: {
                        "$1==$S5": {
                            token: "string.delimiter",
                            next: "@pop"
                        },
                        "@default": "string"
                    }
                }
            ],
            {
                include: "@stringContentInterpol"
            }
        ],
        "sigilStart.noInterpol.S": [
            [
                /~S@sigilStartDelimiter/,
                {
                    token: "string.delimiter",
                    switchTo: "@sigilContinue.$S2.$S3.$S4.$S5"
                }
            ]
        ],
        "sigilContinue.noInterpol.S": [
            [
                /(^|[^\\])\\@sigilEndDelimiter/,
                "string"
            ],
            [
                /(@sigilEndDelimiter)@sigilModifiers/,
                {
                    cases: {
                        "$1==$S5": {
                            token: "string.delimiter",
                            next: "@pop"
                        },
                        "@default": "string"
                    }
                }
            ],
            {
                include: "@stringContent"
            }
        ],
        "sigilStart.interpol.r": [
            [
                /~r@sigilStartDelimiter/,
                {
                    token: "regexp.delimiter",
                    switchTo: "@sigilContinue.$S2.$S3.$S4.$S5"
                }
            ]
        ],
        "sigilContinue.interpol.r": [
            [
                /(@sigilEndDelimiter)@sigilModifiers/,
                {
                    cases: {
                        "$1==$S5": {
                            token: "regexp.delimiter",
                            next: "@pop"
                        },
                        "@default": "regexp"
                    }
                }
            ],
            {
                include: "@regexpContentInterpol"
            }
        ],
        "sigilStart.noInterpol.R": [
            [
                /~R@sigilStartDelimiter/,
                {
                    token: "regexp.delimiter",
                    switchTo: "@sigilContinue.$S2.$S3.$S4.$S5"
                }
            ]
        ],
        "sigilContinue.noInterpol.R": [
            [
                /(^|[^\\])\\@sigilEndDelimiter/,
                "regexp"
            ],
            [
                /(@sigilEndDelimiter)@sigilModifiers/,
                {
                    cases: {
                        "$1==$S5": {
                            token: "regexp.delimiter",
                            next: "@pop"
                        },
                        "@default": "regexp"
                    }
                }
            ],
            {
                include: "@regexpContent"
            }
        ],
        "sigilStart.interpol": [
            [
                /~([a-zA-Z])@sigilStartDelimiter/,
                {
                    token: "sigil.delimiter",
                    switchTo: "@sigilContinue.$S2.$S3.$S4.$S5"
                }
            ]
        ],
        "sigilContinue.interpol": [
            [
                /(@sigilEndDelimiter)@sigilModifiers/,
                {
                    cases: {
                        "$1==$S5": {
                            token: "sigil.delimiter",
                            next: "@pop"
                        },
                        "@default": "sigil"
                    }
                }
            ],
            {
                include: "@sigilContentInterpol"
            }
        ],
        "sigilStart.noInterpol": [
            [
                /~([a-zA-Z])@sigilStartDelimiter/,
                {
                    token: "sigil.delimiter",
                    switchTo: "@sigilContinue.$S2.$S3.$S4.$S5"
                }
            ]
        ],
        "sigilContinue.noInterpol": [
            [
                /(^|[^\\])\\@sigilEndDelimiter/,
                "sigil"
            ],
            [
                /(@sigilEndDelimiter)@sigilModifiers/,
                {
                    cases: {
                        "$1==$S5": {
                            token: "sigil.delimiter",
                            next: "@pop"
                        },
                        "@default": "sigil"
                    }
                }
            ],
            {
                include: "@sigilContent"
            }
        ],
        attributes: [
            [
                /\@(module|type)?doc (~[sS])?"""/,
                {
                    token: "comment.block.documentation",
                    next: "@doubleQuotedHeredocDocstring"
                }
            ],
            [
                /\@(module|type)?doc (~[sS])?"/,
                {
                    token: "comment.block.documentation",
                    next: "@doubleQuotedStringDocstring"
                }
            ],
            [
                /\@(module|type)?doc false/,
                "comment.block.documentation"
            ],
            [
                /\@(@variableName)/,
                "variable"
            ]
        ],
        doubleQuotedHeredocDocstring: [
            [
                /"""/,
                {
                    token: "comment.block.documentation",
                    next: "@pop"
                }
            ],
            {
                include: "@docstringContent"
            }
        ],
        doubleQuotedStringDocstring: [
            [
                /"/,
                {
                    token: "comment.block.documentation",
                    next: "@pop"
                }
            ],
            {
                include: "@docstringContent"
            }
        ],
        symbols: [
            [
                /\?(\\.|[^\\\s])/,
                "number.constant"
            ],
            [
                /&\d+/,
                "operator"
            ],
            [
                /<<<|>>>/,
                "operator"
            ],
            [
                /[()\[\]\{\}]|<<|>>/,
                "@brackets"
            ],
            [
                /\.\.\./,
                "identifier"
            ],
            [
                /=>/,
                "punctuation"
            ],
            [
                /@operator/,
                "operator"
            ],
            [
                /[:;,.%]/,
                "punctuation"
            ]
        ],
        stringContentInterpol: [
            {
                include: "@interpolation"
            },
            {
                include: "@escapeChar"
            },
            {
                include: "@stringContent"
            }
        ],
        stringContent: [
            [
                /./,
                "string"
            ]
        ],
        stringConstantContentInterpol: [
            {
                include: "@interpolation"
            },
            {
                include: "@escapeChar"
            },
            {
                include: "@stringConstantContent"
            }
        ],
        stringConstantContent: [
            [
                /./,
                "constant"
            ]
        ],
        regexpContentInterpol: [
            {
                include: "@interpolation"
            },
            {
                include: "@escapeChar"
            },
            {
                include: "@regexpContent"
            }
        ],
        regexpContent: [
            [
                /(\s)(#)(\s.*)$/,
                [
                    "white",
                    "comment.punctuation",
                    "comment"
                ]
            ],
            [
                /./,
                "regexp"
            ]
        ],
        sigilContentInterpol: [
            {
                include: "@interpolation"
            },
            {
                include: "@escapeChar"
            },
            {
                include: "@sigilContent"
            }
        ],
        sigilContent: [
            [
                /./,
                "sigil"
            ]
        ],
        docstringContent: [
            [
                /./,
                "comment.block.documentation"
            ]
        ],
        escapeChar: [
            [
                /@escape/,
                "constant.character.escape"
            ]
        ],
        interpolation: [
            [
                /#{/,
                {
                    token: "delimiter.bracket.embed",
                    next: "@interpolationContinue"
                }
            ]
        ],
        interpolationContinue: [
            [
                /}/,
                {
                    token: "delimiter.bracket.embed",
                    next: "@pop"
                }
            ],
            {
                include: "@root"
            }
        ]
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}]},["7gn6E"], null, "parcelRequire4f3a")

//# sourceMappingURL=elixir.9d6b9608.js.map
