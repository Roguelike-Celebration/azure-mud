import { current, produce } from 'immer'
import React, {
  createContext,
  Dispatch,
  FC,
  Reducer,
  ReducerAction,
  ReducerState,
  StrictMode,
  useReducer
} from 'react'
import '../../../style/chat.css'
import { Message } from '../../message'
import { PayloadAction } from '../../types'

type VerticalPosition = Pick<Message, 'id'> & Pick<DOMRect, 'top' | 'height'>;

interface VirtualizationState {
  messagePositions: Record<string, VerticalPosition>;
  viewportScrollHeight: number;
  viewportScrollTop: number;
}

type SetMessagePositionAction = PayloadAction<
  'setMessagePosition',
  VerticalPosition
>;
type SetViewportScrollHeightAction = PayloadAction<
  'setViewportScrollHeight',
  number
>;
type SetViewportScrollTopAction = PayloadAction<'setViewportScrollTop', number>;

type VirtualizationAction =
  | SetMessagePositionAction
  | SetViewportScrollHeightAction
  | SetViewportScrollTopAction;

type VirtualizationReducer = Reducer<VirtualizationState, VirtualizationAction>;

const initialState: VirtualizationState = {
  messagePositions: {},
  viewportScrollHeight: 0,
  viewportScrollTop: 0
}

const reducer: VirtualizationReducer = produce((state, action) => {
  switch (action.type) {
    case 'setMessagePosition':
      state.messagePositions[action.payload.id] = action.payload
      state.viewportScrollHeight += action.payload.height
      break

    case 'setViewportScrollHeight':
      state.viewportScrollHeight = action.payload
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

  return (
    <StrictMode>
      <Provider value={[state, dispatch]}>{children}</Provider>
    </StrictMode>
  )
}
