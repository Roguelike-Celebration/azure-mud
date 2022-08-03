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
})({"51xjM":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "d90bd7c05d246981a87de81bb970af1a"; // @flow
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

},{}],"6YtoV":[function(require,module,exports) {
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
 *-----------------------------------------------------------------------------*/ // src/basic-languages/ruby/ruby.ts
var conf = {
    comments: {
        lineComment: "#",
        blockComment: [
            "=begin",
            "=end"
        ]
    },
    brackets: [
        [
            "(",
            ")"
        ],
        [
            "{",
            "}"
        ],
        [
            "[",
            "]"
        ]
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
            open: '"',
            close: '"'
        },
        {
            open: "'",
            close: "'"
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
        }
    ],
    indentationRules: {
        increaseIndentPattern: new RegExp(`^\\s*((begin|class|(private|protected)\\s+def|def|else|elsif|ensure|for|if|module|rescue|unless|until|when|while|case)|([^#]*\\sdo\\b)|([^#]*=\\s*(case|if|unless)))\\b([^#\\{;]|("|'|/).*\\4)*(#.*)?$`),
        decreaseIndentPattern: new RegExp("^\\s*([}\\]]([,)]?\\s*(#|$)|\\.[a-zA-Z_]\\w*\\b)|(end|rescue|ensure|else|elsif|when)\\b)")
    }
};
var language = {
    tokenPostfix: ".ruby",
    keywords: [
        "__LINE__",
        "__ENCODING__",
        "__FILE__",
        "BEGIN",
        "END",
        "alias",
        "and",
        "begin",
        "break",
        "case",
        "class",
        "def",
        "defined?",
        "do",
        "else",
        "elsif",
        "end",
        "ensure",
        "for",
        "false",
        "if",
        "in",
        "module",
        "next",
        "nil",
        "not",
        "or",
        "redo",
        "rescue",
        "retry",
        "return",
        "self",
        "super",
        "then",
        "true",
        "undef",
        "unless",
        "until",
        "when",
        "while",
        "yield"
    ],
    keywordops: [
        "::",
        "..",
        "...",
        "?",
        ":",
        "=>"
    ],
    builtins: [
        "require",
        "public",
        "private",
        "include",
        "extend",
        "attr_reader",
        "protected",
        "private_class_method",
        "protected_class_method",
        "new"
    ],
    declarations: [
        "module",
        "class",
        "def",
        "case",
        "do",
        "begin",
        "for",
        "if",
        "while",
        "until",
        "unless"
    ],
    linedecls: [
        "def",
        "case",
        "do",
        "begin",
        "for",
        "if",
        "while",
        "until",
        "unless"
    ],
    operators: [
        "^",
        "&",
        "|",
        "<=>",
        "==",
        "===",
        "!~",
        "=~",
        ">",
        ">=",
        "<",
        "<=",
        "<<",
        ">>",
        "+",
        "-",
        "*",
        "/",
        "%",
        "**",
        "~",
        "+@",
        "-@",
        "[]",
        "[]=",
        "`",
        "+=",
        "-=",
        "*=",
        "**=",
        "/=",
        "^=",
        "%=",
        "<<=",
        ">>=",
        "&=",
        "&&=",
        "||=",
        "|="
    ],
    brackets: [
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
            open: "[",
            close: "]",
            token: "delimiter.square"
        }
    ],
    symbols: /[=><!~?:&|+\-*\/\^%\.]+/,
    escape: /(?:[abefnrstv\\"'\n\r]|[0-7]{1,3}|x[0-9A-Fa-f]{1,2}|u[0-9A-Fa-f]{4})/,
    escapes: /\\(?:C\-(@escape|.)|c(@escape|.)|@escape)/,
    decpart: /\d(_?\d)*/,
    decimal: /0|@decpart/,
    delim: /[^a-zA-Z0-9\s\n\r]/,
    heredelim: /(?:\w+|'[^']*'|"[^"]*"|`[^`]*`)/,
    regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
    regexpesc: /\\(?:[AzZbBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})?/,
    tokenizer: {
        root: [
            [
                /^(\s*)([a-z_]\w*[!?=]?)/,
                [
                    "white",
                    {
                        cases: {
                            "for|until|while": {
                                token: "keyword.$2",
                                next: "@dodecl.$2"
                            },
                            "@declarations": {
                                token: "keyword.$2",
                                next: "@root.$2"
                            },
                            end: {
                                token: "keyword.$S2",
                                next: "@pop"
                            },
                            "@keywords": "keyword",
                            "@builtins": "predefined",
                            "@default": "identifier"
                        }
                    }
                ]
            ],
            [
                /[a-z_]\w*[!?=]?/,
                {
                    cases: {
                        "if|unless|while|until": {
                            token: "keyword.$0x",
                            next: "@modifier.$0x"
                        },
                        for: {
                            token: "keyword.$2",
                            next: "@dodecl.$2"
                        },
                        "@linedecls": {
                            token: "keyword.$0",
                            next: "@root.$0"
                        },
                        end: {
                            token: "keyword.$S2",
                            next: "@pop"
                        },
                        "@keywords": "keyword",
                        "@builtins": "predefined",
                        "@default": "identifier"
                    }
                }
            ],
            [
                /[A-Z][\w]*[!?=]?/,
                "constructor.identifier"
            ],
            [
                /\$[\w]*/,
                "global.constant"
            ],
            [
                /@[\w]*/,
                "namespace.instance.identifier"
            ],
            [
                /@@@[\w]*/,
                "namespace.class.identifier"
            ],
            [
                /<<[-~](@heredelim).*/,
                {
                    token: "string.heredoc.delimiter",
                    next: "@heredoc.$1"
                }
            ],
            [
                /[ \t\r\n]+<<(@heredelim).*/,
                {
                    token: "string.heredoc.delimiter",
                    next: "@heredoc.$1"
                }
            ],
            [
                /^<<(@heredelim).*/,
                {
                    token: "string.heredoc.delimiter",
                    next: "@heredoc.$1"
                }
            ],
            {
                include: "@whitespace"
            },
            [
                /"/,
                {
                    token: "string.d.delim",
                    next: '@dstring.d."'
                }
            ],
            [
                /'/,
                {
                    token: "string.sq.delim",
                    next: "@sstring.sq"
                }
            ],
            [
                /%([rsqxwW]|Q?)/,
                {
                    token: "@rematch",
                    next: "pstring"
                }
            ],
            [
                /`/,
                {
                    token: "string.x.delim",
                    next: "@dstring.x.`"
                }
            ],
            [
                /:(\w|[$@])\w*[!?=]?/,
                "string.s"
            ],
            [
                /:"/,
                {
                    token: "string.s.delim",
                    next: '@dstring.s."'
                }
            ],
            [
                /:'/,
                {
                    token: "string.s.delim",
                    next: "@sstring.s"
                }
            ],
            [
                /\/(?=(\\\/|[^\/\n])+\/)/,
                {
                    token: "regexp.delim",
                    next: "@regexp"
                }
            ],
            [
                /[{}()\[\]]/,
                "@brackets"
            ],
            [
                /@symbols/,
                {
                    cases: {
                        "@keywordops": "keyword",
                        "@operators": "operator",
                        "@default": ""
                    }
                }
            ],
            [
                /[;,]/,
                "delimiter"
            ],
            [
                /0[xX][0-9a-fA-F](_?[0-9a-fA-F])*/,
                "number.hex"
            ],
            [
                /0[_oO][0-7](_?[0-7])*/,
                "number.octal"
            ],
            [
                /0[bB][01](_?[01])*/,
                "number.binary"
            ],
            [
                /0[dD]@decpart/,
                "number"
            ],
            [
                /@decimal((\.@decpart)?([eE][\-+]?@decpart)?)/,
                {
                    cases: {
                        $1: "number.float",
                        "@default": "number"
                    }
                }
            ]
        ],
        dodecl: [
            [
                /^/,
                {
                    token: "",
                    switchTo: "@root.$S2"
                }
            ],
            [
                /[a-z_]\w*[!?=]?/,
                {
                    cases: {
                        end: {
                            token: "keyword.$S2",
                            next: "@pop"
                        },
                        do: {
                            token: "keyword",
                            switchTo: "@root.$S2"
                        },
                        "@linedecls": {
                            token: "@rematch",
                            switchTo: "@root.$S2"
                        },
                        "@keywords": "keyword",
                        "@builtins": "predefined",
                        "@default": "identifier"
                    }
                }
            ],
            {
                include: "@root"
            }
        ],
        modifier: [
            [
                /^/,
                "",
                "@pop"
            ],
            [
                /[a-z_]\w*[!?=]?/,
                {
                    cases: {
                        end: {
                            token: "keyword.$S2",
                            next: "@pop"
                        },
                        "then|else|elsif|do": {
                            token: "keyword",
                            switchTo: "@root.$S2"
                        },
                        "@linedecls": {
                            token: "@rematch",
                            switchTo: "@root.$S2"
                        },
                        "@keywords": "keyword",
                        "@builtins": "predefined",
                        "@default": "identifier"
                    }
                }
            ],
            {
                include: "@root"
            }
        ],
        sstring: [
            [
                /[^\\']+/,
                "string.$S2"
            ],
            [
                /\\\\|\\'|\\$/,
                "string.$S2.escape"
            ],
            [
                /\\./,
                "string.$S2.invalid"
            ],
            [
                /'/,
                {
                    token: "string.$S2.delim",
                    next: "@pop"
                }
            ]
        ],
        dstring: [
            [
                /[^\\`"#]+/,
                "string.$S2"
            ],
            [
                /#/,
                "string.$S2.escape",
                "@interpolated"
            ],
            [
                /\\$/,
                "string.$S2.escape"
            ],
            [
                /@escapes/,
                "string.$S2.escape"
            ],
            [
                /\\./,
                "string.$S2.escape.invalid"
            ],
            [
                /[`"]/,
                {
                    cases: {
                        "$#==$S3": {
                            token: "string.$S2.delim",
                            next: "@pop"
                        },
                        "@default": "string.$S2"
                    }
                }
            ]
        ],
        heredoc: [
            [
                /^(\s*)(@heredelim)$/,
                {
                    cases: {
                        "$2==$S2": [
                            "string.heredoc",
                            {
                                token: "string.heredoc.delimiter",
                                next: "@pop"
                            }
                        ],
                        "@default": [
                            "string.heredoc",
                            "string.heredoc"
                        ]
                    }
                }
            ],
            [
                /.*/,
                "string.heredoc"
            ]
        ],
        interpolated: [
            [
                /\$\w*/,
                "global.constant",
                "@pop"
            ],
            [
                /@\w*/,
                "namespace.class.identifier",
                "@pop"
            ],
            [
                /@@@\w*/,
                "namespace.instance.identifier",
                "@pop"
            ],
            [
                /[{]/,
                {
                    token: "string.escape.curly",
                    switchTo: "@interpolated_compound"
                }
            ],
            [
                "",
                "",
                "@pop"
            ]
        ],
        interpolated_compound: [
            [
                /[}]/,
                {
                    token: "string.escape.curly",
                    next: "@pop"
                }
            ],
            {
                include: "@root"
            }
        ],
        pregexp: [
            {
                include: "@whitespace"
            },
            [
                /[^\(\{\[\\]/,
                {
                    cases: {
                        "$#==$S3": {
                            token: "regexp.delim",
                            next: "@pop"
                        },
                        "$#==$S2": {
                            token: "regexp.delim",
                            next: "@push"
                        },
                        "~[)}\\]]": "@brackets.regexp.escape.control",
                        "~@regexpctl": "regexp.escape.control",
                        "@default": "regexp"
                    }
                }
            ],
            {
                include: "@regexcontrol"
            }
        ],
        regexp: [
            {
                include: "@regexcontrol"
            },
            [
                /[^\\\/]/,
                "regexp"
            ],
            [
                "/[ixmp]*",
                {
                    token: "regexp.delim"
                },
                "@pop"
            ]
        ],
        regexcontrol: [
            [
                /(\{)(\d+(?:,\d*)?)(\})/,
                [
                    "@brackets.regexp.escape.control",
                    "regexp.escape.control",
                    "@brackets.regexp.escape.control"
                ]
            ],
            [
                /(\[)(\^?)/,
                [
                    "@brackets.regexp.escape.control",
                    {
                        token: "regexp.escape.control",
                        next: "@regexrange"
                    }
                ]
            ],
            [
                /(\()(\?[:=!])/,
                [
                    "@brackets.regexp.escape.control",
                    "regexp.escape.control"
                ]
            ],
            [
                /\(\?#/,
                {
                    token: "regexp.escape.control",
                    next: "@regexpcomment"
                }
            ],
            [
                /[()]/,
                "@brackets.regexp.escape.control"
            ],
            [
                /@regexpctl/,
                "regexp.escape.control"
            ],
            [
                /\\$/,
                "regexp.escape"
            ],
            [
                /@regexpesc/,
                "regexp.escape"
            ],
            [
                /\\\./,
                "regexp.invalid"
            ],
            [
                /#/,
                "regexp.escape",
                "@interpolated"
            ]
        ],
        regexrange: [
            [
                /-/,
                "regexp.escape.control"
            ],
            [
                /\^/,
                "regexp.invalid"
            ],
            [
                /\\$/,
                "regexp.escape"
            ],
            [
                /@regexpesc/,
                "regexp.escape"
            ],
            [
                /[^\]]/,
                "regexp"
            ],
            [
                /\]/,
                "@brackets.regexp.escape.control",
                "@pop"
            ]
        ],
        regexpcomment: [
            [
                /[^)]+/,
                "comment"
            ],
            [
                /\)/,
                {
                    token: "regexp.escape.control",
                    next: "@pop"
                }
            ]
        ],
        pstring: [
            [
                /%([qws])\(/,
                {
                    token: "string.$1.delim",
                    switchTo: "@qstring.$1.(.)"
                }
            ],
            [
                /%([qws])\[/,
                {
                    token: "string.$1.delim",
                    switchTo: "@qstring.$1.[.]"
                }
            ],
            [
                /%([qws])\{/,
                {
                    token: "string.$1.delim",
                    switchTo: "@qstring.$1.{.}"
                }
            ],
            [
                /%([qws])</,
                {
                    token: "string.$1.delim",
                    switchTo: "@qstring.$1.<.>"
                }
            ],
            [
                /%([qws])(@delim)/,
                {
                    token: "string.$1.delim",
                    switchTo: "@qstring.$1.$2.$2"
                }
            ],
            [
                /%r\(/,
                {
                    token: "regexp.delim",
                    switchTo: "@pregexp.(.)"
                }
            ],
            [
                /%r\[/,
                {
                    token: "regexp.delim",
                    switchTo: "@pregexp.[.]"
                }
            ],
            [
                /%r\{/,
                {
                    token: "regexp.delim",
                    switchTo: "@pregexp.{.}"
                }
            ],
            [
                /%r</,
                {
                    token: "regexp.delim",
                    switchTo: "@pregexp.<.>"
                }
            ],
            [
                /%r(@delim)/,
                {
                    token: "regexp.delim",
                    switchTo: "@pregexp.$1.$1"
                }
            ],
            [
                /%(x|W|Q?)\(/,
                {
                    token: "string.$1.delim",
                    switchTo: "@qqstring.$1.(.)"
                }
            ],
            [
                /%(x|W|Q?)\[/,
                {
                    token: "string.$1.delim",
                    switchTo: "@qqstring.$1.[.]"
                }
            ],
            [
                /%(x|W|Q?)\{/,
                {
                    token: "string.$1.delim",
                    switchTo: "@qqstring.$1.{.}"
                }
            ],
            [
                /%(x|W|Q?)</,
                {
                    token: "string.$1.delim",
                    switchTo: "@qqstring.$1.<.>"
                }
            ],
            [
                /%(x|W|Q?)(@delim)/,
                {
                    token: "string.$1.delim",
                    switchTo: "@qqstring.$1.$2.$2"
                }
            ],
            [
                /%([rqwsxW]|Q?)./,
                {
                    token: "invalid",
                    next: "@pop"
                }
            ],
            [
                /./,
                {
                    token: "invalid",
                    next: "@pop"
                }
            ]
        ],
        qstring: [
            [
                /\\$/,
                "string.$S2.escape"
            ],
            [
                /\\./,
                "string.$S2.escape"
            ],
            [
                /./,
                {
                    cases: {
                        "$#==$S4": {
                            token: "string.$S2.delim",
                            next: "@pop"
                        },
                        "$#==$S3": {
                            token: "string.$S2.delim",
                            next: "@push"
                        },
                        "@default": "string.$S2"
                    }
                }
            ]
        ],
        qqstring: [
            [
                /#/,
                "string.$S2.escape",
                "@interpolated"
            ],
            {
                include: "@qstring"
            }
        ],
        whitespace: [
            [
                /[ \t\r\n]+/,
                ""
            ],
            [
                /^\s*=begin\b/,
                "comment",
                "@comment"
            ],
            [
                /#.*$/,
                "comment"
            ]
        ],
        comment: [
            [
                /[^=]+/,
                "comment"
            ],
            [
                /^\s*=begin\b/,
                "comment.invalid"
            ],
            [
                /^\s*=end\b.*/,
                "comment",
                "@pop"
            ],
            [
                /[=]/,
                "comment"
            ]
        ]
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}]},["51xjM"], null, "parcelRequire4f3a")

//# sourceMappingURL=ruby.b970af1a.js.map
