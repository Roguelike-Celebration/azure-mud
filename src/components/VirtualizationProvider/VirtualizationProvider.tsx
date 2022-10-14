import { produce } from 'immer'
import React, {
  createContext,
  Dispatch,
  FC,
  Reducer,
  ReducerAction,
  ReducerState,
  useReducer
} from 'react'
import '../../../style/chat.css'
import { Message } from '../../message'
import { EntityState, PayloadAction } from '../../types'

type VerticalPosition = Pick<Message, 'id'> & Pick<DOMRect, 'top' | 'height'>;

interface VirtualizationState {
  positions: EntityState<VerticalPosition>;
  viewportClientHeight: number;
  viewportScrollTop: number;
}

type SetVerticalPositionAction = PayloadAction<
  'setVerticalPosition',
  VerticalPosition
>;
type SetViewportClientHeightAction = PayloadAction<
  'setViewportClientHeight',
  number
>;
type SetViewportScrollTopAction = PayloadAction<'setViewportScrollTop', number>;

type VirtualizationAction =
  | SetVerticalPositionAction
  | SetViewportClientHeightAction
  | SetViewportScrollTopAction;

type VirtualizationReducer = Reducer<VirtualizationState, VirtualizationAction>;

const initialState: VirtualizationState = {
  positions: {
    entities: {},
    ids: []
  },
  viewportClientHeight: 0,
  viewportScrollTop: 0
}

const reducer: VirtualizationReducer = produce((state, action) => {
  switch (action.type) {
    case 'setVerticalPosition':
      state.positions.entities[action.payload.id] = action.payload
      state.positions.ids.push(action.payload.id)
      break

    case 'setViewportClientHeight':
      state.viewportClientHeight = action.payload
      break

    case 'setViewportScrollTop':
      state.viewportScrollTop = action.payload
      break
  }
})

export const VirtualizationContext = createContext<
  [
    ReducerState<VirtualizationReducer>,
    Dispatch<ReducerAction<VirtualizationReducer>>
  ]
>([initialState, () => {}])
const { Provider } = VirtualizationContext

export const VirtualizationProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <Provider value={[state, dispatch]}>{children}</Provider>
}
