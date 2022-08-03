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
})({"3KdpB":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "d44be3ba5be8232c96ef051862175edc"; // @flow
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

},{}],"fbV47":[function(require,module,exports) {
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
 *-----------------------------------------------------------------------------*/ // src/basic-languages/pgsql/pgsql.ts
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
        "ALL",
        "ANALYSE",
        "ANALYZE",
        "AND",
        "ANY",
        "ARRAY",
        "AS",
        "ASC",
        "ASYMMETRIC",
        "AUTHORIZATION",
        "BINARY",
        "BOTH",
        "CASE",
        "CAST",
        "CHECK",
        "COLLATE",
        "COLLATION",
        "COLUMN",
        "CONCURRENTLY",
        "CONSTRAINT",
        "CREATE",
        "CROSS",
        "CURRENT_CATALOG",
        "CURRENT_DATE",
        "CURRENT_ROLE",
        "CURRENT_SCHEMA",
        "CURRENT_TIME",
        "CURRENT_TIMESTAMP",
        "CURRENT_USER",
        "DEFAULT",
        "DEFERRABLE",
        "DESC",
        "DISTINCT",
        "DO",
        "ELSE",
        "END",
        "EXCEPT",
        "FALSE",
        "FETCH",
        "FOR",
        "FOREIGN",
        "FREEZE",
        "FROM",
        "FULL",
        "GRANT",
        "GROUP",
        "HAVING",
        "ILIKE",
        "IN",
        "INITIALLY",
        "INNER",
        "INTERSECT",
        "INTO",
        "IS",
        "ISNULL",
        "JOIN",
        "LATERAL",
        "LEADING",
        "LEFT",
        "LIKE",
        "LIMIT",
        "LOCALTIME",
        "LOCALTIMESTAMP",
        "NATURAL",
        "NOT",
        "NOTNULL",
        "NULL",
        "OFFSET",
        "ON",
        "ONLY",
        "OR",
        "ORDER",
        "OUTER",
        "OVERLAPS",
        "PLACING",
        "PRIMARY",
        "REFERENCES",
        "RETURNING",
        "RIGHT",
        "SELECT",
        "SESSION_USER",
        "SIMILAR",
        "SOME",
        "SYMMETRIC",
        "TABLE",
        "TABLESAMPLE",
        "THEN",
        "TO",
        "TRAILING",
        "TRUE",
        "UNION",
        "UNIQUE",
        "USER",
        "USING",
        "VARIADIC",
        "VERBOSE",
        "WHEN",
        "WHERE",
        "WINDOW",
        "WITH"
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
        "abbrev",
        "abs",
        "acldefault",
        "aclexplode",
        "acos",
        "acosd",
        "acosh",
        "age",
        "any",
        "area",
        "array_agg",
        "array_append",
        "array_cat",
        "array_dims",
        "array_fill",
        "array_length",
        "array_lower",
        "array_ndims",
        "array_position",
        "array_positions",
        "array_prepend",
        "array_remove",
        "array_replace",
        "array_to_json",
        "array_to_string",
        "array_to_tsvector",
        "array_upper",
        "ascii",
        "asin",
        "asind",
        "asinh",
        "atan",
        "atan2",
        "atan2d",
        "atand",
        "atanh",
        "avg",
        "bit",
        "bit_and",
        "bit_count",
        "bit_length",
        "bit_or",
        "bit_xor",
        "bool_and",
        "bool_or",
        "bound_box",
        "box",
        "brin_desummarize_range",
        "brin_summarize_new_values",
        "brin_summarize_range",
        "broadcast",
        "btrim",
        "cardinality",
        "cbrt",
        "ceil",
        "ceiling",
        "center",
        "char_length",
        "character_length",
        "chr",
        "circle",
        "clock_timestamp",
        "coalesce",
        "col_description",
        "concat",
        "concat_ws",
        "convert",
        "convert_from",
        "convert_to",
        "corr",
        "cos",
        "cosd",
        "cosh",
        "cot",
        "cotd",
        "count",
        "covar_pop",
        "covar_samp",
        "cume_dist",
        "current_catalog",
        "current_database",
        "current_date",
        "current_query",
        "current_role",
        "current_schema",
        "current_schemas",
        "current_setting",
        "current_time",
        "current_timestamp",
        "current_user",
        "currval",
        "cursor_to_xml",
        "cursor_to_xmlschema",
        "date_bin",
        "date_part",
        "date_trunc",
        "database_to_xml",
        "database_to_xml_and_xmlschema",
        "database_to_xmlschema",
        "decode",
        "degrees",
        "dense_rank",
        "diagonal",
        "diameter",
        "div",
        "encode",
        "enum_first",
        "enum_last",
        "enum_range",
        "every",
        "exp",
        "extract",
        "factorial",
        "family",
        "first_value",
        "floor",
        "format",
        "format_type",
        "gcd",
        "gen_random_uuid",
        "generate_series",
        "generate_subscripts",
        "get_bit",
        "get_byte",
        "get_current_ts_config",
        "gin_clean_pending_list",
        "greatest",
        "grouping",
        "has_any_column_privilege",
        "has_column_privilege",
        "has_database_privilege",
        "has_foreign_data_wrapper_privilege",
        "has_function_privilege",
        "has_language_privilege",
        "has_schema_privilege",
        "has_sequence_privilege",
        "has_server_privilege",
        "has_table_privilege",
        "has_tablespace_privilege",
        "has_type_privilege",
        "height",
        "host",
        "hostmask",
        "inet_client_addr",
        "inet_client_port",
        "inet_merge",
        "inet_same_family",
        "inet_server_addr",
        "inet_server_port",
        "initcap",
        "isclosed",
        "isempty",
        "isfinite",
        "isopen",
        "json_agg",
        "json_array_elements",
        "json_array_elements_text",
        "json_array_length",
        "json_build_array",
        "json_build_object",
        "json_each",
        "json_each_text",
        "json_extract_path",
        "json_extract_path_text",
        "json_object",
        "json_object_agg",
        "json_object_keys",
        "json_populate_record",
        "json_populate_recordset",
        "json_strip_nulls",
        "json_to_record",
        "json_to_recordset",
        "json_to_tsvector",
        "json_typeof",
        "jsonb_agg",
        "jsonb_array_elements",
        "jsonb_array_elements_text",
        "jsonb_array_length",
        "jsonb_build_array",
        "jsonb_build_object",
        "jsonb_each",
        "jsonb_each_text",
        "jsonb_extract_path",
        "jsonb_extract_path_text",
        "jsonb_insert",
        "jsonb_object",
        "jsonb_object_agg",
        "jsonb_object_keys",
        "jsonb_path_exists",
        "jsonb_path_match",
        "jsonb_path_query",
        "jsonb_path_query_array",
        "jsonb_path_exists_tz",
        "jsonb_path_query_first",
        "jsonb_path_query_array_tz",
        "jsonb_path_query_first_tz",
        "jsonb_path_query_tz",
        "jsonb_path_match_tz",
        "jsonb_populate_record",
        "jsonb_populate_recordset",
        "jsonb_pretty",
        "jsonb_set",
        "jsonb_set_lax",
        "jsonb_strip_nulls",
        "jsonb_to_record",
        "jsonb_to_recordset",
        "jsonb_to_tsvector",
        "jsonb_typeof",
        "justify_days",
        "justify_hours",
        "justify_interval",
        "lag",
        "last_value",
        "lastval",
        "lcm",
        "lead",
        "least",
        "left",
        "length",
        "line",
        "ln",
        "localtime",
        "localtimestamp",
        "log",
        "log10",
        "lower",
        "lower_inc",
        "lower_inf",
        "lpad",
        "lseg",
        "ltrim",
        "macaddr8_set7bit",
        "make_date",
        "make_interval",
        "make_time",
        "make_timestamp",
        "make_timestamptz",
        "makeaclitem",
        "masklen",
        "max",
        "md5",
        "min",
        "min_scale",
        "mod",
        "mode",
        "multirange",
        "netmask",
        "network",
        "nextval",
        "normalize",
        "now",
        "npoints",
        "nth_value",
        "ntile",
        "nullif",
        "num_nonnulls",
        "num_nulls",
        "numnode",
        "obj_description",
        "octet_length",
        "overlay",
        "parse_ident",
        "path",
        "pclose",
        "percent_rank",
        "percentile_cont",
        "percentile_disc",
        "pg_advisory_lock",
        "pg_advisory_lock_shared",
        "pg_advisory_unlock",
        "pg_advisory_unlock_all",
        "pg_advisory_unlock_shared",
        "pg_advisory_xact_lock",
        "pg_advisory_xact_lock_shared",
        "pg_backend_pid",
        "pg_backup_start_time",
        "pg_blocking_pids",
        "pg_cancel_backend",
        "pg_client_encoding",
        "pg_collation_actual_version",
        "pg_collation_is_visible",
        "pg_column_compression",
        "pg_column_size",
        "pg_conf_load_time",
        "pg_control_checkpoint",
        "pg_control_init",
        "pg_control_recovery",
        "pg_control_system",
        "pg_conversion_is_visible",
        "pg_copy_logical_replication_slot",
        "pg_copy_physical_replication_slot",
        "pg_create_logical_replication_slot",
        "pg_create_physical_replication_slot",
        "pg_create_restore_point",
        "pg_current_logfile",
        "pg_current_snapshot",
        "pg_current_wal_flush_lsn",
        "pg_current_wal_insert_lsn",
        "pg_current_wal_lsn",
        "pg_current_xact_id",
        "pg_current_xact_id_if_assigned",
        "pg_current_xlog_flush_location",
        "pg_current_xlog_insert_location",
        "pg_current_xlog_location",
        "pg_database_size",
        "pg_describe_object",
        "pg_drop_replication_slot",
        "pg_event_trigger_ddl_commands",
        "pg_event_trigger_dropped_objects",
        "pg_event_trigger_table_rewrite_oid",
        "pg_event_trigger_table_rewrite_reason",
        "pg_export_snapshot",
        "pg_filenode_relation",
        "pg_function_is_visible",
        "pg_get_catalog_foreign_keys",
        "pg_get_constraintdef",
        "pg_get_expr",
        "pg_get_function_arguments",
        "pg_get_function_identity_arguments",
        "pg_get_function_result",
        "pg_get_functiondef",
        "pg_get_indexdef",
        "pg_get_keywords",
        "pg_get_object_address",
        "pg_get_owned_sequence",
        "pg_get_ruledef",
        "pg_get_serial_sequence",
        "pg_get_statisticsobjdef",
        "pg_get_triggerdef",
        "pg_get_userbyid",
        "pg_get_viewdef",
        "pg_get_wal_replay_pause_state",
        "pg_has_role",
        "pg_identify_object",
        "pg_identify_object_as_address",
        "pg_import_system_collations",
        "pg_index_column_has_property",
        "pg_index_has_property",
        "pg_indexam_has_property",
        "pg_indexes_size",
        "pg_is_in_backup",
        "pg_is_in_recovery",
        "pg_is_other_temp_schema",
        "pg_is_wal_replay_paused",
        "pg_is_xlog_replay_paused",
        "pg_jit_available",
        "pg_last_committed_xact",
        "pg_last_wal_receive_lsn",
        "pg_last_wal_replay_lsn",
        "pg_last_xact_replay_timestamp",
        "pg_last_xlog_receive_location",
        "pg_last_xlog_replay_location",
        "pg_listening_channels",
        "pg_log_backend_memory_contexts",
        "pg_logical_emit_message",
        "pg_logical_slot_get_binary_changes",
        "pg_logical_slot_get_changes",
        "pg_logical_slot_peek_binary_changes",
        "pg_logical_slot_peek_changes",
        "pg_ls_archive_statusdir",
        "pg_ls_dir",
        "pg_ls_logdir",
        "pg_ls_tmpdir",
        "pg_ls_waldir",
        "pg_mcv_list_items",
        "pg_my_temp_schema",
        "pg_notification_queue_usage",
        "pg_opclass_is_visible",
        "pg_operator_is_visible",
        "pg_opfamily_is_visible",
        "pg_options_to_table",
        "pg_partition_ancestors",
        "pg_partition_root",
        "pg_partition_tree",
        "pg_postmaster_start_time",
        "pg_promote",
        "pg_read_binary_file",
        "pg_read_file",
        "pg_relation_filenode",
        "pg_relation_filepath",
        "pg_relation_size",
        "pg_reload_conf",
        "pg_replication_origin_advance",
        "pg_replication_origin_create",
        "pg_replication_origin_drop",
        "pg_replication_origin_oid",
        "pg_replication_origin_progress",
        "pg_replication_origin_session_is_setup",
        "pg_replication_origin_session_progress",
        "pg_replication_origin_session_reset",
        "pg_replication_origin_session_setup",
        "pg_replication_origin_xact_reset",
        "pg_replication_origin_xact_setup",
        "pg_replication_slot_advance",
        "pg_rotate_logfile",
        "pg_safe_snapshot_blocking_pids",
        "pg_size_bytes",
        "pg_size_pretty",
        "pg_sleep",
        "pg_sleep_for",
        "pg_sleep_until",
        "pg_snapshot_xip",
        "pg_snapshot_xmax",
        "pg_snapshot_xmin",
        "pg_start_backup",
        "pg_stat_file",
        "pg_statistics_obj_is_visible",
        "pg_stop_backup",
        "pg_switch_wal",
        "pg_switch_xlog",
        "pg_table_is_visible",
        "pg_table_size",
        "pg_tablespace_databases",
        "pg_tablespace_location",
        "pg_tablespace_size",
        "pg_terminate_backend",
        "pg_total_relation_size",
        "pg_trigger_depth",
        "pg_try_advisory_lock",
        "pg_try_advisory_lock_shared",
        "pg_try_advisory_xact_lock",
        "pg_try_advisory_xact_lock_shared",
        "pg_ts_config_is_visible",
        "pg_ts_dict_is_visible",
        "pg_ts_parser_is_visible",
        "pg_ts_template_is_visible",
        "pg_type_is_visible",
        "pg_typeof",
        "pg_visible_in_snapshot",
        "pg_wal_lsn_diff",
        "pg_wal_replay_pause",
        "pg_wal_replay_resume",
        "pg_walfile_name",
        "pg_walfile_name_offset",
        "pg_xact_commit_timestamp",
        "pg_xact_commit_timestamp_origin",
        "pg_xact_status",
        "pg_xlog_location_diff",
        "pg_xlog_replay_pause",
        "pg_xlog_replay_resume",
        "pg_xlogfile_name",
        "pg_xlogfile_name_offset",
        "phraseto_tsquery",
        "pi",
        "plainto_tsquery",
        "point",
        "polygon",
        "popen",
        "position",
        "power",
        "pqserverversion",
        "query_to_xml",
        "query_to_xml_and_xmlschema",
        "query_to_xmlschema",
        "querytree",
        "quote_ident",
        "quote_literal",
        "quote_nullable",
        "radians",
        "radius",
        "random",
        "range_agg",
        "range_intersect_agg",
        "range_merge",
        "rank",
        "regexp_match",
        "regexp_matches",
        "regexp_replace",
        "regexp_split_to_array",
        "regexp_split_to_table",
        "regr_avgx",
        "regr_avgy",
        "regr_count",
        "regr_intercept",
        "regr_r2",
        "regr_slope",
        "regr_sxx",
        "regr_sxy",
        "regr_syy",
        "repeat",
        "replace",
        "reverse",
        "right",
        "round",
        "row_number",
        "row_security_active",
        "row_to_json",
        "rpad",
        "rtrim",
        "scale",
        "schema_to_xml",
        "schema_to_xml_and_xmlschema",
        "schema_to_xmlschema",
        "session_user",
        "set_bit",
        "set_byte",
        "set_config",
        "set_masklen",
        "setseed",
        "setval",
        "setweight",
        "sha224",
        "sha256",
        "sha384",
        "sha512",
        "shobj_description",
        "sign",
        "sin",
        "sind",
        "sinh",
        "slope",
        "split_part",
        "sprintf",
        "sqrt",
        "starts_with",
        "statement_timestamp",
        "stddev",
        "stddev_pop",
        "stddev_samp",
        "string_agg",
        "string_to_array",
        "string_to_table",
        "strip",
        "strpos",
        "substr",
        "substring",
        "sum",
        "suppress_redundant_updates_trigger",
        "table_to_xml",
        "table_to_xml_and_xmlschema",
        "table_to_xmlschema",
        "tan",
        "tand",
        "tanh",
        "text",
        "timeofday",
        "timezone",
        "to_ascii",
        "to_char",
        "to_date",
        "to_hex",
        "to_json",
        "to_number",
        "to_regclass",
        "to_regcollation",
        "to_regnamespace",
        "to_regoper",
        "to_regoperator",
        "to_regproc",
        "to_regprocedure",
        "to_regrole",
        "to_regtype",
        "to_timestamp",
        "to_tsquery",
        "to_tsvector",
        "transaction_timestamp",
        "translate",
        "trim",
        "trim_array",
        "trim_scale",
        "trunc",
        "ts_debug",
        "ts_delete",
        "ts_filter",
        "ts_headline",
        "ts_lexize",
        "ts_parse",
        "ts_rank",
        "ts_rank_cd",
        "ts_rewrite",
        "ts_stat",
        "ts_token_type",
        "tsquery_phrase",
        "tsvector_to_array",
        "tsvector_update_trigger",
        "tsvector_update_trigger_column",
        "txid_current",
        "txid_current_if_assigned",
        "txid_current_snapshot",
        "txid_snapshot_xip",
        "txid_snapshot_xmax",
        "txid_snapshot_xmin",
        "txid_status",
        "txid_visible_in_snapshot",
        "unistr",
        "unnest",
        "upper",
        "upper_inc",
        "upper_inf",
        "user",
        "var_pop",
        "var_samp",
        "variance",
        "version",
        "websearch_to_tsquery",
        "width",
        "width_bucket",
        "xml_is_well_formed",
        "xml_is_well_formed_content",
        "xml_is_well_formed_document",
        "xmlagg",
        "xmlcomment",
        "xmlconcat",
        "xmlelement",
        "xmlexists",
        "xmlforest",
        "xmlparse",
        "xmlpi",
        "xmlroot",
        "xmlserialize",
        "xpath",
        "xpath_exists"
    ],
    builtinVariables: [],
    pseudoColumns: [],
    tokenizer: {
        root: [
            {
                include: "@comments"
            },
            {
                include: "@whitespace"
            },
            {
                include: "@pseudoColumns"
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
                /[\w@#$]+/,
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
        pseudoColumns: [
            [
                /[$][A-Za-z_][\w@#$]*/,
                {
                    cases: {
                        "@pseudoColumns": "predefined",
                        "@default": "identifier"
                    }
                }
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
        complexIdentifiers: [
            [
                /"/,
                {
                    token: "identifier.quote",
                    next: "@quotedIdentifier"
                }
            ]
        ],
        quotedIdentifier: [
            [
                /[^"]+/,
                "identifier"
            ],
            [
                /""/,
                "identifier"
            ],
            [
                /"/,
                {
                    token: "identifier.quote",
                    next: "@pop"
                }
            ]
        ],
        scopes: []
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}]},["3KdpB"], null, "parcelRequire4f3a")

//# sourceMappingURL=pgsql.62175edc.js.map
