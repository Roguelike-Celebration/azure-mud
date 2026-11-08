/**
 * Loosely adapted to TS from Solute Labs, slightly updated to use the "Thunk
 * API" from redux-thunk
 *
 * @see https://www.solutelabs.com/blog/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-use-reducer-hook
 * @see https://github.com/reduxjs/redux-thunk
 */
import { Reducer, useLayoutEffect, useReducer, useRef } from 'react'

export type ThunkDispatch<A, S> = (action: A | Thunk<A, S>) => void
type GetState<S> = () => S
export type Thunk<A, S> = (
  dispatch: ThunkDispatch<A, S>,
  getState: GetState<S>
) => void

const isFunction = <A, S>(a: A | Thunk<A, S>): a is Thunk<A, S> =>
  typeof a === 'function'

export function useReducerWithThunk<A, S> (
  reducer: Reducer<S, A>,
  initialState: S
): [S, ThunkDispatch<A, S>] {
  const [state, dispatch] = useReducer(reducer, initialState)

  const stateRef = useRef(state)
  useLayoutEffect(() => {
    stateRef.current = state
  })
  const thunkDispatch = (action: A | Thunk<A, S>) => {
    if (isFunction(action)) {
      action(thunkDispatch, () => stateRef.current)
    } else {
      dispatch(action)
    }
  }
  return [state, thunkDispatch]
}
