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
})({"4BvEg":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "d74beda10b3157b17853f61728986d70"; // @flow
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

},{}],"2C9SP":[function(require,module,exports) {
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
 *-----------------------------------------------------------------------------*/ // src/basic-languages/abap/abap.ts
var conf = {
    comments: {
        lineComment: "*"
    },
    brackets: [
        [
            "[",
            "]"
        ],
        [
            "(",
            ")"
        ]
    ]
};
var language = {
    defaultToken: "invalid",
    ignoreCase: true,
    tokenPostfix: ".abap",
    keywords: [
        "abap-source",
        "abbreviated",
        "abstract",
        "accept",
        "accepting",
        "according",
        "activation",
        "actual",
        "add",
        "add-corresponding",
        "adjacent",
        "after",
        "alias",
        "aliases",
        "align",
        "all",
        "allocate",
        "alpha",
        "analysis",
        "analyzer",
        "and",
        "append",
        "appendage",
        "appending",
        "application",
        "archive",
        "area",
        "arithmetic",
        "as",
        "ascending",
        "aspect",
        "assert",
        "assign",
        "assigned",
        "assigning",
        "association",
        "asynchronous",
        "at",
        "attributes",
        "authority",
        "authority-check",
        "avg",
        "back",
        "background",
        "backup",
        "backward",
        "badi",
        "base",
        "before",
        "begin",
        "between",
        "big",
        "binary",
        "bintohex",
        "bit",
        "black",
        "blank",
        "blanks",
        "blob",
        "block",
        "blocks",
        "blue",
        "bound",
        "boundaries",
        "bounds",
        "boxed",
        "break-point",
        "buffer",
        "by",
        "bypassing",
        "byte",
        "byte-order",
        "call",
        "calling",
        "case",
        "cast",
        "casting",
        "catch",
        "center",
        "centered",
        "chain",
        "chain-input",
        "chain-request",
        "change",
        "changing",
        "channels",
        "character",
        "char-to-hex",
        "check",
        "checkbox",
        "ci_",
        "circular",
        "class",
        "class-coding",
        "class-data",
        "class-events",
        "class-methods",
        "class-pool",
        "cleanup",
        "clear",
        "client",
        "clob",
        "clock",
        "close",
        "coalesce",
        "code",
        "coding",
        "col_background",
        "col_group",
        "col_heading",
        "col_key",
        "col_negative",
        "col_normal",
        "col_positive",
        "col_total",
        "collect",
        "color",
        "column",
        "columns",
        "comment",
        "comments",
        "commit",
        "common",
        "communication",
        "comparing",
        "component",
        "components",
        "compression",
        "compute",
        "concat",
        "concat_with_space",
        "concatenate",
        "cond",
        "condense",
        "condition",
        "connect",
        "connection",
        "constants",
        "context",
        "contexts",
        "continue",
        "control",
        "controls",
        "conv",
        "conversion",
        "convert",
        "copies",
        "copy",
        "corresponding",
        "country",
        "cover",
        "cpi",
        "create",
        "creating",
        "critical",
        "currency",
        "currency_conversion",
        "current",
        "cursor",
        "cursor-selection",
        "customer",
        "customer-function",
        "dangerous",
        "data",
        "database",
        "datainfo",
        "dataset",
        "date",
        "dats_add_days",
        "dats_add_months",
        "dats_days_between",
        "dats_is_valid",
        "daylight",
        "dd/mm/yy",
        "dd/mm/yyyy",
        "ddmmyy",
        "deallocate",
        "decimal_shift",
        "decimals",
        "declarations",
        "deep",
        "default",
        "deferred",
        "define",
        "defining",
        "definition",
        "delete",
        "deleting",
        "demand",
        "department",
        "descending",
        "describe",
        "destination",
        "detail",
        "dialog",
        "directory",
        "disconnect",
        "display",
        "display-mode",
        "distinct",
        "divide",
        "divide-corresponding",
        "division",
        "do",
        "dummy",
        "duplicate",
        "duplicates",
        "duration",
        "during",
        "dynamic",
        "dynpro",
        "edit",
        "editor-call",
        "else",
        "elseif",
        "empty",
        "enabled",
        "enabling",
        "encoding",
        "end",
        "endat",
        "endcase",
        "endcatch",
        "endchain",
        "endclass",
        "enddo",
        "endenhancement",
        "end-enhancement-section",
        "endexec",
        "endform",
        "endfunction",
        "endian",
        "endif",
        "ending",
        "endinterface",
        "end-lines",
        "endloop",
        "endmethod",
        "endmodule",
        "end-of-definition",
        "end-of-editing",
        "end-of-file",
        "end-of-page",
        "end-of-selection",
        "endon",
        "endprovide",
        "endselect",
        "end-test-injection",
        "end-test-seam",
        "endtry",
        "endwhile",
        "endwith",
        "engineering",
        "enhancement",
        "enhancement-point",
        "enhancements",
        "enhancement-section",
        "entries",
        "entry",
        "enum",
        "environment",
        "equiv",
        "errormessage",
        "errors",
        "escaping",
        "event",
        "events",
        "exact",
        "except",
        "exception",
        "exceptions",
        "exception-table",
        "exclude",
        "excluding",
        "exec",
        "execute",
        "exists",
        "exit",
        "exit-command",
        "expand",
        "expanding",
        "expiration",
        "explicit",
        "exponent",
        "export",
        "exporting",
        "extend",
        "extended",
        "extension",
        "extract",
        "fail",
        "fetch",
        "field",
        "field-groups",
        "fields",
        "field-symbol",
        "field-symbols",
        "file",
        "filter",
        "filters",
        "filter-table",
        "final",
        "find",
        "first",
        "first-line",
        "fixed-point",
        "fkeq",
        "fkge",
        "flush",
        "font",
        "for",
        "form",
        "format",
        "forward",
        "found",
        "frame",
        "frames",
        "free",
        "friends",
        "from",
        "function",
        "functionality",
        "function-pool",
        "further",
        "gaps",
        "generate",
        "get",
        "giving",
        "gkeq",
        "gkge",
        "global",
        "grant",
        "green",
        "group",
        "groups",
        "handle",
        "handler",
        "harmless",
        "hashed",
        "having",
        "hdb",
        "header",
        "headers",
        "heading",
        "head-lines",
        "help-id",
        "help-request",
        "hextobin",
        "hide",
        "high",
        "hint",
        "hold",
        "hotspot",
        "icon",
        "id",
        "identification",
        "identifier",
        "ids",
        "if",
        "ignore",
        "ignoring",
        "immediately",
        "implementation",
        "implementations",
        "implemented",
        "implicit",
        "import",
        "importing",
        "in",
        "inactive",
        "incl",
        "include",
        "includes",
        "including",
        "increment",
        "index",
        "index-line",
        "infotypes",
        "inheriting",
        "init",
        "initial",
        "initialization",
        "inner",
        "inout",
        "input",
        "insert",
        "instance",
        "instances",
        "instr",
        "intensified",
        "interface",
        "interface-pool",
        "interfaces",
        "internal",
        "intervals",
        "into",
        "inverse",
        "inverted-date",
        "is",
        "iso",
        "job",
        "join",
        "keep",
        "keeping",
        "kernel",
        "key",
        "keys",
        "keywords",
        "kind",
        "language",
        "last",
        "late",
        "layout",
        "leading",
        "leave",
        "left",
        "left-justified",
        "leftplus",
        "leftspace",
        "legacy",
        "length",
        "let",
        "level",
        "levels",
        "like",
        "line",
        "lines",
        "line-count",
        "linefeed",
        "line-selection",
        "line-size",
        "list",
        "listbox",
        "list-processing",
        "little",
        "llang",
        "load",
        "load-of-program",
        "lob",
        "local",
        "locale",
        "locator",
        "logfile",
        "logical",
        "log-point",
        "long",
        "loop",
        "low",
        "lower",
        "lpad",
        "lpi",
        "ltrim",
        "mail",
        "main",
        "major-id",
        "mapping",
        "margin",
        "mark",
        "mask",
        "match",
        "matchcode",
        "max",
        "maximum",
        "medium",
        "members",
        "memory",
        "mesh",
        "message",
        "message-id",
        "messages",
        "messaging",
        "method",
        "methods",
        "min",
        "minimum",
        "minor-id",
        "mm/dd/yy",
        "mm/dd/yyyy",
        "mmddyy",
        "mode",
        "modif",
        "modifier",
        "modify",
        "module",
        "move",
        "move-corresponding",
        "multiply",
        "multiply-corresponding",
        "name",
        "nametab",
        "native",
        "nested",
        "nesting",
        "new",
        "new-line",
        "new-page",
        "new-section",
        "next",
        "no",
        "no-display",
        "no-extension",
        "no-gap",
        "no-gaps",
        "no-grouping",
        "no-heading",
        "no-scrolling",
        "no-sign",
        "no-title",
        "no-topofpage",
        "no-zero",
        "node",
        "nodes",
        "non-unicode",
        "non-unique",
        "not",
        "null",
        "number",
        "object",
        "objects",
        "obligatory",
        "occurrence",
        "occurrences",
        "occurs",
        "of",
        "off",
        "offset",
        "ole",
        "on",
        "only",
        "open",
        "option",
        "optional",
        "options",
        "or",
        "order",
        "other",
        "others",
        "out",
        "outer",
        "output",
        "output-length",
        "overflow",
        "overlay",
        "pack",
        "package",
        "pad",
        "padding",
        "page",
        "pages",
        "parameter",
        "parameters",
        "parameter-table",
        "part",
        "partially",
        "pattern",
        "percentage",
        "perform",
        "performing",
        "person",
        "pf1",
        "pf10",
        "pf11",
        "pf12",
        "pf13",
        "pf14",
        "pf15",
        "pf2",
        "pf3",
        "pf4",
        "pf5",
        "pf6",
        "pf7",
        "pf8",
        "pf9",
        "pf-status",
        "pink",
        "places",
        "pool",
        "pos_high",
        "pos_low",
        "position",
        "pragmas",
        "precompiled",
        "preferred",
        "preserving",
        "primary",
        "print",
        "print-control",
        "priority",
        "private",
        "procedure",
        "process",
        "program",
        "property",
        "protected",
        "provide",
        "public",
        "push",
        "pushbutton",
        "put",
        "queue-only",
        "quickinfo",
        "radiobutton",
        "raise",
        "raising",
        "range",
        "ranges",
        "read",
        "reader",
        "read-only",
        "receive",
        "received",
        "receiver",
        "receiving",
        "red",
        "redefinition",
        "reduce",
        "reduced",
        "ref",
        "reference",
        "refresh",
        "regex",
        "reject",
        "remote",
        "renaming",
        "replace",
        "replacement",
        "replacing",
        "report",
        "request",
        "requested",
        "reserve",
        "reset",
        "resolution",
        "respecting",
        "responsible",
        "result",
        "results",
        "resumable",
        "resume",
        "retry",
        "return",
        "returncode",
        "returning",
        "returns",
        "right",
        "right-justified",
        "rightplus",
        "rightspace",
        "risk",
        "rmc_communication_failure",
        "rmc_invalid_status",
        "rmc_system_failure",
        "role",
        "rollback",
        "rows",
        "rpad",
        "rtrim",
        "run",
        "sap",
        "sap-spool",
        "saving",
        "scale_preserving",
        "scale_preserving_scientific",
        "scan",
        "scientific",
        "scientific_with_leading_zero",
        "scroll",
        "scroll-boundary",
        "scrolling",
        "search",
        "secondary",
        "seconds",
        "section",
        "select",
        "selection",
        "selections",
        "selection-screen",
        "selection-set",
        "selection-sets",
        "selection-table",
        "select-options",
        "send",
        "separate",
        "separated",
        "set",
        "shared",
        "shift",
        "short",
        "shortdump-id",
        "sign_as_postfix",
        "single",
        "size",
        "skip",
        "skipping",
        "smart",
        "some",
        "sort",
        "sortable",
        "sorted",
        "source",
        "specified",
        "split",
        "spool",
        "spots",
        "sql",
        "sqlscript",
        "stable",
        "stamp",
        "standard",
        "starting",
        "start-of-editing",
        "start-of-selection",
        "state",
        "statement",
        "statements",
        "static",
        "statics",
        "statusinfo",
        "step-loop",
        "stop",
        "structure",
        "structures",
        "style",
        "subkey",
        "submatches",
        "submit",
        "subroutine",
        "subscreen",
        "subtract",
        "subtract-corresponding",
        "suffix",
        "sum",
        "summary",
        "summing",
        "supplied",
        "supply",
        "suppress",
        "switch",
        "switchstates",
        "symbol",
        "syncpoints",
        "syntax",
        "syntax-check",
        "syntax-trace",
        "system-call",
        "system-exceptions",
        "system-exit",
        "tab",
        "tabbed",
        "table",
        "tables",
        "tableview",
        "tabstrip",
        "target",
        "task",
        "tasks",
        "test",
        "testing",
        "test-injection",
        "test-seam",
        "text",
        "textpool",
        "then",
        "throw",
        "time",
        "times",
        "timestamp",
        "timezone",
        "tims_is_valid",
        "title",
        "titlebar",
        "title-lines",
        "to",
        "tokenization",
        "tokens",
        "top-lines",
        "top-of-page",
        "trace-file",
        "trace-table",
        "trailing",
        "transaction",
        "transfer",
        "transformation",
        "translate",
        "transporting",
        "trmac",
        "truncate",
        "truncation",
        "try",
        "tstmp_add_seconds",
        "tstmp_current_utctimestamp",
        "tstmp_is_valid",
        "tstmp_seconds_between",
        "type",
        "type-pool",
        "type-pools",
        "types",
        "uline",
        "unassign",
        "under",
        "unicode",
        "union",
        "unique",
        "unit_conversion",
        "unix",
        "unpack",
        "until",
        "unwind",
        "up",
        "update",
        "upper",
        "user",
        "user-command",
        "using",
        "utf-8",
        "valid",
        "value",
        "value-request",
        "values",
        "vary",
        "varying",
        "verification-message",
        "version",
        "via",
        "view",
        "visible",
        "wait",
        "warning",
        "when",
        "whenever",
        "where",
        "while",
        "width",
        "window",
        "windows",
        "with",
        "with-heading",
        "without",
        "with-title",
        "word",
        "work",
        "write",
        "writer",
        "xml",
        "xsd",
        "yellow",
        "yes",
        "yymmdd",
        "zero",
        "zone",
        "abap_system_timezone",
        "abap_user_timezone",
        "access",
        "action",
        "adabas",
        "adjust_numbers",
        "allow_precision_loss",
        "allowed",
        "amdp",
        "applicationuser",
        "as_geo_json",
        "as400",
        "associations",
        "balance",
        "behavior",
        "breakup",
        "bulk",
        "cds",
        "cds_client",
        "check_before_save",
        "child",
        "clients",
        "corr",
        "corr_spearman",
        "cross",
        "cycles",
        "datn_add_days",
        "datn_add_months",
        "datn_days_between",
        "dats_from_datn",
        "dats_tims_to_tstmp",
        "dats_to_datn",
        "db2",
        "db6",
        "ddl",
        "dense_rank",
        "depth",
        "deterministic",
        "discarding",
        "entities",
        "entity",
        "error",
        "failed",
        "finalize",
        "first_value",
        "fltp_to_dec",
        "following",
        "fractional",
        "full",
        "graph",
        "grouping",
        "hierarchy",
        "hierarchy_ancestors",
        "hierarchy_ancestors_aggregate",
        "hierarchy_descendants",
        "hierarchy_descendants_aggregate",
        "hierarchy_siblings",
        "incremental",
        "indicators",
        "lag",
        "last_value",
        "lead",
        "leaves",
        "like_regexpr",
        "link",
        "locale_sap",
        "lock",
        "locks",
        "many",
        "mapped",
        "matched",
        "measures",
        "median",
        "mssqlnt",
        "multiple",
        "nodetype",
        "ntile",
        "nulls",
        "occurrences_regexpr",
        "one",
        "operations",
        "oracle",
        "orphans",
        "over",
        "parent",
        "parents",
        "partition",
        "pcre",
        "period",
        "pfcg_mapping",
        "preceding",
        "privileged",
        "product",
        "projection",
        "rank",
        "redirected",
        "replace_regexpr",
        "reported",
        "response",
        "responses",
        "root",
        "row",
        "row_number",
        "sap_system_date",
        "save",
        "schema",
        "session",
        "sets",
        "shortdump",
        "siblings",
        "spantree",
        "start",
        "stddev",
        "string_agg",
        "subtotal",
        "sybase",
        "tims_from_timn",
        "tims_to_timn",
        "to_blob",
        "to_clob",
        "total",
        "trace-entry",
        "tstmp_to_dats",
        "tstmp_to_dst",
        "tstmp_to_tims",
        "tstmpl_from_utcl",
        "tstmpl_to_utcl",
        "unbounded",
        "utcl_add_seconds",
        "utcl_current",
        "utcl_seconds_between",
        "uuid",
        "var",
        "verbatim"
    ],
    builtinFunctions: [
        "abs",
        "acos",
        "asin",
        "atan",
        "bit-set",
        "boolc",
        "boolx",
        "ceil",
        "char_off",
        "charlen",
        "cmax",
        "cmin",
        "concat_lines_of",
        "contains",
        "contains_any_not_of",
        "contains_any_of",
        "cos",
        "cosh",
        "count",
        "count_any_not_of",
        "count_any_of",
        "dbmaxlen",
        "distance",
        "escape",
        "exp",
        "find_any_not_of",
        "find_any_of",
        "find_end",
        "floor",
        "frac",
        "from_mixed",
        "ipow",
        "line_exists",
        "line_index",
        "log",
        "log10",
        "matches",
        "nmax",
        "nmin",
        "numofchar",
        "repeat",
        "rescale",
        "reverse",
        "round",
        "segment",
        "shift_left",
        "shift_right",
        "sign",
        "sin",
        "sinh",
        "sqrt",
        "strlen",
        "substring",
        "substring_after",
        "substring_before",
        "substring_from",
        "substring_to",
        "tan",
        "tanh",
        "to_lower",
        "to_mixed",
        "to_upper",
        "trunc",
        "utclong_add",
        "utclong_current",
        "utclong_diff",
        "xsdbool",
        "xstrlen"
    ],
    typeKeywords: [
        "b",
        "c",
        "d",
        "decfloat16",
        "decfloat34",
        "f",
        "i",
        "int8",
        "n",
        "p",
        "s",
        "string",
        "t",
        "utclong",
        "x",
        "xstring",
        "any",
        "clike",
        "csequence",
        "decfloat",
        "numeric",
        "simple",
        "xsequence",
        "accp",
        "char",
        "clnt",
        "cuky",
        "curr",
        "datn",
        "dats",
        "d16d",
        "d16n",
        "d16r",
        "d34d",
        "d34n",
        "d34r",
        "dec",
        "df16_dec",
        "df16_raw",
        "df34_dec",
        "df34_raw",
        "fltp",
        "geom_ewkb",
        "int1",
        "int2",
        "int4",
        "lang",
        "lchr",
        "lraw",
        "numc",
        "quan",
        "raw",
        "rawstring",
        "sstring",
        "timn",
        "tims",
        "unit",
        "utcl",
        "df16_scl",
        "df34_scl",
        "prec",
        "varc",
        "abap_bool",
        "abap_false",
        "abap_true",
        "abap_undefined",
        "me",
        "screen",
        "space",
        "super",
        "sy",
        "syst",
        "table_line",
        "*sys*"
    ],
    builtinMethods: [
        "class_constructor",
        "constructor"
    ],
    derivedTypes: [
        "%CID",
        "%CID_REF",
        "%CONTROL",
        "%DATA",
        "%ELEMENT",
        "%FAIL",
        "%KEY",
        "%MSG",
        "%PARAM",
        "%PID",
        "%PID_ASSOC",
        "%PID_PARENT",
        "%_HINTS"
    ],
    cdsLanguage: [
        "@AbapAnnotation",
        "@AbapCatalog",
        "@AccessControl",
        "@API",
        "@ClientDependent",
        "@ClientHandling",
        "@CompatibilityContract",
        "@DataAging",
        "@EndUserText",
        "@Environment",
        "@LanguageDependency",
        "@MappingRole",
        "@Metadata",
        "@MetadataExtension",
        "@ObjectModel",
        "@Scope",
        "@Semantics",
        "$EXTENSION",
        "$SELF"
    ],
    selectors: [
        "->",
        "->*",
        "=>",
        "~",
        "~*"
    ],
    operators: [
        " +",
        " -",
        "/",
        "*",
        "**",
        "div",
        "mod",
        "=",
        "#",
        "@",
        "+=",
        "-=",
        "*=",
        "/=",
        "**=",
        "&&=",
        "?=",
        "&",
        "&&",
        "bit-and",
        "bit-not",
        "bit-or",
        "bit-xor",
        "m",
        "o",
        "z",
        "<",
        " >",
        "<=",
        ">=",
        "<>",
        "><",
        "=<",
        "=>",
        "bt",
        "byte-ca",
        "byte-cn",
        "byte-co",
        "byte-cs",
        "byte-na",
        "byte-ns",
        "ca",
        "cn",
        "co",
        "cp",
        "cs",
        "eq",
        "ge",
        "gt",
        "le",
        "lt",
        "na",
        "nb",
        "ne",
        "np",
        "ns",
        "*/",
        "*:",
        "--",
        "/*",
        "//"
    ],
    symbols: /[=><!~?&+\-*\/\^%#@]+/,
    tokenizer: {
        root: [
            [
                /[a-z_\/$%@]([\w\/$%]|-(?!>))*/,
                {
                    cases: {
                        "@typeKeywords": "type",
                        "@keywords": "keyword",
                        "@cdsLanguage": "annotation",
                        "@derivedTypes": "type",
                        "@builtinFunctions": "type",
                        "@builtinMethods": "type",
                        "@operators": "key",
                        "@default": "identifier"
                    }
                }
            ],
            [
                /<[\w]+>/,
                "identifier"
            ],
            [
                /##[\w|_]+/,
                "comment"
            ],
            {
                include: "@whitespace"
            },
            [
                /[:,.]/,
                "delimiter"
            ],
            [
                /[{}()\[\]]/,
                "@brackets"
            ],
            [
                /@symbols/,
                {
                    cases: {
                        "@selectors": "tag",
                        "@operators": "key",
                        "@default": ""
                    }
                }
            ],
            [
                /'/,
                {
                    token: "string",
                    bracket: "@open",
                    next: "@stringquote"
                }
            ],
            [
                /`/,
                {
                    token: "string",
                    bracket: "@open",
                    next: "@stringping"
                }
            ],
            [
                /\|/,
                {
                    token: "string",
                    bracket: "@open",
                    next: "@stringtemplate"
                }
            ],
            [
                /\d+/,
                "number"
            ]
        ],
        stringtemplate: [
            [
                /[^\\\|]+/,
                "string"
            ],
            [
                /\\\|/,
                "string"
            ],
            [
                /\|/,
                {
                    token: "string",
                    bracket: "@close",
                    next: "@pop"
                }
            ]
        ],
        stringping: [
            [
                /[^\\`]+/,
                "string"
            ],
            [
                /`/,
                {
                    token: "string",
                    bracket: "@close",
                    next: "@pop"
                }
            ]
        ],
        stringquote: [
            [
                /[^\\']+/,
                "string"
            ],
            [
                /'/,
                {
                    token: "string",
                    bracket: "@close",
                    next: "@pop"
                }
            ]
        ],
        whitespace: [
            [
                /[ \t\r\n]+/,
                ""
            ],
            [
                /^\*.*$/,
                "comment"
            ],
            [
                /\".*$/,
                "comment"
            ]
        ]
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}]},["4BvEg"], null, "parcelRequire4f3a")

//# sourceMappingURL=abap.28986d70.js.map
