"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReducerWithThunk = void 0;
// Loosely adapted to TS from
// https://blog.solutelabs.com/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812
var react_1 = require("react");
function useReducerWithThunk(reducer, initialState) {
    var _a = react_1.useReducer(reducer, initialState), state = _a[0], dispatch = _a[1];
    var customDispatch = function (action) {
        // This custom type guard shouldn't be needed in favor of just an inline
        // typeof === "function" check, but I'm getting unexpected type errors.
        var isFunction = function (a) {
            return typeof a === "function";
        };
        if (isFunction(action)) {
            action(customDispatch);
        }
        else {
            dispatch(action);
        }
    };
    return [state, customDispatch];
}
exports.useReducerWithThunk = useReducerWithThunk;
