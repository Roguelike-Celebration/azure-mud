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
})({"2dAJQ":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "e5316ac446fe29af2394dcdd18ff5f68"; // @flow
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

},{}],"4X5bJ":[function(require,module,exports) {
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
 *-----------------------------------------------------------------------------*/ // src/basic-languages/postiats/postiats.ts
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
            "<",
            ">"
        ]
    ],
    autoClosingPairs: [
        {
            open: '"',
            close: '"',
            notIn: [
                "string",
                "comment"
            ]
        },
        {
            open: "{",
            close: "}",
            notIn: [
                "string",
                "comment"
            ]
        },
        {
            open: "[",
            close: "]",
            notIn: [
                "string",
                "comment"
            ]
        },
        {
            open: "(",
            close: ")",
            notIn: [
                "string",
                "comment"
            ]
        }
    ]
};
var language = {
    tokenPostfix: ".pats",
    defaultToken: "invalid",
    keywords: [
        "abstype",
        "abst0ype",
        "absprop",
        "absview",
        "absvtype",
        "absviewtype",
        "absvt0ype",
        "absviewt0ype",
        "as",
        "and",
        "assume",
        "begin",
        "classdec",
        "datasort",
        "datatype",
        "dataprop",
        "dataview",
        "datavtype",
        "dataviewtype",
        "do",
        "end",
        "extern",
        "extype",
        "extvar",
        "exception",
        "fn",
        "fnx",
        "fun",
        "prfn",
        "prfun",
        "praxi",
        "castfn",
        "if",
        "then",
        "else",
        "ifcase",
        "in",
        "infix",
        "infixl",
        "infixr",
        "prefix",
        "postfix",
        "implmnt",
        "implement",
        "primplmnt",
        "primplement",
        "import",
        "let",
        "local",
        "macdef",
        "macrodef",
        "nonfix",
        "symelim",
        "symintr",
        "overload",
        "of",
        "op",
        "rec",
        "sif",
        "scase",
        "sortdef",
        "sta",
        "stacst",
        "stadef",
        "static",
        "staload",
        "dynload",
        "try",
        "tkindef",
        "typedef",
        "propdef",
        "viewdef",
        "vtypedef",
        "viewtypedef",
        "prval",
        "var",
        "prvar",
        "when",
        "where",
        "with",
        "withtype",
        "withprop",
        "withview",
        "withvtype",
        "withviewtype"
    ],
    keywords_dlr: [
        "$delay",
        "$ldelay",
        "$arrpsz",
        "$arrptrsize",
        "$d2ctype",
        "$effmask",
        "$effmask_ntm",
        "$effmask_exn",
        "$effmask_ref",
        "$effmask_wrt",
        "$effmask_all",
        "$extern",
        "$extkind",
        "$extype",
        "$extype_struct",
        "$extval",
        "$extfcall",
        "$extmcall",
        "$literal",
        "$myfilename",
        "$mylocation",
        "$myfunction",
        "$lst",
        "$lst_t",
        "$lst_vt",
        "$list",
        "$list_t",
        "$list_vt",
        "$rec",
        "$rec_t",
        "$rec_vt",
        "$record",
        "$record_t",
        "$record_vt",
        "$tup",
        "$tup_t",
        "$tup_vt",
        "$tuple",
        "$tuple_t",
        "$tuple_vt",
        "$break",
        "$continue",
        "$raise",
        "$showtype",
        "$vcopyenv_v",
        "$vcopyenv_vt",
        "$tempenver",
        "$solver_assert",
        "$solver_verify"
    ],
    keywords_srp: [
        "#if",
        "#ifdef",
        "#ifndef",
        "#then",
        "#elif",
        "#elifdef",
        "#elifndef",
        "#else",
        "#endif",
        "#error",
        "#prerr",
        "#print",
        "#assert",
        "#undef",
        "#define",
        "#include",
        "#require",
        "#pragma",
        "#codegen2",
        "#codegen3"
    ],
    irregular_keyword_list: [
        "val+",
        "val-",
        "val",
        "case+",
        "case-",
        "case",
        "addr@",
        "addr",
        "fold@",
        "free@",
        "fix@",
        "fix",
        "lam@",
        "lam",
        "llam@",
        "llam",
        "viewt@ype+",
        "viewt@ype-",
        "viewt@ype",
        "viewtype+",
        "viewtype-",
        "viewtype",
        "view+",
        "view-",
        "view@",
        "view",
        "type+",
        "type-",
        "type",
        "vtype+",
        "vtype-",
        "vtype",
        "vt@ype+",
        "vt@ype-",
        "vt@ype",
        "viewt@ype+",
        "viewt@ype-",
        "viewt@ype",
        "viewtype+",
        "viewtype-",
        "viewtype",
        "prop+",
        "prop-",
        "prop",
        "type+",
        "type-",
        "type",
        "t@ype",
        "t@ype+",
        "t@ype-",
        "abst@ype",
        "abstype",
        "absviewt@ype",
        "absvt@ype",
        "for*",
        "for",
        "while*",
        "while"
    ],
    keywords_types: [
        "bool",
        "double",
        "byte",
        "int",
        "short",
        "char",
        "void",
        "unit",
        "long",
        "float",
        "string",
        "strptr"
    ],
    keywords_effects: [
        "0",
        "fun",
        "clo",
        "prf",
        "funclo",
        "cloptr",
        "cloref",
        "ref",
        "ntm",
        "1"
    ],
    operators: [
        "@",
        "!",
        "|",
        "`",
        ":",
        "$",
        ".",
        "=",
        "#",
        "~",
        "..",
        "...",
        "=>",
        "=<>",
        "=/=>",
        "=>>",
        "=/=>>",
        "<",
        ">",
        "><",
        ".<",
        ">.",
        ".<>.",
        "->",
        "-<>"
    ],
    brackets: [
        {
            open: ",(",
            close: ")",
            token: "delimiter.parenthesis"
        },
        {
            open: "`(",
            close: ")",
            token: "delimiter.parenthesis"
        },
        {
            open: "%(",
            close: ")",
            token: "delimiter.parenthesis"
        },
        {
            open: "'(",
            close: ")",
            token: "delimiter.parenthesis"
        },
        {
            open: "'{",
            close: "}",
            token: "delimiter.parenthesis"
        },
        {
            open: "@(",
            close: ")",
            token: "delimiter.parenthesis"
        },
        {
            open: "@{",
            close: "}",
            token: "delimiter.brace"
        },
        {
            open: "@[",
            close: "]",
            token: "delimiter.square"
        },
        {
            open: "#[",
            close: "]",
            token: "delimiter.square"
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
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    IDENTFST: /[a-zA-Z_]/,
    IDENTRST: /[a-zA-Z0-9_'$]/,
    symbolic: /[%&+-./:=@~`^|*!$#?<>]/,
    digit: /[0-9]/,
    digitseq0: /@digit*/,
    xdigit: /[0-9A-Za-z]/,
    xdigitseq0: /@xdigit*/,
    INTSP: /[lLuU]/,
    FLOATSP: /[fFlL]/,
    fexponent: /[eE][+-]?[0-9]+/,
    fexponent_bin: /[pP][+-]?[0-9]+/,
    deciexp: /\.[0-9]*@fexponent?/,
    hexiexp: /\.[0-9a-zA-Z]*@fexponent_bin?/,
    irregular_keywords: /val[+-]?|case[+-]?|addr\@?|fold\@|free\@|fix\@?|lam\@?|llam\@?|prop[+-]?|type[+-]?|view[+-@]?|viewt@?ype[+-]?|t@?ype[+-]?|v(iew)?t@?ype[+-]?|abst@?ype|absv(iew)?t@?ype|for\*?|while\*?/,
    ESCHAR: /[ntvbrfa\\\?'"\(\[\{]/,
    start: "root",
    tokenizer: {
        root: [
            {
                regex: /[ \t\r\n]+/,
                action: {
                    token: ""
                }
            },
            {
                regex: /\(\*\)/,
                action: {
                    token: "invalid"
                }
            },
            {
                regex: /\(\*/,
                action: {
                    token: "comment",
                    next: "lexing_COMMENT_block_ml"
                }
            },
            {
                regex: /\(/,
                action: "@brackets"
            },
            {
                regex: /\)/,
                action: "@brackets"
            },
            {
                regex: /\[/,
                action: "@brackets"
            },
            {
                regex: /\]/,
                action: "@brackets"
            },
            {
                regex: /\{/,
                action: "@brackets"
            },
            {
                regex: /\}/,
                action: "@brackets"
            },
            {
                regex: /,\(/,
                action: "@brackets"
            },
            {
                regex: /,/,
                action: {
                    token: "delimiter.comma"
                }
            },
            {
                regex: /;/,
                action: {
                    token: "delimiter.semicolon"
                }
            },
            {
                regex: /@\(/,
                action: "@brackets"
            },
            {
                regex: /@\[/,
                action: "@brackets"
            },
            {
                regex: /@\{/,
                action: "@brackets"
            },
            {
                regex: /:</,
                action: {
                    token: "keyword",
                    next: "@lexing_EFFECT_commaseq0"
                }
            },
            {
                regex: /\.@symbolic+/,
                action: {
                    token: "identifier.sym"
                }
            },
            {
                regex: /\.@digit*@fexponent@FLOATSP*/,
                action: {
                    token: "number.float"
                }
            },
            {
                regex: /\.@digit+/,
                action: {
                    token: "number.float"
                }
            },
            {
                regex: /\$@IDENTFST@IDENTRST*/,
                action: {
                    cases: {
                        "@keywords_dlr": {
                            token: "keyword.dlr"
                        },
                        "@default": {
                            token: "namespace"
                        }
                    }
                }
            },
            {
                regex: /\#@IDENTFST@IDENTRST*/,
                action: {
                    cases: {
                        "@keywords_srp": {
                            token: "keyword.srp"
                        },
                        "@default": {
                            token: "identifier"
                        }
                    }
                }
            },
            {
                regex: /%\(/,
                action: {
                    token: "delimiter.parenthesis"
                }
            },
            {
                regex: /^%{(#|\^|\$)?/,
                action: {
                    token: "keyword",
                    next: "@lexing_EXTCODE",
                    nextEmbedded: "text/javascript"
                }
            },
            {
                regex: /^%}/,
                action: {
                    token: "keyword"
                }
            },
            {
                regex: /'\(/,
                action: {
                    token: "delimiter.parenthesis"
                }
            },
            {
                regex: /'\[/,
                action: {
                    token: "delimiter.bracket"
                }
            },
            {
                regex: /'\{/,
                action: {
                    token: "delimiter.brace"
                }
            },
            [
                /(')(\\@ESCHAR|\\[xX]@xdigit+|\\@digit+)(')/,
                [
                    "string",
                    "string.escape",
                    "string"
                ]
            ],
            [
                /'[^\\']'/,
                "string"
            ],
            [
                /"/,
                "string.quote",
                "@lexing_DQUOTE"
            ],
            {
                regex: /`\(/,
                action: "@brackets"
            },
            {
                regex: /\\/,
                action: {
                    token: "punctuation"
                }
            },
            {
                regex: /@irregular_keywords(?!@IDENTRST)/,
                action: {
                    token: "keyword"
                }
            },
            {
                regex: /@IDENTFST@IDENTRST*[<!\[]?/,
                action: {
                    cases: {
                        "@keywords": {
                            token: "keyword"
                        },
                        "@keywords_types": {
                            token: "type"
                        },
                        "@default": {
                            token: "identifier"
                        }
                    }
                }
            },
            {
                regex: /\/\/\/\//,
                action: {
                    token: "comment",
                    next: "@lexing_COMMENT_rest"
                }
            },
            {
                regex: /\/\/.*$/,
                action: {
                    token: "comment"
                }
            },
            {
                regex: /\/\*/,
                action: {
                    token: "comment",
                    next: "@lexing_COMMENT_block_c"
                }
            },
            {
                regex: /-<|=</,
                action: {
                    token: "keyword",
                    next: "@lexing_EFFECT_commaseq0"
                }
            },
            {
                regex: /@symbolic+/,
                action: {
                    cases: {
                        "@operators": "keyword",
                        "@default": "operator"
                    }
                }
            },
            {
                regex: /0[xX]@xdigit+(@hexiexp|@fexponent_bin)@FLOATSP*/,
                action: {
                    token: "number.float"
                }
            },
            {
                regex: /0[xX]@xdigit+@INTSP*/,
                action: {
                    token: "number.hex"
                }
            },
            {
                regex: /0[0-7]+(?![0-9])@INTSP*/,
                action: {
                    token: "number.octal"
                }
            },
            {
                regex: /@digit+(@fexponent|@deciexp)@FLOATSP*/,
                action: {
                    token: "number.float"
                }
            },
            {
                regex: /@digit@digitseq0@INTSP*/,
                action: {
                    token: "number.decimal"
                }
            },
            {
                regex: /@digit+@INTSP*/,
                action: {
                    token: "number"
                }
            }
        ],
        lexing_COMMENT_block_ml: [
            [
                /[^\(\*]+/,
                "comment"
            ],
            [
                /\(\*/,
                "comment",
                "@push"
            ],
            [
                /\(\*/,
                "comment.invalid"
            ],
            [
                /\*\)/,
                "comment",
                "@pop"
            ],
            [
                /\*/,
                "comment"
            ]
        ],
        lexing_COMMENT_block_c: [
            [
                /[^\/*]+/,
                "comment"
            ],
            [
                /\*\//,
                "comment",
                "@pop"
            ],
            [
                /[\/*]/,
                "comment"
            ]
        ],
        lexing_COMMENT_rest: [
            [
                /$/,
                "comment",
                "@pop"
            ],
            [
                /.*/,
                "comment"
            ]
        ],
        lexing_EFFECT_commaseq0: [
            {
                regex: /@IDENTFST@IDENTRST+|@digit+/,
                action: {
                    cases: {
                        "@keywords_effects": {
                            token: "type.effect"
                        },
                        "@default": {
                            token: "identifier"
                        }
                    }
                }
            },
            {
                regex: /,/,
                action: {
                    token: "punctuation"
                }
            },
            {
                regex: />/,
                action: {
                    token: "@rematch",
                    next: "@pop"
                }
            }
        ],
        lexing_EXTCODE: [
            {
                regex: /^%}/,
                action: {
                    token: "@rematch",
                    next: "@pop",
                    nextEmbedded: "@pop"
                }
            },
            {
                regex: /[^%]+/,
                action: ""
            }
        ],
        lexing_DQUOTE: [
            {
                regex: /"/,
                action: {
                    token: "string.quote",
                    next: "@pop"
                }
            },
            {
                regex: /(\{\$)(@IDENTFST@IDENTRST*)(\})/,
                action: [
                    {
                        token: "string.escape"
                    },
                    {
                        token: "identifier"
                    },
                    {
                        token: "string.escape"
                    }
                ]
            },
            {
                regex: /\\$/,
                action: {
                    token: "string.escape"
                }
            },
            {
                regex: /\\(@ESCHAR|[xX]@xdigit+|@digit+)/,
                action: {
                    token: "string.escape"
                }
            },
            {
                regex: /[^\\"]+/,
                action: {
                    token: "string"
                }
            }
        ]
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}]},["2dAJQ"], null, "parcelRequire4f3a")

//# sourceMappingURL=postiats.18ff5f68.js.map
