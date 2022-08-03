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
})({"4jLVM":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "2d2d14d3e952058c87641e3548b86323"; // @flow
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

},{}],"7ziVy":[function(require,module,exports) {
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
 *-----------------------------------------------------------------------------*/ // src/basic-languages/mysql/mysql.ts
var conf = {
    comments: {
        lineComment: "--",
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
    ]
};
var language = {
    defaultToken: "",
    tokenPostfix: ".sql",
    ignoreCase: true,
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
        }
    ],
    keywords: [
        "ACCESSIBLE",
        "ADD",
        "ALL",
        "ALTER",
        "ANALYZE",
        "AND",
        "AS",
        "ASC",
        "ASENSITIVE",
        "BEFORE",
        "BETWEEN",
        "BIGINT",
        "BINARY",
        "BLOB",
        "BOTH",
        "BY",
        "CALL",
        "CASCADE",
        "CASE",
        "CHANGE",
        "CHAR",
        "CHARACTER",
        "CHECK",
        "COLLATE",
        "COLUMN",
        "CONDITION",
        "CONSTRAINT",
        "CONTINUE",
        "CONVERT",
        "CREATE",
        "CROSS",
        "CUBE",
        "CUME_DIST",
        "CURRENT_DATE",
        "CURRENT_TIME",
        "CURRENT_TIMESTAMP",
        "CURRENT_USER",
        "CURSOR",
        "DATABASE",
        "DATABASES",
        "DAY_HOUR",
        "DAY_MICROSECOND",
        "DAY_MINUTE",
        "DAY_SECOND",
        "DEC",
        "DECIMAL",
        "DECLARE",
        "DEFAULT",
        "DELAYED",
        "DELETE",
        "DENSE_RANK",
        "DESC",
        "DESCRIBE",
        "DETERMINISTIC",
        "DISTINCT",
        "DISTINCTROW",
        "DIV",
        "DOUBLE",
        "DROP",
        "DUAL",
        "EACH",
        "ELSE",
        "ELSEIF",
        "EMPTY",
        "ENCLOSED",
        "ESCAPED",
        "EXCEPT",
        "EXISTS",
        "EXIT",
        "EXPLAIN",
        "FALSE",
        "FETCH",
        "FIRST_VALUE",
        "FLOAT",
        "FLOAT4",
        "FLOAT8",
        "FOR",
        "FORCE",
        "FOREIGN",
        "FROM",
        "FULLTEXT",
        "FUNCTION",
        "GENERATED",
        "GET",
        "GRANT",
        "GROUP",
        "GROUPING",
        "GROUPS",
        "HAVING",
        "HIGH_PRIORITY",
        "HOUR_MICROSECOND",
        "HOUR_MINUTE",
        "HOUR_SECOND",
        "IF",
        "IGNORE",
        "IN",
        "INDEX",
        "INFILE",
        "INNER",
        "INOUT",
        "INSENSITIVE",
        "INSERT",
        "INT",
        "INT1",
        "INT2",
        "INT3",
        "INT4",
        "INT8",
        "INTEGER",
        "INTERVAL",
        "INTO",
        "IO_AFTER_GTIDS",
        "IO_BEFORE_GTIDS",
        "IS",
        "ITERATE",
        "JOIN",
        "JSON_TABLE",
        "KEY",
        "KEYS",
        "KILL",
        "LAG",
        "LAST_VALUE",
        "LATERAL",
        "LEAD",
        "LEADING",
        "LEAVE",
        "LEFT",
        "LIKE",
        "LIMIT",
        "LINEAR",
        "LINES",
        "LOAD",
        "LOCALTIME",
        "LOCALTIMESTAMP",
        "LOCK",
        "LONG",
        "LONGBLOB",
        "LONGTEXT",
        "LOOP",
        "LOW_PRIORITY",
        "MASTER_BIND",
        "MASTER_SSL_VERIFY_SERVER_CERT",
        "MATCH",
        "MAXVALUE",
        "MEDIUMBLOB",
        "MEDIUMINT",
        "MEDIUMTEXT",
        "MIDDLEINT",
        "MINUTE_MICROSECOND",
        "MINUTE_SECOND",
        "MOD",
        "MODIFIES",
        "NATURAL",
        "NOT",
        "NO_WRITE_TO_BINLOG",
        "NTH_VALUE",
        "NTILE",
        "NULL",
        "NUMERIC",
        "OF",
        "ON",
        "OPTIMIZE",
        "OPTIMIZER_COSTS",
        "OPTION",
        "OPTIONALLY",
        "OR",
        "ORDER",
        "OUT",
        "OUTER",
        "OUTFILE",
        "OVER",
        "PARTITION",
        "PERCENT_RANK",
        "PRECISION",
        "PRIMARY",
        "PROCEDURE",
        "PURGE",
        "RANGE",
        "RANK",
        "READ",
        "READS",
        "READ_WRITE",
        "REAL",
        "RECURSIVE",
        "REFERENCES",
        "REGEXP",
        "RELEASE",
        "RENAME",
        "REPEAT",
        "REPLACE",
        "REQUIRE",
        "RESIGNAL",
        "RESTRICT",
        "RETURN",
        "REVOKE",
        "RIGHT",
        "RLIKE",
        "ROW",
        "ROWS",
        "ROW_NUMBER",
        "SCHEMA",
        "SCHEMAS",
        "SECOND_MICROSECOND",
        "SELECT",
        "SENSITIVE",
        "SEPARATOR",
        "SET",
        "SHOW",
        "SIGNAL",
        "SMALLINT",
        "SPATIAL",
        "SPECIFIC",
        "SQL",
        "SQLEXCEPTION",
        "SQLSTATE",
        "SQLWARNING",
        "SQL_BIG_RESULT",
        "SQL_CALC_FOUND_ROWS",
        "SQL_SMALL_RESULT",
        "SSL",
        "STARTING",
        "STORED",
        "STRAIGHT_JOIN",
        "SYSTEM",
        "TABLE",
        "TERMINATED",
        "THEN",
        "TINYBLOB",
        "TINYINT",
        "TINYTEXT",
        "TO",
        "TRAILING",
        "TRIGGER",
        "TRUE",
        "UNDO",
        "UNION",
        "UNIQUE",
        "UNLOCK",
        "UNSIGNED",
        "UPDATE",
        "USAGE",
        "USE",
        "USING",
        "UTC_DATE",
        "UTC_TIME",
        "UTC_TIMESTAMP",
        "VALUES",
        "VARBINARY",
        "VARCHAR",
        "VARCHARACTER",
        "VARYING",
        "VIRTUAL",
        "WHEN",
        "WHERE",
        "WHILE",
        "WINDOW",
        "WITH",
        "WRITE",
        "XOR",
        "YEAR_MONTH",
        "ZEROFILL"
    ],
    operators: [
        "AND",
        "BETWEEN",
        "IN",
        "LIKE",
        "NOT",
        "OR",
        "IS",
        "NULL",
        "INTERSECT",
        "UNION",
        "INNER",
        "JOIN",
        "LEFT",
        "OUTER",
        "RIGHT"
    ],
    builtinFunctions: [
        "ABS",
        "ACOS",
        "ADDDATE",
        "ADDTIME",
        "AES_DECRYPT",
        "AES_ENCRYPT",
        "ANY_VALUE",
        "Area",
        "AsBinary",
        "AsWKB",
        "ASCII",
        "ASIN",
        "AsText",
        "AsWKT",
        "ASYMMETRIC_DECRYPT",
        "ASYMMETRIC_DERIVE",
        "ASYMMETRIC_ENCRYPT",
        "ASYMMETRIC_SIGN",
        "ASYMMETRIC_VERIFY",
        "ATAN",
        "ATAN2",
        "ATAN",
        "AVG",
        "BENCHMARK",
        "BIN",
        "BIT_AND",
        "BIT_COUNT",
        "BIT_LENGTH",
        "BIT_OR",
        "BIT_XOR",
        "Buffer",
        "CAST",
        "CEIL",
        "CEILING",
        "Centroid",
        "CHAR",
        "CHAR_LENGTH",
        "CHARACTER_LENGTH",
        "CHARSET",
        "COALESCE",
        "COERCIBILITY",
        "COLLATION",
        "COMPRESS",
        "CONCAT",
        "CONCAT_WS",
        "CONNECTION_ID",
        "Contains",
        "CONV",
        "CONVERT",
        "CONVERT_TZ",
        "ConvexHull",
        "COS",
        "COT",
        "COUNT",
        "CRC32",
        "CREATE_ASYMMETRIC_PRIV_KEY",
        "CREATE_ASYMMETRIC_PUB_KEY",
        "CREATE_DH_PARAMETERS",
        "CREATE_DIGEST",
        "Crosses",
        "CUME_DIST",
        "CURDATE",
        "CURRENT_DATE",
        "CURRENT_ROLE",
        "CURRENT_TIME",
        "CURRENT_TIMESTAMP",
        "CURRENT_USER",
        "CURTIME",
        "DATABASE",
        "DATE",
        "DATE_ADD",
        "DATE_FORMAT",
        "DATE_SUB",
        "DATEDIFF",
        "DAY",
        "DAYNAME",
        "DAYOFMONTH",
        "DAYOFWEEK",
        "DAYOFYEAR",
        "DECODE",
        "DEFAULT",
        "DEGREES",
        "DES_DECRYPT",
        "DES_ENCRYPT",
        "DENSE_RANK",
        "Dimension",
        "Disjoint",
        "Distance",
        "ELT",
        "ENCODE",
        "ENCRYPT",
        "EndPoint",
        "Envelope",
        "Equals",
        "EXP",
        "EXPORT_SET",
        "ExteriorRing",
        "EXTRACT",
        "ExtractValue",
        "FIELD",
        "FIND_IN_SET",
        "FIRST_VALUE",
        "FLOOR",
        "FORMAT",
        "FORMAT_BYTES",
        "FORMAT_PICO_TIME",
        "FOUND_ROWS",
        "FROM_BASE64",
        "FROM_DAYS",
        "FROM_UNIXTIME",
        "GEN_RANGE",
        "GEN_RND_EMAIL",
        "GEN_RND_PAN",
        "GEN_RND_SSN",
        "GEN_RND_US_PHONE",
        "GeomCollection",
        "GeomCollFromText",
        "GeometryCollectionFromText",
        "GeomCollFromWKB",
        "GeometryCollectionFromWKB",
        "GeometryCollection",
        "GeometryN",
        "GeometryType",
        "GeomFromText",
        "GeometryFromText",
        "GeomFromWKB",
        "GeometryFromWKB",
        "GET_FORMAT",
        "GET_LOCK",
        "GLength",
        "GREATEST",
        "GROUP_CONCAT",
        "GROUPING",
        "GTID_SUBSET",
        "GTID_SUBTRACT",
        "HEX",
        "HOUR",
        "ICU_VERSION",
        "IF",
        "IFNULL",
        "INET_ATON",
        "INET_NTOA",
        "INET6_ATON",
        "INET6_NTOA",
        "INSERT",
        "INSTR",
        "InteriorRingN",
        "Intersects",
        "INTERVAL",
        "IS_FREE_LOCK",
        "IS_IPV4",
        "IS_IPV4_COMPAT",
        "IS_IPV4_MAPPED",
        "IS_IPV6",
        "IS_USED_LOCK",
        "IS_UUID",
        "IsClosed",
        "IsEmpty",
        "ISNULL",
        "IsSimple",
        "JSON_APPEND",
        "JSON_ARRAY",
        "JSON_ARRAY_APPEND",
        "JSON_ARRAY_INSERT",
        "JSON_ARRAYAGG",
        "JSON_CONTAINS",
        "JSON_CONTAINS_PATH",
        "JSON_DEPTH",
        "JSON_EXTRACT",
        "JSON_INSERT",
        "JSON_KEYS",
        "JSON_LENGTH",
        "JSON_MERGE",
        "JSON_MERGE_PATCH",
        "JSON_MERGE_PRESERVE",
        "JSON_OBJECT",
        "JSON_OBJECTAGG",
        "JSON_OVERLAPS",
        "JSON_PRETTY",
        "JSON_QUOTE",
        "JSON_REMOVE",
        "JSON_REPLACE",
        "JSON_SCHEMA_VALID",
        "JSON_SCHEMA_VALIDATION_REPORT",
        "JSON_SEARCH",
        "JSON_SET",
        "JSON_STORAGE_FREE",
        "JSON_STORAGE_SIZE",
        "JSON_TABLE",
        "JSON_TYPE",
        "JSON_UNQUOTE",
        "JSON_VALID",
        "LAG",
        "LAST_DAY",
        "LAST_INSERT_ID",
        "LAST_VALUE",
        "LCASE",
        "LEAD",
        "LEAST",
        "LEFT",
        "LENGTH",
        "LineFromText",
        "LineStringFromText",
        "LineFromWKB",
        "LineStringFromWKB",
        "LineString",
        "LN",
        "LOAD_FILE",
        "LOCALTIME",
        "LOCALTIMESTAMP",
        "LOCATE",
        "LOG",
        "LOG10",
        "LOG2",
        "LOWER",
        "LPAD",
        "LTRIM",
        "MAKE_SET",
        "MAKEDATE",
        "MAKETIME",
        "MASK_INNER",
        "MASK_OUTER",
        "MASK_PAN",
        "MASK_PAN_RELAXED",
        "MASK_SSN",
        "MASTER_POS_WAIT",
        "MAX",
        "MBRContains",
        "MBRCoveredBy",
        "MBRCovers",
        "MBRDisjoint",
        "MBREqual",
        "MBREquals",
        "MBRIntersects",
        "MBROverlaps",
        "MBRTouches",
        "MBRWithin",
        "MD5",
        "MEMBER OF",
        "MICROSECOND",
        "MID",
        "MIN",
        "MINUTE",
        "MLineFromText",
        "MultiLineStringFromText",
        "MLineFromWKB",
        "MultiLineStringFromWKB",
        "MOD",
        "MONTH",
        "MONTHNAME",
        "MPointFromText",
        "MultiPointFromText",
        "MPointFromWKB",
        "MultiPointFromWKB",
        "MPolyFromText",
        "MultiPolygonFromText",
        "MPolyFromWKB",
        "MultiPolygonFromWKB",
        "MultiLineString",
        "MultiPoint",
        "MultiPolygon",
        "NAME_CONST",
        "NOT IN",
        "NOW",
        "NTH_VALUE",
        "NTILE",
        "NULLIF",
        "NumGeometries",
        "NumInteriorRings",
        "NumPoints",
        "OCT",
        "OCTET_LENGTH",
        "OLD_PASSWORD",
        "ORD",
        "Overlaps",
        "PASSWORD",
        "PERCENT_RANK",
        "PERIOD_ADD",
        "PERIOD_DIFF",
        "PI",
        "Point",
        "PointFromText",
        "PointFromWKB",
        "PointN",
        "PolyFromText",
        "PolygonFromText",
        "PolyFromWKB",
        "PolygonFromWKB",
        "Polygon",
        "POSITION",
        "POW",
        "POWER",
        "PS_CURRENT_THREAD_ID",
        "PS_THREAD_ID",
        "PROCEDURE ANALYSE",
        "QUARTER",
        "QUOTE",
        "RADIANS",
        "RAND",
        "RANDOM_BYTES",
        "RANK",
        "REGEXP_INSTR",
        "REGEXP_LIKE",
        "REGEXP_REPLACE",
        "REGEXP_REPLACE",
        "RELEASE_ALL_LOCKS",
        "RELEASE_LOCK",
        "REPEAT",
        "REPLACE",
        "REVERSE",
        "RIGHT",
        "ROLES_GRAPHML",
        "ROUND",
        "ROW_COUNT",
        "ROW_NUMBER",
        "RPAD",
        "RTRIM",
        "SCHEMA",
        "SEC_TO_TIME",
        "SECOND",
        "SESSION_USER",
        "SHA1",
        "SHA",
        "SHA2",
        "SIGN",
        "SIN",
        "SLEEP",
        "SOUNDEX",
        "SOURCE_POS_WAIT",
        "SPACE",
        "SQRT",
        "SRID",
        "ST_Area",
        "ST_AsBinary",
        "ST_AsWKB",
        "ST_AsGeoJSON",
        "ST_AsText",
        "ST_AsWKT",
        "ST_Buffer",
        "ST_Buffer_Strategy",
        "ST_Centroid",
        "ST_Collect",
        "ST_Contains",
        "ST_ConvexHull",
        "ST_Crosses",
        "ST_Difference",
        "ST_Dimension",
        "ST_Disjoint",
        "ST_Distance",
        "ST_Distance_Sphere",
        "ST_EndPoint",
        "ST_Envelope",
        "ST_Equals",
        "ST_ExteriorRing",
        "ST_FrechetDistance",
        "ST_GeoHash",
        "ST_GeomCollFromText",
        "ST_GeometryCollectionFromText",
        "ST_GeomCollFromTxt",
        "ST_GeomCollFromWKB",
        "ST_GeometryCollectionFromWKB",
        "ST_GeometryN",
        "ST_GeometryType",
        "ST_GeomFromGeoJSON",
        "ST_GeomFromText",
        "ST_GeometryFromText",
        "ST_GeomFromWKB",
        "ST_GeometryFromWKB",
        "ST_HausdorffDistance",
        "ST_InteriorRingN",
        "ST_Intersection",
        "ST_Intersects",
        "ST_IsClosed",
        "ST_IsEmpty",
        "ST_IsSimple",
        "ST_IsValid",
        "ST_LatFromGeoHash",
        "ST_Length",
        "ST_LineFromText",
        "ST_LineStringFromText",
        "ST_LineFromWKB",
        "ST_LineStringFromWKB",
        "ST_LineInterpolatePoint",
        "ST_LineInterpolatePoints",
        "ST_LongFromGeoHash",
        "ST_Longitude",
        "ST_MakeEnvelope",
        "ST_MLineFromText",
        "ST_MultiLineStringFromText",
        "ST_MLineFromWKB",
        "ST_MultiLineStringFromWKB",
        "ST_MPointFromText",
        "ST_MultiPointFromText",
        "ST_MPointFromWKB",
        "ST_MultiPointFromWKB",
        "ST_MPolyFromText",
        "ST_MultiPolygonFromText",
        "ST_MPolyFromWKB",
        "ST_MultiPolygonFromWKB",
        "ST_NumGeometries",
        "ST_NumInteriorRing",
        "ST_NumInteriorRings",
        "ST_NumPoints",
        "ST_Overlaps",
        "ST_PointAtDistance",
        "ST_PointFromGeoHash",
        "ST_PointFromText",
        "ST_PointFromWKB",
        "ST_PointN",
        "ST_PolyFromText",
        "ST_PolygonFromText",
        "ST_PolyFromWKB",
        "ST_PolygonFromWKB",
        "ST_Simplify",
        "ST_SRID",
        "ST_StartPoint",
        "ST_SwapXY",
        "ST_SymDifference",
        "ST_Touches",
        "ST_Transform",
        "ST_Union",
        "ST_Validate",
        "ST_Within",
        "ST_X",
        "ST_Y",
        "StartPoint",
        "STATEMENT_DIGEST",
        "STATEMENT_DIGEST_TEXT",
        "STD",
        "STDDEV",
        "STDDEV_POP",
        "STDDEV_SAMP",
        "STR_TO_DATE",
        "STRCMP",
        "SUBDATE",
        "SUBSTR",
        "SUBSTRING",
        "SUBSTRING_INDEX",
        "SUBTIME",
        "SUM",
        "SYSDATE",
        "SYSTEM_USER",
        "TAN",
        "TIME",
        "TIME_FORMAT",
        "TIME_TO_SEC",
        "TIMEDIFF",
        "TIMESTAMP",
        "TIMESTAMPADD",
        "TIMESTAMPDIFF",
        "TO_BASE64",
        "TO_DAYS",
        "TO_SECONDS",
        "Touches",
        "TRIM",
        "TRUNCATE",
        "UCASE",
        "UNCOMPRESS",
        "UNCOMPRESSED_LENGTH",
        "UNHEX",
        "UNIX_TIMESTAMP",
        "UpdateXML",
        "UPPER",
        "USER",
        "UTC_DATE",
        "UTC_TIME",
        "UTC_TIMESTAMP",
        "UUID",
        "UUID_SHORT",
        "UUID_TO_BIN",
        "VALIDATE_PASSWORD_STRENGTH",
        "VALUES",
        "VAR_POP",
        "VAR_SAMP",
        "VARIANCE",
        "VERSION",
        "WAIT_FOR_EXECUTED_GTID_SET",
        "WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS",
        "WEEK",
        "WEEKDAY",
        "WEEKOFYEAR",
        "WEIGHT_STRING",
        "Within",
        "X",
        "Y",
        "YEAR",
        "YEARWEEK"
    ],
    builtinVariables: [],
    tokenizer: {
        root: [
            {
                include: "@comments"
            },
            {
                include: "@whitespace"
            },
            {
                include: "@numbers"
            },
            {
                include: "@strings"
            },
            {
                include: "@complexIdentifiers"
            },
            {
                include: "@scopes"
            },
            [
                /[;,.]/,
                "delimiter"
            ],
            [
                /[()]/,
                "@brackets"
            ],
            [
                /[\w@]+/,
                {
                    cases: {
                        "@operators": "operator",
                        "@builtinVariables": "predefined",
                        "@builtinFunctions": "predefined",
                        "@keywords": "keyword",
                        "@default": "identifier"
                    }
                }
            ],
            [
                /[<>=!%&+\-*/|~^]/,
                "operator"
            ]
        ],
        whitespace: [
            [
                /\s+/,
                "white"
            ]
        ],
        comments: [
            [
                /--+.*/,
                "comment"
            ],
            [
                /#+.*/,
                "comment"
            ],
            [
                /\/\*/,
                {
                    token: "comment.quote",
                    next: "@comment"
                }
            ]
        ],
        comment: [
            [
                /[^*/]+/,
                "comment"
            ],
            [
                /\*\//,
                {
                    token: "comment.quote",
                    next: "@pop"
                }
            ],
            [
                /./,
                "comment"
            ]
        ],
        numbers: [
            [
                /0[xX][0-9a-fA-F]*/,
                "number"
            ],
            [
                /[$][+-]*\d*(\.\d*)?/,
                "number"
            ],
            [
                /((\d+(\.\d*)?)|(\.\d+))([eE][\-+]?\d+)?/,
                "number"
            ]
        ],
        strings: [
            [
                /'/,
                {
                    token: "string",
                    next: "@string"
                }
            ],
            [
                /"/,
                {
                    token: "string.double",
                    next: "@stringDouble"
                }
            ]
        ],
        string: [
            [
                /[^']+/,
                "string"
            ],
            [
                /''/,
                "string"
            ],
            [
                /'/,
                {
                    token: "string",
                    next: "@pop"
                }
            ]
        ],
        stringDouble: [
            [
                /[^"]+/,
                "string.double"
            ],
            [
                /""/,
                "string.double"
            ],
            [
                /"/,
                {
                    token: "string.double",
                    next: "@pop"
                }
            ]
        ],
        complexIdentifiers: [
            [
                /`/,
                {
                    token: "identifier.quote",
                    next: "@quotedIdentifier"
                }
            ]
        ],
        quotedIdentifier: [
            [
                /[^`]+/,
                "identifier"
            ],
            [
                /``/,
                "identifier"
            ],
            [
                /`/,
                {
                    token: "identifier.quote",
                    next: "@pop"
                }
            ]
        ],
        scopes: []
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}]},["4jLVM"], null, "parcelRequire4f3a")

//# sourceMappingURL=mysql.48b86323.js.map
