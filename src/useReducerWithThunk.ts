// Loosely adapted to TS from
// https://blog.solutelabs.com/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812
import { useReducer } from 'react'

export type ThunkDispatch<A, S> = (action: A | Thunk<A, S>) => void;
type Thunk<A, S> = (dispatch: ThunkDispatch<A, S>) => void;

export function useReducerWithThunk<A, S> (
  reducer,
  initialState: S
): [S, ThunkDispatch<A, S>] {
  const [state, dispatch] = useReducer<(state: S, action: A) => S>(
    reducer,
  initialState
  )

  const customDispatch = (action: A | Thunk<A, S>) => {
    // This custom type guard shouldn't be needed in favor of just an inline
    // typeof === "function" check, but I'm getting unexpected type errors.
    const isFunction = (a: A | Thunk<A, S>): a is Thunk<A, S> => {
      return typeof a === 'function'
    }

    if (isFunction(action)) {
      action(customDispatch)
    } else {
      dispatch(action)
    }
  }
  return [state, customDispatch]
}
