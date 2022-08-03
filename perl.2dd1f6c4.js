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
})({"5sWYI":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "2014a7dc2de8fe1b51ac10372dd1f6c4"; // @flow
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

},{}],"2hQTM":[function(require,module,exports) {
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
 *-----------------------------------------------------------------------------*/ // src/basic-languages/perl/perl.ts
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
        },
        {
            open: "`",
            close: "`"
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
            open: "`",
            close: "`"
        }
    ]
};
var language = {
    defaultToken: "",
    tokenPostfix: ".perl",
    brackets: [
        {
            token: "delimiter.bracket",
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
        "__DATA__",
        "else",
        "lock",
        "__END__",
        "elsif",
        "lt",
        "__FILE__",
        "eq",
        "__LINE__",
        "exp",
        "ne",
        "sub",
        "__PACKAGE__",
        "for",
        "no",
        "and",
        "foreach",
        "or",
        "unless",
        "cmp",
        "ge",
        "package",
        "until",
        "continue",
        "gt",
        "while",
        "CORE",
        "if",
        "xor",
        "do",
        "le",
        "__DIE__",
        "__WARN__"
    ],
    builtinFunctions: [
        "-A",
        "END",
        "length",
        "setpgrp",
        "-B",
        "endgrent",
        "link",
        "setpriority",
        "-b",
        "endhostent",
        "listen",
        "setprotoent",
        "-C",
        "endnetent",
        "local",
        "setpwent",
        "-c",
        "endprotoent",
        "localtime",
        "setservent",
        "-d",
        "endpwent",
        "log",
        "setsockopt",
        "-e",
        "endservent",
        "lstat",
        "shift",
        "-f",
        "eof",
        "map",
        "shmctl",
        "-g",
        "eval",
        "mkdir",
        "shmget",
        "-k",
        "exec",
        "msgctl",
        "shmread",
        "-l",
        "exists",
        "msgget",
        "shmwrite",
        "-M",
        "exit",
        "msgrcv",
        "shutdown",
        "-O",
        "fcntl",
        "msgsnd",
        "sin",
        "-o",
        "fileno",
        "my",
        "sleep",
        "-p",
        "flock",
        "next",
        "socket",
        "-r",
        "fork",
        "not",
        "socketpair",
        "-R",
        "format",
        "oct",
        "sort",
        "-S",
        "formline",
        "open",
        "splice",
        "-s",
        "getc",
        "opendir",
        "split",
        "-T",
        "getgrent",
        "ord",
        "sprintf",
        "-t",
        "getgrgid",
        "our",
        "sqrt",
        "-u",
        "getgrnam",
        "pack",
        "srand",
        "-w",
        "gethostbyaddr",
        "pipe",
        "stat",
        "-W",
        "gethostbyname",
        "pop",
        "state",
        "-X",
        "gethostent",
        "pos",
        "study",
        "-x",
        "getlogin",
        "print",
        "substr",
        "-z",
        "getnetbyaddr",
        "printf",
        "symlink",
        "abs",
        "getnetbyname",
        "prototype",
        "syscall",
        "accept",
        "getnetent",
        "push",
        "sysopen",
        "alarm",
        "getpeername",
        "quotemeta",
        "sysread",
        "atan2",
        "getpgrp",
        "rand",
        "sysseek",
        "AUTOLOAD",
        "getppid",
        "read",
        "system",
        "BEGIN",
        "getpriority",
        "readdir",
        "syswrite",
        "bind",
        "getprotobyname",
        "readline",
        "tell",
        "binmode",
        "getprotobynumber",
        "readlink",
        "telldir",
        "bless",
        "getprotoent",
        "readpipe",
        "tie",
        "break",
        "getpwent",
        "recv",
        "tied",
        "caller",
        "getpwnam",
        "redo",
        "time",
        "chdir",
        "getpwuid",
        "ref",
        "times",
        "CHECK",
        "getservbyname",
        "rename",
        "truncate",
        "chmod",
        "getservbyport",
        "require",
        "uc",
        "chomp",
        "getservent",
        "reset",
        "ucfirst",
        "chop",
        "getsockname",
        "return",
        "umask",
        "chown",
        "getsockopt",
        "reverse",
        "undef",
        "chr",
        "glob",
        "rewinddir",
        "UNITCHECK",
        "chroot",
        "gmtime",
        "rindex",
        "unlink",
        "close",
        "goto",
        "rmdir",
        "unpack",
        "closedir",
        "grep",
        "say",
        "unshift",
        "connect",
        "hex",
        "scalar",
        "untie",
        "cos",
        "index",
        "seek",
        "use",
        "crypt",
        "INIT",
        "seekdir",
        "utime",
        "dbmclose",
        "int",
        "select",
        "values",
        "dbmopen",
        "ioctl",
        "semctl",
        "vec",
        "defined",
        "join",
        "semget",
        "wait",
        "delete",
        "keys",
        "semop",
        "waitpid",
        "DESTROY",
        "kill",
        "send",
        "wantarray",
        "die",
        "last",
        "setgrent",
        "warn",
        "dump",
        "lc",
        "sethostent",
        "write",
        "each",
        "lcfirst",
        "setnetent"
    ],
    builtinFileHandlers: [
        "ARGV",
        "STDERR",
        "STDOUT",
        "ARGVOUT",
        "STDIN",
        "ENV"
    ],
    builtinVariables: [
        "$!",
        "$^RE_TRIE_MAXBUF",
        "$LAST_REGEXP_CODE_RESULT",
        '$"',
        "$^S",
        "$LIST_SEPARATOR",
        "$#",
        "$^T",
        "$MATCH",
        "$$",
        "$^TAINT",
        "$MULTILINE_MATCHING",
        "$%",
        "$^UNICODE",
        "$NR",
        "$&",
        "$^UTF8LOCALE",
        "$OFMT",
        "$'",
        "$^V",
        "$OFS",
        "$(",
        "$^W",
        "$ORS",
        "$)",
        "$^WARNING_BITS",
        "$OS_ERROR",
        "$*",
        "$^WIDE_SYSTEM_CALLS",
        "$OSNAME",
        "$+",
        "$^X",
        "$OUTPUT_AUTO_FLUSH",
        "$,",
        "$_",
        "$OUTPUT_FIELD_SEPARATOR",
        "$-",
        "$`",
        "$OUTPUT_RECORD_SEPARATOR",
        "$.",
        "$a",
        "$PERL_VERSION",
        "$/",
        "$ACCUMULATOR",
        "$PERLDB",
        "$0",
        "$ARG",
        "$PID",
        "$:",
        "$ARGV",
        "$POSTMATCH",
        "$;",
        "$b",
        "$PREMATCH",
        "$<",
        "$BASETIME",
        "$PROCESS_ID",
        "$=",
        "$CHILD_ERROR",
        "$PROGRAM_NAME",
        "$>",
        "$COMPILING",
        "$REAL_GROUP_ID",
        "$?",
        "$DEBUGGING",
        "$REAL_USER_ID",
        "$@",
        "$EFFECTIVE_GROUP_ID",
        "$RS",
        "$[",
        "$EFFECTIVE_USER_ID",
        "$SUBSCRIPT_SEPARATOR",
        "$\\",
        "$EGID",
        "$SUBSEP",
        "$]",
        "$ERRNO",
        "$SYSTEM_FD_MAX",
        "$^",
        "$EUID",
        "$UID",
        "$^A",
        "$EVAL_ERROR",
        "$WARNING",
        "$^C",
        "$EXCEPTIONS_BEING_CAUGHT",
        "$|",
        "$^CHILD_ERROR_NATIVE",
        "$EXECUTABLE_NAME",
        "$~",
        "$^D",
        "$EXTENDED_OS_ERROR",
        "%!",
        "$^E",
        "$FORMAT_FORMFEED",
        "%^H",
        "$^ENCODING",
        "$FORMAT_LINE_BREAK_CHARACTERS",
        "%ENV",
        "$^F",
        "$FORMAT_LINES_LEFT",
        "%INC",
        "$^H",
        "$FORMAT_LINES_PER_PAGE",
        "%OVERLOAD",
        "$^I",
        "$FORMAT_NAME",
        "%SIG",
        "$^L",
        "$FORMAT_PAGE_NUMBER",
        "@+",
        "$^M",
        "$FORMAT_TOP_NAME",
        "@-",
        "$^N",
        "$GID",
        "@_",
        "$^O",
        "$INPLACE_EDIT",
        "@ARGV",
        "$^OPEN",
        "$INPUT_LINE_NUMBER",
        "@INC",
        "$^P",
        "$INPUT_RECORD_SEPARATOR",
        "@LAST_MATCH_START",
        "$^R",
        "$LAST_MATCH_END",
        "$^RE_DEBUG_FLAGS",
        "$LAST_PAREN_MATCH"
    ],
    symbols: /[:+\-\^*$&%@=<>!?|\/~\.]/,
    quoteLikeOps: [
        "qr",
        "m",
        "s",
        "q",
        "qq",
        "qx",
        "qw",
        "tr",
        "y"
    ],
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    tokenizer: {
        root: [
            {
                include: "@whitespace"
            },
            [
                /[a-zA-Z\-_][\w\-_]*/,
                {
                    cases: {
                        "@keywords": "keyword",
                        "@builtinFunctions": "type.identifier",
                        "@builtinFileHandlers": "variable.predefined",
                        "@quoteLikeOps": {
                            token: "@rematch",
                            next: "quotedConstructs"
                        },
                        "@default": ""
                    }
                }
            ],
            [
                /[\$@%][*@#?\+\-\$!\w\\\^><~:;\.]+/,
                {
                    cases: {
                        "@builtinVariables": "variable.predefined",
                        "@default": "variable"
                    }
                }
            ],
            {
                include: "@strings"
            },
            {
                include: "@dblStrings"
            },
            {
                include: "@perldoc"
            },
            {
                include: "@heredoc"
            },
            [
                /[{}\[\]()]/,
                "@brackets"
            ],
            [
                /[\/](?:(?:\[(?:\\]|[^\]])+\])|(?:\\\/|[^\]\/]))*[\/]\w*\s*(?=[).,;]|$)/,
                "regexp"
            ],
            [
                /@symbols/,
                "operators"
            ],
            {
                include: "@numbers"
            },
            [
                /[,;]/,
                "delimiter"
            ]
        ],
        whitespace: [
            [
                /\s+/,
                "white"
            ],
            [
                /(^#!.*$)/,
                "metatag"
            ],
            [
                /(^#.*$)/,
                "comment"
            ]
        ],
        numbers: [
            [
                /\d*\.\d+([eE][\-+]?\d+)?/,
                "number.float"
            ],
            [
                /0[xX][0-9a-fA-F_]*[0-9a-fA-F]/,
                "number.hex"
            ],
            [
                /\d+/,
                "number"
            ]
        ],
        strings: [
            [
                /'/,
                "string",
                "@stringBody"
            ]
        ],
        stringBody: [
            [
                /'/,
                "string",
                "@popall"
            ],
            [
                /\\'/,
                "string.escape"
            ],
            [
                /./,
                "string"
            ]
        ],
        dblStrings: [
            [
                /"/,
                "string",
                "@dblStringBody"
            ]
        ],
        dblStringBody: [
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
                /\\./,
                "string.escape.invalid"
            ],
            {
                include: "@variables"
            },
            [
                /./,
                "string"
            ]
        ],
        quotedConstructs: [
            [
                /(q|qw|tr|y)\s*\(/,
                {
                    token: "string.delim",
                    switchTo: "@qstring.(.)"
                }
            ],
            [
                /(q|qw|tr|y)\s*\[/,
                {
                    token: "string.delim",
                    switchTo: "@qstring.[.]"
                }
            ],
            [
                /(q|qw|tr|y)\s*\{/,
                {
                    token: "string.delim",
                    switchTo: "@qstring.{.}"
                }
            ],
            [
                /(q|qw|tr|y)\s*</,
                {
                    token: "string.delim",
                    switchTo: "@qstring.<.>"
                }
            ],
            [
                /(q|qw|tr|y)#/,
                {
                    token: "string.delim",
                    switchTo: "@qstring.#.#"
                }
            ],
            [
                /(q|qw|tr|y)\s*([^A-Za-z0-9#\s])/,
                {
                    token: "string.delim",
                    switchTo: "@qstring.$2.$2"
                }
            ],
            [
                /(q|qw|tr|y)\s+(\w)/,
                {
                    token: "string.delim",
                    switchTo: "@qstring.$2.$2"
                }
            ],
            [
                /(qr|m|s)\s*\(/,
                {
                    token: "regexp.delim",
                    switchTo: "@qregexp.(.)"
                }
            ],
            [
                /(qr|m|s)\s*\[/,
                {
                    token: "regexp.delim",
                    switchTo: "@qregexp.[.]"
                }
            ],
            [
                /(qr|m|s)\s*\{/,
                {
                    token: "regexp.delim",
                    switchTo: "@qregexp.{.}"
                }
            ],
            [
                /(qr|m|s)\s*</,
                {
                    token: "regexp.delim",
                    switchTo: "@qregexp.<.>"
                }
            ],
            [
                /(qr|m|s)#/,
                {
                    token: "regexp.delim",
                    switchTo: "@qregexp.#.#"
                }
            ],
            [
                /(qr|m|s)\s*([^A-Za-z0-9_#\s])/,
                {
                    token: "regexp.delim",
                    switchTo: "@qregexp.$2.$2"
                }
            ],
            [
                /(qr|m|s)\s+(\w)/,
                {
                    token: "regexp.delim",
                    switchTo: "@qregexp.$2.$2"
                }
            ],
            [
                /(qq|qx)\s*\(/,
                {
                    token: "string.delim",
                    switchTo: "@qqstring.(.)"
                }
            ],
            [
                /(qq|qx)\s*\[/,
                {
                    token: "string.delim",
                    switchTo: "@qqstring.[.]"
                }
            ],
            [
                /(qq|qx)\s*\{/,
                {
                    token: "string.delim",
                    switchTo: "@qqstring.{.}"
                }
            ],
            [
                /(qq|qx)\s*</,
                {
                    token: "string.delim",
                    switchTo: "@qqstring.<.>"
                }
            ],
            [
                /(qq|qx)#/,
                {
                    token: "string.delim",
                    switchTo: "@qqstring.#.#"
                }
            ],
            [
                /(qq|qx)\s*([^A-Za-z0-9#\s])/,
                {
                    token: "string.delim",
                    switchTo: "@qqstring.$2.$2"
                }
            ],
            [
                /(qq|qx)\s+(\w)/,
                {
                    token: "string.delim",
                    switchTo: "@qqstring.$2.$2"
                }
            ]
        ],
        qstring: [
            [
                /\\./,
                "string.escape"
            ],
            [
                /./,
                {
                    cases: {
                        "$#==$S3": {
                            token: "string.delim",
                            next: "@pop"
                        },
                        "$#==$S2": {
                            token: "string.delim",
                            next: "@push"
                        },
                        "@default": "string"
                    }
                }
            ]
        ],
        qregexp: [
            {
                include: "@variables"
            },
            [
                /\\./,
                "regexp.escape"
            ],
            [
                /./,
                {
                    cases: {
                        "$#==$S3": {
                            token: "regexp.delim",
                            next: "@regexpModifiers"
                        },
                        "$#==$S2": {
                            token: "regexp.delim",
                            next: "@push"
                        },
                        "@default": "regexp"
                    }
                }
            ]
        ],
        regexpModifiers: [
            [
                /[msixpodualngcer]+/,
                {
                    token: "regexp.modifier",
                    next: "@popall"
                }
            ]
        ],
        qqstring: [
            {
                include: "@variables"
            },
            {
                include: "@qstring"
            }
        ],
        heredoc: [
            [
                /<<\s*['"`]?([\w\-]+)['"`]?/,
                {
                    token: "string.heredoc.delimiter",
                    next: "@heredocBody.$1"
                }
            ]
        ],
        heredocBody: [
            [
                /^([\w\-]+)$/,
                {
                    cases: {
                        "$1==$S2": [
                            {
                                token: "string.heredoc.delimiter",
                                next: "@popall"
                            }
                        ],
                        "@default": "string.heredoc"
                    }
                }
            ],
            [
                /./,
                "string.heredoc"
            ]
        ],
        perldoc: [
            [
                /^=\w/,
                "comment.doc",
                "@perldocBody"
            ]
        ],
        perldocBody: [
            [
                /^=cut\b/,
                "type.identifier",
                "@popall"
            ],
            [
                /./,
                "comment.doc"
            ]
        ],
        variables: [
            [
                /\$\w+/,
                "variable"
            ],
            [
                /@\w+/,
                "variable"
            ],
            [
                /%\w+/,
                "variable"
            ]
        ]
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"367CR"}]},["5sWYI"], null, "parcelRequire4f3a")

//# sourceMappingURL=perl.2dd1f6c4.js.map
