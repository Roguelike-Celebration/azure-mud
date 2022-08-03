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
})({"4oy4G":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "b36ea48a1fe9cc8fe71ee8d404d0bdaa"; // @flow
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

},{}],"6oDB1":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "TagAngleInterpolationBracket", ()=>TagAngleInterpolationBracket
);
parcelHelpers.export(exports, "TagAngleInterpolationDollar", ()=>TagAngleInterpolationDollar
);
parcelHelpers.export(exports, "TagAutoInterpolationBracket", ()=>TagAutoInterpolationBracket
);
parcelHelpers.export(exports, "TagAutoInterpolationDollar", ()=>TagAutoInterpolationDollar
);
parcelHelpers.export(exports, "TagBracketInterpolationBracket", ()=>TagBracketInterpolationBracket
);
parcelHelpers.export(exports, "TagBracketInterpolationDollar", ()=>TagBracketInterpolationDollar
);
var _editorApiJs = require("../../editor/editor.api.js");
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.33.0(4b1abad427e58dbedc1215d99a0902ffc885fcd4)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/ var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __reExport = (target, module, copyDefault, desc)=>{
    if (module && typeof module === "object" || typeof module === "function") {
        for (let key of __getOwnPropNames(module))if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default")) __defProp(target, key, {
            get: ()=>module[key]
            ,
            enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable
        });
    }
    return target;
};
// src/fillers/monaco-editor-core.ts
var monaco_editor_core_exports = {
};
__reExport(monaco_editor_core_exports, _editorApiJs);
// src/basic-languages/freemarker2/freemarker2.ts
var EMPTY_ELEMENTS = [
    "assign",
    "flush",
    "ftl",
    "return",
    "global",
    "import",
    "include",
    "break",
    "continue",
    "local",
    "nested",
    "nt",
    "setting",
    "stop",
    "t",
    "lt",
    "rt",
    "fallback"
];
var BLOCK_ELEMENTS = [
    "attempt",
    "autoesc",
    "autoEsc",
    "compress",
    "comment",
    "escape",
    "noescape",
    "function",
    "if",
    "list",
    "items",
    "sep",
    "macro",
    "noparse",
    "noParse",
    "noautoesc",
    "noAutoEsc",
    "outputformat",
    "switch",
    "visit",
    "recurse"
];
var TagSyntaxAngle = {
    close: ">",
    id: "angle",
    open: "<"
};
var TagSyntaxBracket = {
    close: "\\]",
    id: "bracket",
    open: "\\["
};
var TagSyntaxAuto = {
    close: "[>\\]]",
    id: "auto",
    open: "[<\\[]"
};
var InterpolationSyntaxDollar = {
    close: "\\}",
    id: "dollar",
    open1: "\\$",
    open2: "\\{"
};
var InterpolationSyntaxBracket = {
    close: "\\]",
    id: "bracket",
    open1: "\\[",
    open2: "="
};
function createLangConfiguration(ts) {
    return {
        brackets: [
            [
                "<",
                ">"
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
                "{",
                "}"
            ]
        ],
        comments: {
            blockComment: [
                `${ts.open}--`,
                `--${ts.close}`
            ]
        },
        autoCloseBefore: "\n\r	 }]),.:;=",
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
        surroundingPairs: [
            {
                open: '"',
                close: '"'
            },
            {
                open: "'",
                close: "'"
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
                open: "(",
                close: ")"
            },
            {
                open: "<",
                close: ">"
            }
        ],
        folding: {
            markers: {
                start: new RegExp(`${ts.open}#(?:${BLOCK_ELEMENTS.join("|")})([^/${ts.close}]*(?!/)${ts.close})[^${ts.open}]*$`),
                end: new RegExp(`${ts.open}/#(?:${BLOCK_ELEMENTS.join("|")})[\\r\\n\\t ]*>`)
            }
        },
        onEnterRules: [
            {
                beforeText: new RegExp(`${ts.open}#(?!(?:${EMPTY_ELEMENTS.join("|")}))([a-zA-Z_]+)([^/${ts.close}]*(?!/)${ts.close})[^${ts.open}]*$`),
                afterText: new RegExp(`^${ts.open}/#([a-zA-Z_]+)[\\r\\n\\t ]*${ts.close}$`),
                action: {
                    indentAction: monaco_editor_core_exports.languages.IndentAction.IndentOutdent
                }
            },
            {
                beforeText: new RegExp(`${ts.open}#(?!(?:${EMPTY_ELEMENTS.join("|")}))([a-zA-Z_]+)([^/${ts.close}]*(?!/)${ts.close})[^${ts.open}]*$`),
                action: {
                    indentAction: monaco_editor_core_exports.languages.IndentAction.Indent
                }
            }
        ]
    };
}
function createLangConfigurationAuto() {
    return {
        brackets: [
            [
                "<",
                ">"
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
                "{",
                "}"
            ]
        ],
        autoCloseBefore: "\n\r	 }]),.:;=",
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
        surroundingPairs: [
            {
                open: '"',
                close: '"'
            },
            {
                open: "'",
                close: "'"
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
                open: "(",
                close: ")"
            },
            {
                open: "<",
                close: ">"
            }
        ],
        folding: {
            markers: {
                start: new RegExp(`[<\\[]#(?:${BLOCK_ELEMENTS.join("|")})([^/>\\]]*(?!/)[>\\]])[^<\\[]*$`),
                end: new RegExp(`[<\\[]/#(?:${BLOCK_ELEMENTS.join("|")})[\\r\\n\\t ]*>`)
            }
        },
        onEnterRules: [
            {
                beforeText: new RegExp(`[<\\[]#(?!(?:${EMPTY_ELEMENTS.join("|")}))([a-zA-Z_]+)([^/>\\]]*(?!/)[>\\]])[^[<\\[]]*$`),
                afterText: new RegExp(`^[<\\[]/#([a-zA-Z_]+)[\\r\\n\\t ]*[>\\]]$`),
                action: {
                    indentAction: monaco_editor_core_exports.languages.IndentAction.IndentOutdent
                }
            },
            {
                beforeText: new RegExp(`[<\\[]#(?!(?:${EMPTY_ELEMENTS.join("|")}))([a-zA-Z_]+)([^/>\\]]*(?!/)[>\\]])[^[<\\[]]*$`),
                action: {
                    indentAction: monaco_editor_core_exports.languages.IndentAction.Indent
                }
            }
        ]
    };
}
function createMonarchLanguage(ts, is) {
    const id = `_${ts.id}_${is.id}`;
    const s = (name)=>name.replace(/__id__/g, id)
    ;
    const r = (regexp)=>{
        const source = regexp.source.replace(/__id__/g, id);
        return new RegExp(source, regexp.flags);
    };
    return {
        unicode: true,
        includeLF: false,
        start: s("default__id__"),
        ignoreCase: false,
        defaultToken: "invalid",
        tokenPostfix: `.freemarker2`,
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
        [s("open__id__")]: new RegExp(ts.open),
        [s("close__id__")]: new RegExp(ts.close),
        [s("iOpen1__id__")]: new RegExp(is.open1),
        [s("iOpen2__id__")]: new RegExp(is.open2),
        [s("iClose__id__")]: new RegExp(is.close),
        [s("startTag__id__")]: r(/(@open__id__)(#)/),
        [s("endTag__id__")]: r(/(@open__id__)(\/#)/),
        [s("startOrEndTag__id__")]: r(/(@open__id__)(\/?#)/),
        [s("closeTag1__id__")]: r(/((?:@blank)*)(@close__id__)/),
        [s("closeTag2__id__")]: r(/((?:@blank)*\/?)(@close__id__)/),
        blank: /[ \t\n\r]/,
        keywords: [
            "false",
            "true",
            "in",
            "as",
            "using"
        ],
        directiveStartCloseTag1: /attempt|recover|sep|auto[eE]sc|no(?:autoe|AutoE)sc|compress|default|no[eE]scape|comment|no[pP]arse/,
        directiveStartCloseTag2: /else|break|continue|return|stop|flush|t|lt|rt|nt|nested|recurse|fallback|ftl/,
        directiveStartBlank: /if|else[iI]f|list|for[eE]ach|switch|case|assign|global|local|include|import|function|macro|transform|visit|stop|return|call|setting|output[fF]ormat|nested|recurse|escape|ftl|items/,
        directiveEndCloseTag1: /if|list|items|sep|recover|attempt|for[eE]ach|local|global|assign|function|macro|output[fF]ormat|auto[eE]sc|no(?:autoe|AutoE)sc|compress|transform|switch|escape|no[eE]scape/,
        escapedChar: /\\(?:[ntrfbgla\\'"\{=]|(?:x[0-9A-Fa-f]{1,4}))/,
        asciiDigit: /[0-9]/,
        integer: /[0-9]+/,
        nonEscapedIdStartChar: /[\$@-Z_a-z\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u1FFF\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183-\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3006\u3031-\u3035\u303B-\u303C\u3040-\u318F\u31A0-\u31BA\u31F0-\u31FF\u3300-\u337F\u3400-\u4DB5\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5-\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
        escapedIdChar: /\\[\-\.:#]/,
        idStartChar: /(?:@nonEscapedIdStartChar)|(?:@escapedIdChar)/,
        id: /(?:@idStartChar)(?:(?:@idStartChar)|(?:@asciiDigit))*/,
        specialHashKeys: /\*\*|\*|false|true|in|as|using/,
        namedSymbols: /&lt;=|&gt;=|\\lte|\\lt|&lt;|\\gte|\\gt|&gt;|&amp;&amp;|\\and|-&gt;|->|==|!=|\+=|-=|\*=|\/=|%=|\+\+|--|<=|&&|\|\||:|\.\.\.|\.\.\*|\.\.<|\.\.!|\?\?|=|<|\+|-|\*|\/|%|\||\.\.|\?|!|&|\.|,|;/,
        arrows: [
            "->",
            "-&gt;"
        ],
        delimiters: [
            ";",
            ":",
            ",",
            "."
        ],
        stringOperators: [
            "lte",
            "lt",
            "gte",
            "gt"
        ],
        noParseTags: [
            "noparse",
            "noParse",
            "comment"
        ],
        tokenizer: {
            [s("default__id__")]: [
                {
                    include: s("@directive_token__id__")
                },
                {
                    include: s("@interpolation_and_text_token__id__")
                }
            ],
            [s("fmExpression__id__.directive")]: [
                {
                    include: s("@blank_and_expression_comment_token__id__")
                },
                {
                    include: s("@directive_end_token__id__")
                },
                {
                    include: s("@expression_token__id__")
                }
            ],
            [s("fmExpression__id__.interpolation")]: [
                {
                    include: s("@blank_and_expression_comment_token__id__")
                },
                {
                    include: s("@expression_token__id__")
                },
                {
                    include: s("@greater_operators_token__id__")
                }
            ],
            [s("inParen__id__.plain")]: [
                {
                    include: s("@blank_and_expression_comment_token__id__")
                },
                {
                    include: s("@directive_end_token__id__")
                },
                {
                    include: s("@expression_token__id__")
                }
            ],
            [s("inParen__id__.gt")]: [
                {
                    include: s("@blank_and_expression_comment_token__id__")
                },
                {
                    include: s("@expression_token__id__")
                },
                {
                    include: s("@greater_operators_token__id__")
                }
            ],
            [s("noSpaceExpression__id__")]: [
                {
                    include: s("@no_space_expression_end_token__id__")
                },
                {
                    include: s("@directive_end_token__id__")
                },
                {
                    include: s("@expression_token__id__")
                }
            ],
            [s("unifiedCall__id__")]: [
                {
                    include: s("@unified_call_token__id__")
                }
            ],
            [s("singleString__id__")]: [
                {
                    include: s("@string_single_token__id__")
                }
            ],
            [s("doubleString__id__")]: [
                {
                    include: s("@string_double_token__id__")
                }
            ],
            [s("rawSingleString__id__")]: [
                {
                    include: s("@string_single_raw_token__id__")
                }
            ],
            [s("rawDoubleString__id__")]: [
                {
                    include: s("@string_double_raw_token__id__")
                }
            ],
            [s("expressionComment__id__")]: [
                {
                    include: s("@expression_comment_token__id__")
                }
            ],
            [s("noParse__id__")]: [
                {
                    include: s("@no_parse_token__id__")
                }
            ],
            [s("terseComment__id__")]: [
                {
                    include: s("@terse_comment_token__id__")
                }
            ],
            [s("directive_token__id__")]: [
                [
                    r(/(?:@startTag__id__)(@directiveStartCloseTag1)(?:@closeTag1__id__)/),
                    ts.id === "auto" ? {
                        cases: {
                            "$1==<": {
                                token: "@rematch",
                                switchTo: `@default_angle_${is.id}`
                            },
                            "$1==[": {
                                token: "@rematch",
                                switchTo: `@default_bracket_${is.id}`
                            }
                        }
                    } : [
                        {
                            token: "@brackets.directive"
                        },
                        {
                            token: "delimiter.directive"
                        },
                        {
                            cases: {
                                "@noParseTags": {
                                    token: "tag",
                                    next: s("@noParse__id__.$3")
                                },
                                "@default": {
                                    token: "tag"
                                }
                            }
                        },
                        {
                            token: "delimiter.directive"
                        },
                        {
                            token: "@brackets.directive"
                        }
                    ]
                ],
                [
                    r(/(?:@startTag__id__)(@directiveStartCloseTag2)(?:@closeTag2__id__)/),
                    ts.id === "auto" ? {
                        cases: {
                            "$1==<": {
                                token: "@rematch",
                                switchTo: `@default_angle_${is.id}`
                            },
                            "$1==[": {
                                token: "@rematch",
                                switchTo: `@default_bracket_${is.id}`
                            }
                        }
                    } : [
                        {
                            token: "@brackets.directive"
                        },
                        {
                            token: "delimiter.directive"
                        },
                        {
                            token: "tag"
                        },
                        {
                            token: "delimiter.directive"
                        },
                        {
                            token: "@brackets.directive"
                        }
                    ]
                ],
                [
                    r(/(?:@startTag__id__)(@directiveStartBlank)(@blank)/),
                    ts.id === "auto" ? {
                        cases: {
                            "$1==<": {
                                token: "@rematch",
                                switchTo: `@default_angle_${is.id}`
                            },
                            "$1==[": {
                                token: "@rematch",
                                switchTo: `@default_bracket_${is.id}`
                            }
                        }
                    } : [
                        {
                            token: "@brackets.directive"
                        },
                        {
                            token: "delimiter.directive"
                        },
                        {
                            token: "tag"
                        },
                        {
                            token: "",
                            next: s("@fmExpression__id__.directive")
                        }
                    ]
                ],
                [
                    r(/(?:@endTag__id__)(@directiveEndCloseTag1)(?:@closeTag1__id__)/),
                    ts.id === "auto" ? {
                        cases: {
                            "$1==<": {
                                token: "@rematch",
                                switchTo: `@default_angle_${is.id}`
                            },
                            "$1==[": {
                                token: "@rematch",
                                switchTo: `@default_bracket_${is.id}`
                            }
                        }
                    } : [
                        {
                            token: "@brackets.directive"
                        },
                        {
                            token: "delimiter.directive"
                        },
                        {
                            token: "tag"
                        },
                        {
                            token: "delimiter.directive"
                        },
                        {
                            token: "@brackets.directive"
                        }
                    ]
                ],
                [
                    r(/(@open__id__)(@)/),
                    ts.id === "auto" ? {
                        cases: {
                            "$1==<": {
                                token: "@rematch",
                                switchTo: `@default_angle_${is.id}`
                            },
                            "$1==[": {
                                token: "@rematch",
                                switchTo: `@default_bracket_${is.id}`
                            }
                        }
                    } : [
                        {
                            token: "@brackets.directive"
                        },
                        {
                            token: "delimiter.directive",
                            next: s("@unifiedCall__id__")
                        }
                    ]
                ],
                [
                    r(/(@open__id__)(\/@)((?:(?:@id)(?:\.(?:@id))*)?)(?:@closeTag1__id__)/),
                    [
                        {
                            token: "@brackets.directive"
                        },
                        {
                            token: "delimiter.directive"
                        },
                        {
                            token: "tag"
                        },
                        {
                            token: "delimiter.directive"
                        },
                        {
                            token: "@brackets.directive"
                        }
                    ]
                ],
                [
                    r(/(@open__id__)#--/),
                    ts.id === "auto" ? {
                        cases: {
                            "$1==<": {
                                token: "@rematch",
                                switchTo: `@default_angle_${is.id}`
                            },
                            "$1==[": {
                                token: "@rematch",
                                switchTo: `@default_bracket_${is.id}`
                            }
                        }
                    } : {
                        token: "comment",
                        next: s("@terseComment__id__")
                    }
                ],
                [
                    r(/(?:@startOrEndTag__id__)([a-zA-Z_]+)/),
                    ts.id === "auto" ? {
                        cases: {
                            "$1==<": {
                                token: "@rematch",
                                switchTo: `@default_angle_${is.id}`
                            },
                            "$1==[": {
                                token: "@rematch",
                                switchTo: `@default_bracket_${is.id}`
                            }
                        }
                    } : [
                        {
                            token: "@brackets.directive"
                        },
                        {
                            token: "delimiter.directive"
                        },
                        {
                            token: "tag.invalid",
                            next: s("@fmExpression__id__.directive")
                        }
                    ]
                ]
            ],
            [s("interpolation_and_text_token__id__")]: [
                [
                    r(/(@iOpen1__id__)(@iOpen2__id__)/),
                    [
                        {
                            token: is.id === "bracket" ? "@brackets.interpolation" : "delimiter.interpolation"
                        },
                        {
                            token: is.id === "bracket" ? "delimiter.interpolation" : "@brackets.interpolation",
                            next: s("@fmExpression__id__.interpolation")
                        }
                    ]
                ],
                [
                    /[\$#<\[\{]|(?:@blank)+|[^\$<#\[\{\n\r\t ]+/,
                    {
                        token: "source"
                    }
                ]
            ],
            [s("string_single_token__id__")]: [
                [
                    /[^'\\]/,
                    {
                        token: "string"
                    }
                ],
                [
                    /@escapedChar/,
                    {
                        token: "string.escape"
                    }
                ],
                [
                    /'/,
                    {
                        token: "string",
                        next: "@pop"
                    }
                ]
            ],
            [s("string_double_token__id__")]: [
                [
                    /[^"\\]/,
                    {
                        token: "string"
                    }
                ],
                [
                    /@escapedChar/,
                    {
                        token: "string.escape"
                    }
                ],
                [
                    /"/,
                    {
                        token: "string",
                        next: "@pop"
                    }
                ]
            ],
            [s("string_single_raw_token__id__")]: [
                [
                    /[^']+/,
                    {
                        token: "string.raw"
                    }
                ],
                [
                    /'/,
                    {
                        token: "string.raw",
                        next: "@pop"
                    }
                ]
            ],
            [s("string_double_raw_token__id__")]: [
                [
                    /[^"]+/,
                    {
                        token: "string.raw"
                    }
                ],
                [
                    /"/,
                    {
                        token: "string.raw",
                        next: "@pop"
                    }
                ]
            ],
            [s("expression_token__id__")]: [
                [
                    /(r?)(['"])/,
                    {
                        cases: {
                            "r'": [
                                {
                                    token: "keyword"
                                },
                                {
                                    token: "string.raw",
                                    next: s("@rawSingleString__id__")
                                }
                            ],
                            'r"': [
                                {
                                    token: "keyword"
                                },
                                {
                                    token: "string.raw",
                                    next: s("@rawDoubleString__id__")
                                }
                            ],
                            "'": [
                                {
                                    token: "source"
                                },
                                {
                                    token: "string",
                                    next: s("@singleString__id__")
                                }
                            ],
                            '"': [
                                {
                                    token: "source"
                                },
                                {
                                    token: "string",
                                    next: s("@doubleString__id__")
                                }
                            ]
                        }
                    }
                ],
                [
                    /(?:@integer)(?:\.(?:@integer))?/,
                    {
                        cases: {
                            "(?:@integer)": {
                                token: "number"
                            },
                            "@default": {
                                token: "number.float"
                            }
                        }
                    }
                ],
                [
                    /(\.)(@blank*)(@specialHashKeys)/,
                    [
                        {
                            token: "delimiter"
                        },
                        {
                            token: ""
                        },
                        {
                            token: "identifier"
                        }
                    ]
                ],
                [
                    /(?:@namedSymbols)/,
                    {
                        cases: {
                            "@arrows": {
                                token: "meta.arrow"
                            },
                            "@delimiters": {
                                token: "delimiter"
                            },
                            "@default": {
                                token: "operators"
                            }
                        }
                    }
                ],
                [
                    /@id/,
                    {
                        cases: {
                            "@keywords": {
                                token: "keyword.$0"
                            },
                            "@stringOperators": {
                                token: "operators"
                            },
                            "@default": {
                                token: "identifier"
                            }
                        }
                    }
                ],
                [
                    /[\[\]\(\)\{\}]/,
                    {
                        cases: {
                            "\\[": {
                                cases: {
                                    "$S2==gt": {
                                        token: "@brackets",
                                        next: s("@inParen__id__.gt")
                                    },
                                    "@default": {
                                        token: "@brackets",
                                        next: s("@inParen__id__.plain")
                                    }
                                }
                            },
                            "\\]": {
                                cases: {
                                    ...is.id === "bracket" ? {
                                        "$S2==interpolation": {
                                            token: "@brackets.interpolation",
                                            next: "@popall"
                                        }
                                    } : {
                                    },
                                    ...ts.id === "bracket" ? {
                                        "$S2==directive": {
                                            token: "@brackets.directive",
                                            next: "@popall"
                                        }
                                    } : {
                                    },
                                    [s("$S1==inParen__id__")]: {
                                        token: "@brackets",
                                        next: "@pop"
                                    },
                                    "@default": {
                                        token: "@brackets"
                                    }
                                }
                            },
                            "\\(": {
                                token: "@brackets",
                                next: s("@inParen__id__.gt")
                            },
                            "\\)": {
                                cases: {
                                    [s("$S1==inParen__id__")]: {
                                        token: "@brackets",
                                        next: "@pop"
                                    },
                                    "@default": {
                                        token: "@brackets"
                                    }
                                }
                            },
                            "\\{": {
                                cases: {
                                    "$S2==gt": {
                                        token: "@brackets",
                                        next: s("@inParen__id__.gt")
                                    },
                                    "@default": {
                                        token: "@brackets",
                                        next: s("@inParen__id__.plain")
                                    }
                                }
                            },
                            "\\}": {
                                cases: {
                                    ...is.id === "bracket" ? {
                                    } : {
                                        "$S2==interpolation": {
                                            token: "@brackets.interpolation",
                                            next: "@popall"
                                        }
                                    },
                                    [s("$S1==inParen__id__")]: {
                                        token: "@brackets",
                                        next: "@pop"
                                    },
                                    "@default": {
                                        token: "@brackets"
                                    }
                                }
                            }
                        }
                    }
                ],
                [
                    /\$\{/,
                    {
                        token: "delimiter.invalid"
                    }
                ]
            ],
            [s("blank_and_expression_comment_token__id__")]: [
                [
                    /(?:@blank)+/,
                    {
                        token: ""
                    }
                ],
                [
                    /[<\[][#!]--/,
                    {
                        token: "comment",
                        next: s("@expressionComment__id__")
                    }
                ]
            ],
            [s("directive_end_token__id__")]: [
                [
                    />/,
                    ts.id === "bracket" ? {
                        token: "operators"
                    } : {
                        token: "@brackets.directive",
                        next: "@popall"
                    }
                ],
                [
                    r(/(\/)(@close__id__)/),
                    [
                        {
                            token: "delimiter.directive"
                        },
                        {
                            token: "@brackets.directive",
                            next: "@popall"
                        }
                    ]
                ]
            ],
            [s("greater_operators_token__id__")]: [
                [
                    />/,
                    {
                        token: "operators"
                    }
                ],
                [
                    />=/,
                    {
                        token: "operators"
                    }
                ]
            ],
            [s("no_space_expression_end_token__id__")]: [
                [
                    /(?:@blank)+/,
                    {
                        token: "",
                        switchTo: s("@fmExpression__id__.directive")
                    }
                ]
            ],
            [s("unified_call_token__id__")]: [
                [
                    /(@id)((?:@blank)+)/,
                    [
                        {
                            token: "tag"
                        },
                        {
                            token: "",
                            next: s("@fmExpression__id__.directive")
                        }
                    ]
                ],
                [
                    r(/(@id)(\/?)(@close__id__)/),
                    [
                        {
                            token: "tag"
                        },
                        {
                            token: "delimiter.directive"
                        },
                        {
                            token: "@brackets.directive",
                            next: "@popall"
                        }
                    ]
                ],
                [
                    /./,
                    {
                        token: "@rematch",
                        next: s("@noSpaceExpression__id__")
                    }
                ]
            ],
            [s("no_parse_token__id__")]: [
                [
                    r(/(@open__id__)(\/#?)([a-zA-Z]+)((?:@blank)*)(@close__id__)/),
                    {
                        cases: {
                            "$S2==$3": [
                                {
                                    token: "@brackets.directive"
                                },
                                {
                                    token: "delimiter.directive"
                                },
                                {
                                    token: "tag"
                                },
                                {
                                    token: ""
                                },
                                {
                                    token: "@brackets.directive",
                                    next: "@popall"
                                }
                            ],
                            "$S2==comment": [
                                {
                                    token: "comment"
                                },
                                {
                                    token: "comment"
                                },
                                {
                                    token: "comment"
                                },
                                {
                                    token: "comment"
                                },
                                {
                                    token: "comment"
                                }
                            ],
                            "@default": [
                                {
                                    token: "source"
                                },
                                {
                                    token: "source"
                                },
                                {
                                    token: "source"
                                },
                                {
                                    token: "source"
                                },
                                {
                                    token: "source"
                                }
                            ]
                        }
                    }
                ],
                [
                    /[^<\[\-]+|[<\[\-]/,
                    {
                        cases: {
                            "$S2==comment": {
                                token: "comment"
                            },
                            "@default": {
                                token: "source"
                            }
                        }
                    }
                ]
            ],
            [s("expression_comment_token__id__")]: [
                [
                    /--[>\]]/,
                    {
                        token: "comment",
                        next: "@pop"
                    }
                ],
                [
                    /[^\->\]]+|[>\]\-]/,
                    {
                        token: "comment"
                    }
                ]
            ],
            [s("terse_comment_token__id__")]: [
                [
                    r(/--(?:@close__id__)/),
                    {
                        token: "comment",
                        next: "@popall"
                    }
                ],
                [
                    /[^<\[\-]+|[<\[\-]/,
                    {
                        token: "comment"
                    }
                ]
            ]
        }
    };
}
function createMonarchLanguageAuto(is) {
    const angle = createMonarchLanguage(TagSyntaxAngle, is);
    const bracket = createMonarchLanguage(TagSyntaxBracket, is);
    const auto = createMonarchLanguage(TagSyntaxAuto, is);
    return {
        ...angle,
        ...bracket,
        ...auto,
        unicode: true,
        includeLF: false,
        start: `default_auto_${is.id}`,
        ignoreCase: false,
        defaultToken: "invalid",
        tokenPostfix: `.freemarker2`,
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
        tokenizer: {
            ...angle.tokenizer,
            ...bracket.tokenizer,
            ...auto.tokenizer
        }
    };
}
var TagAngleInterpolationDollar = {
    conf: createLangConfiguration(TagSyntaxAngle),
    language: createMonarchLanguage(TagSyntaxAngle, InterpolationSyntaxDollar)
};
var TagBracketInterpolationDollar = {
    conf: createLangConfiguration(TagSyntaxBracket),
    language: createMonarchLanguage(TagSyntaxBracket, InterpolationSyntaxDollar)
};
var TagAngleInterpolationBracket = {
    conf: createLangConfiguration(TagSyntaxAngle),
    language: createMonarchLanguage(TagSyntaxAngle, InterpolationSyntaxBracket)
};
var TagBracketInterpolationBracket = {
    conf: createLangConfiguration(TagSyntaxBracket),
    language: createMonarchLanguage(TagSyntaxBracket, InterpolationSyntaxBracket)
};
var TagAutoInterpolationDollar = {
    conf: createLangConfigurationAuto(),
    language: createMonarchLanguageAuto(InterpolationSyntaxDollar)
};
var TagAutoInterpolationBracket = {
    conf: createLangConfigurationAuto(),
    language: createMonarchLanguageAuto(InterpolationSyntaxBracket)
};

},{"../../editor/editor.api.js":"4ekrL","@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}]},["4oy4G"], null, "parcelRequire4f3a")

//# sourceMappingURL=freemarker2.04d0bdaa.js.map
