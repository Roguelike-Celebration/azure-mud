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
})({"2Uw8i":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "11e46fe92e7ee0c0f0faf753c0c36606"; // @flow
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

},{}],"1AEmk":[function(require,module,exports) {
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
 *-----------------------------------------------------------------------------*/ // src/basic-languages/clojure/clojure.ts
var conf = {
    comments: {
        lineComment: ";;"
    },
    brackets: [
        [
            "[",
            "]"
        ],
        [
            "(",
            ")"
        ],
        [
            "{",
            "}"
        ]
    ],
    autoClosingPairs: [
        {
            open: "[",
            close: "]"
        },
        {
            open: '"',
            close: '"'
        },
        {
            open: "(",
            close: ")"
        },
        {
            open: "{",
            close: "}"
        }
    ],
    surroundingPairs: [
        {
            open: "[",
            close: "]"
        },
        {
            open: '"',
            close: '"'
        },
        {
            open: "(",
            close: ")"
        },
        {
            open: "{",
            close: "}"
        }
    ]
};
var language = {
    defaultToken: "",
    ignoreCase: true,
    tokenPostfix: ".clj",
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
        }
    ],
    constants: [
        "true",
        "false",
        "nil"
    ],
    numbers: /^(?:[+\-]?\d+(?:(?:N|(?:[eE][+\-]?\d+))|(?:\.?\d*(?:M|(?:[eE][+\-]?\d+))?)|\/\d+|[xX][0-9a-fA-F]+|r[0-9a-zA-Z]+)?(?=[\\\[\]\s"#'(),;@^`{}~]|$))/,
    characters: /^(?:\\(?:backspace|formfeed|newline|return|space|tab|o[0-7]{3}|u[0-9A-Fa-f]{4}|x[0-9A-Fa-f]{4}|.)?(?=[\\\[\]\s"(),;@^`{}~]|$))/,
    escapes: /^\\(?:["'\\bfnrt]|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    qualifiedSymbols: /^(?:(?:[^\\\/\[\]\d\s"#'(),;@^`{}~][^\\\[\]\s"(),;@^`{}~]*(?:\.[^\\\/\[\]\d\s"#'(),;@^`{}~][^\\\[\]\s"(),;@^`{}~]*)*\/)?(?:\/|[^\\\/\[\]\d\s"#'(),;@^`{}~][^\\\[\]\s"(),;@^`{}~]*)*(?=[\\\[\]\s"(),;@^`{}~]|$))/,
    specialForms: [
        ".",
        "catch",
        "def",
        "do",
        "if",
        "monitor-enter",
        "monitor-exit",
        "new",
        "quote",
        "recur",
        "set!",
        "throw",
        "try",
        "var"
    ],
    coreSymbols: [
        "*",
        "*'",
        "*1",
        "*2",
        "*3",
        "*agent*",
        "*allow-unresolved-vars*",
        "*assert*",
        "*clojure-version*",
        "*command-line-args*",
        "*compile-files*",
        "*compile-path*",
        "*compiler-options*",
        "*data-readers*",
        "*default-data-reader-fn*",
        "*e",
        "*err*",
        "*file*",
        "*flush-on-newline*",
        "*fn-loader*",
        "*in*",
        "*math-context*",
        "*ns*",
        "*out*",
        "*print-dup*",
        "*print-length*",
        "*print-level*",
        "*print-meta*",
        "*print-namespace-maps*",
        "*print-readably*",
        "*read-eval*",
        "*reader-resolver*",
        "*source-path*",
        "*suppress-read*",
        "*unchecked-math*",
        "*use-context-classloader*",
        "*verbose-defrecords*",
        "*warn-on-reflection*",
        "+",
        "+'",
        "-",
        "-'",
        "->",
        "->>",
        "->ArrayChunk",
        "->Eduction",
        "->Vec",
        "->VecNode",
        "->VecSeq",
        "-cache-protocol-fn",
        "-reset-methods",
        "..",
        "/",
        "<",
        "<=",
        "=",
        "==",
        ">",
        ">=",
        "EMPTY-NODE",
        "Inst",
        "StackTraceElement->vec",
        "Throwable->map",
        "accessor",
        "aclone",
        "add-classpath",
        "add-watch",
        "agent",
        "agent-error",
        "agent-errors",
        "aget",
        "alength",
        "alias",
        "all-ns",
        "alter",
        "alter-meta!",
        "alter-var-root",
        "amap",
        "ancestors",
        "and",
        "any?",
        "apply",
        "areduce",
        "array-map",
        "as->",
        "aset",
        "aset-boolean",
        "aset-byte",
        "aset-char",
        "aset-double",
        "aset-float",
        "aset-int",
        "aset-long",
        "aset-short",
        "assert",
        "assoc",
        "assoc!",
        "assoc-in",
        "associative?",
        "atom",
        "await",
        "await-for",
        "await1",
        "bases",
        "bean",
        "bigdec",
        "bigint",
        "biginteger",
        "binding",
        "bit-and",
        "bit-and-not",
        "bit-clear",
        "bit-flip",
        "bit-not",
        "bit-or",
        "bit-set",
        "bit-shift-left",
        "bit-shift-right",
        "bit-test",
        "bit-xor",
        "boolean",
        "boolean-array",
        "boolean?",
        "booleans",
        "bound-fn",
        "bound-fn*",
        "bound?",
        "bounded-count",
        "butlast",
        "byte",
        "byte-array",
        "bytes",
        "bytes?",
        "case",
        "cast",
        "cat",
        "char",
        "char-array",
        "char-escape-string",
        "char-name-string",
        "char?",
        "chars",
        "chunk",
        "chunk-append",
        "chunk-buffer",
        "chunk-cons",
        "chunk-first",
        "chunk-next",
        "chunk-rest",
        "chunked-seq?",
        "class",
        "class?",
        "clear-agent-errors",
        "clojure-version",
        "coll?",
        "comment",
        "commute",
        "comp",
        "comparator",
        "compare",
        "compare-and-set!",
        "compile",
        "complement",
        "completing",
        "concat",
        "cond",
        "cond->",
        "cond->>",
        "condp",
        "conj",
        "conj!",
        "cons",
        "constantly",
        "construct-proxy",
        "contains?",
        "count",
        "counted?",
        "create-ns",
        "create-struct",
        "cycle",
        "dec",
        "dec'",
        "decimal?",
        "declare",
        "dedupe",
        "default-data-readers",
        "definline",
        "definterface",
        "defmacro",
        "defmethod",
        "defmulti",
        "defn",
        "defn-",
        "defonce",
        "defprotocol",
        "defrecord",
        "defstruct",
        "deftype",
        "delay",
        "delay?",
        "deliver",
        "denominator",
        "deref",
        "derive",
        "descendants",
        "destructure",
        "disj",
        "disj!",
        "dissoc",
        "dissoc!",
        "distinct",
        "distinct?",
        "doall",
        "dorun",
        "doseq",
        "dosync",
        "dotimes",
        "doto",
        "double",
        "double-array",
        "double?",
        "doubles",
        "drop",
        "drop-last",
        "drop-while",
        "eduction",
        "empty",
        "empty?",
        "ensure",
        "ensure-reduced",
        "enumeration-seq",
        "error-handler",
        "error-mode",
        "eval",
        "even?",
        "every-pred",
        "every?",
        "ex-data",
        "ex-info",
        "extend",
        "extend-protocol",
        "extend-type",
        "extenders",
        "extends?",
        "false?",
        "ffirst",
        "file-seq",
        "filter",
        "filterv",
        "find",
        "find-keyword",
        "find-ns",
        "find-protocol-impl",
        "find-protocol-method",
        "find-var",
        "first",
        "flatten",
        "float",
        "float-array",
        "float?",
        "floats",
        "flush",
        "fn",
        "fn?",
        "fnext",
        "fnil",
        "for",
        "force",
        "format",
        "frequencies",
        "future",
        "future-call",
        "future-cancel",
        "future-cancelled?",
        "future-done?",
        "future?",
        "gen-class",
        "gen-interface",
        "gensym",
        "get",
        "get-in",
        "get-method",
        "get-proxy-class",
        "get-thread-bindings",
        "get-validator",
        "group-by",
        "halt-when",
        "hash",
        "hash-combine",
        "hash-map",
        "hash-ordered-coll",
        "hash-set",
        "hash-unordered-coll",
        "ident?",
        "identical?",
        "identity",
        "if-let",
        "if-not",
        "if-some",
        "ifn?",
        "import",
        "in-ns",
        "inc",
        "inc'",
        "indexed?",
        "init-proxy",
        "inst-ms",
        "inst-ms*",
        "inst?",
        "instance?",
        "int",
        "int-array",
        "int?",
        "integer?",
        "interleave",
        "intern",
        "interpose",
        "into",
        "into-array",
        "ints",
        "io!",
        "isa?",
        "iterate",
        "iterator-seq",
        "juxt",
        "keep",
        "keep-indexed",
        "key",
        "keys",
        "keyword",
        "keyword?",
        "last",
        "lazy-cat",
        "lazy-seq",
        "let",
        "letfn",
        "line-seq",
        "list",
        "list*",
        "list?",
        "load",
        "load-file",
        "load-reader",
        "load-string",
        "loaded-libs",
        "locking",
        "long",
        "long-array",
        "longs",
        "loop",
        "macroexpand",
        "macroexpand-1",
        "make-array",
        "make-hierarchy",
        "map",
        "map-entry?",
        "map-indexed",
        "map?",
        "mapcat",
        "mapv",
        "max",
        "max-key",
        "memfn",
        "memoize",
        "merge",
        "merge-with",
        "meta",
        "method-sig",
        "methods",
        "min",
        "min-key",
        "mix-collection-hash",
        "mod",
        "munge",
        "name",
        "namespace",
        "namespace-munge",
        "nat-int?",
        "neg-int?",
        "neg?",
        "newline",
        "next",
        "nfirst",
        "nil?",
        "nnext",
        "not",
        "not-any?",
        "not-empty",
        "not-every?",
        "not=",
        "ns",
        "ns-aliases",
        "ns-imports",
        "ns-interns",
        "ns-map",
        "ns-name",
        "ns-publics",
        "ns-refers",
        "ns-resolve",
        "ns-unalias",
        "ns-unmap",
        "nth",
        "nthnext",
        "nthrest",
        "num",
        "number?",
        "numerator",
        "object-array",
        "odd?",
        "or",
        "parents",
        "partial",
        "partition",
        "partition-all",
        "partition-by",
        "pcalls",
        "peek",
        "persistent!",
        "pmap",
        "pop",
        "pop!",
        "pop-thread-bindings",
        "pos-int?",
        "pos?",
        "pr",
        "pr-str",
        "prefer-method",
        "prefers",
        "primitives-classnames",
        "print",
        "print-ctor",
        "print-dup",
        "print-method",
        "print-simple",
        "print-str",
        "printf",
        "println",
        "println-str",
        "prn",
        "prn-str",
        "promise",
        "proxy",
        "proxy-call-with-super",
        "proxy-mappings",
        "proxy-name",
        "proxy-super",
        "push-thread-bindings",
        "pvalues",
        "qualified-ident?",
        "qualified-keyword?",
        "qualified-symbol?",
        "quot",
        "rand",
        "rand-int",
        "rand-nth",
        "random-sample",
        "range",
        "ratio?",
        "rational?",
        "rationalize",
        "re-find",
        "re-groups",
        "re-matcher",
        "re-matches",
        "re-pattern",
        "re-seq",
        "read",
        "read-line",
        "read-string",
        "reader-conditional",
        "reader-conditional?",
        "realized?",
        "record?",
        "reduce",
        "reduce-kv",
        "reduced",
        "reduced?",
        "reductions",
        "ref",
        "ref-history-count",
        "ref-max-history",
        "ref-min-history",
        "ref-set",
        "refer",
        "refer-clojure",
        "reify",
        "release-pending-sends",
        "rem",
        "remove",
        "remove-all-methods",
        "remove-method",
        "remove-ns",
        "remove-watch",
        "repeat",
        "repeatedly",
        "replace",
        "replicate",
        "require",
        "reset!",
        "reset-meta!",
        "reset-vals!",
        "resolve",
        "rest",
        "restart-agent",
        "resultset-seq",
        "reverse",
        "reversible?",
        "rseq",
        "rsubseq",
        "run!",
        "satisfies?",
        "second",
        "select-keys",
        "send",
        "send-off",
        "send-via",
        "seq",
        "seq?",
        "seqable?",
        "seque",
        "sequence",
        "sequential?",
        "set",
        "set-agent-send-executor!",
        "set-agent-send-off-executor!",
        "set-error-handler!",
        "set-error-mode!",
        "set-validator!",
        "set?",
        "short",
        "short-array",
        "shorts",
        "shuffle",
        "shutdown-agents",
        "simple-ident?",
        "simple-keyword?",
        "simple-symbol?",
        "slurp",
        "some",
        "some->",
        "some->>",
        "some-fn",
        "some?",
        "sort",
        "sort-by",
        "sorted-map",
        "sorted-map-by",
        "sorted-set",
        "sorted-set-by",
        "sorted?",
        "special-symbol?",
        "spit",
        "split-at",
        "split-with",
        "str",
        "string?",
        "struct",
        "struct-map",
        "subs",
        "subseq",
        "subvec",
        "supers",
        "swap!",
        "swap-vals!",
        "symbol",
        "symbol?",
        "sync",
        "tagged-literal",
        "tagged-literal?",
        "take",
        "take-last",
        "take-nth",
        "take-while",
        "test",
        "the-ns",
        "thread-bound?",
        "time",
        "to-array",
        "to-array-2d",
        "trampoline",
        "transduce",
        "transient",
        "tree-seq",
        "true?",
        "type",
        "unchecked-add",
        "unchecked-add-int",
        "unchecked-byte",
        "unchecked-char",
        "unchecked-dec",
        "unchecked-dec-int",
        "unchecked-divide-int",
        "unchecked-double",
        "unchecked-float",
        "unchecked-inc",
        "unchecked-inc-int",
        "unchecked-int",
        "unchecked-long",
        "unchecked-multiply",
        "unchecked-multiply-int",
        "unchecked-negate",
        "unchecked-negate-int",
        "unchecked-remainder-int",
        "unchecked-short",
        "unchecked-subtract",
        "unchecked-subtract-int",
        "underive",
        "unquote",
        "unquote-splicing",
        "unreduced",
        "unsigned-bit-shift-right",
        "update",
        "update-in",
        "update-proxy",
        "uri?",
        "use",
        "uuid?",
        "val",
        "vals",
        "var-get",
        "var-set",
        "var?",
        "vary-meta",
        "vec",
        "vector",
        "vector-of",
        "vector?",
        "volatile!",
        "volatile?",
        "vreset!",
        "vswap!",
        "when",
        "when-first",
        "when-let",
        "when-not",
        "when-some",
        "while",
        "with-bindings",
        "with-bindings*",
        "with-in-str",
        "with-loading-context",
        "with-local-vars",
        "with-meta",
        "with-open",
        "with-out-str",
        "with-precision",
        "with-redefs",
        "with-redefs-fn",
        "xml-seq",
        "zero?",
        "zipmap"
    ],
    tokenizer: {
        root: [
            {
                include: "@whitespace"
            },
            [
                /@numbers/,
                "number"
            ],
            [
                /@characters/,
                "string"
            ],
            {
                include: "@string"
            },
            [
                /[()\[\]{}]/,
                "@brackets"
            ],
            [
                /\/#"(?:\.|(?:")|[^"\n])*"\/g/,
                "regexp"
            ],
            [
                /[#'@^`~]/,
                "meta"
            ],
            [
                /@qualifiedSymbols/,
                {
                    cases: {
                        "^:.+$": "constant",
                        "@specialForms": "keyword",
                        "@coreSymbols": "keyword",
                        "@constants": "constant",
                        "@default": "identifier"
                    }
                }
            ]
        ],
        whitespace: [
            [
                /[\s,]+/,
                "white"
            ],
            [
                /;.*$/,
                "comment"
            ],
            [
                /\(comment\b/,
                "comment",
                "@comment"
            ]
        ],
        comment: [
            [
                /\(/,
                "comment",
                "@push"
            ],
            [
                /\)/,
                "comment",
                "@pop"
            ],
            [
                /[^()]/,
                "comment"
            ]
        ],
        string: [
            [
                /"/,
                "string",
                "@multiLineString"
            ]
        ],
        multiLineString: [
            [
                /"/,
                "string",
                "@popall"
            ],
            [
                /@escapes/,
                "string.escape"
            ],
            [
                /./,
                "string"
            ]
        ]
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}]},["2Uw8i"], null, "parcelRequire4f3a")

//# sourceMappingURL=clojure.c0c36606.js.map
