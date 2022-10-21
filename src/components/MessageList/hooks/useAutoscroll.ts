import {
  MutableRefObject,
  UIEventHandler,
  useCallback,
  useContext,
  useEffect,
  useRef
} from 'react'
import {
  ActivateAutoscrollAction,
  ChatReadyAction,
  DeactivateAutoscrollAction
} from '../../../Actions'
import { DispatchContext } from '../../../App'
import { VirtualizationContext } from '../../VirtualizationProvider'

type ScrollContainerRef = MutableRefObject<HTMLOListElement>;
type ScrollHandler = UIEventHandler<HTMLOListElement>;

export const useAutoscroll = (
  autoscrollChat: boolean
): [ScrollContainerRef, ScrollHandler] => {
  const [{ viewportScrollHeight, viewportScrollTop }, virtualizaitonDispatch] =
    useContext(VirtualizationContext)
  const dispatch = useContext(DispatchContext)
  const scrollContainerRef = useRef<HTMLOListElement>()

  const viewportScrollHeightRef = useRef(viewportScrollHeight)
  viewportScrollHeightRef.current = viewportScrollHeight

  const viewportScrollTopRef = useRef(viewportScrollTop)
  viewportScrollTopRef.current = viewportScrollTop

  useEffect(() => {
    if (!(autoscrollChat && scrollContainerRef.current)) {
      return
    }

    // can't use `scrollIntoView` or `scrollTo` here because those cause the
    // scrollHander (below) to fire which then deactivates autoscroll ... I sort
    // of got it working where it'd deactivate and then reactivate at the end of
    // the scroll animation, but if a second message comes through mid-
    // autoscroll it breaks down
    scrollContainerRef.current.scrollTop =
      scrollContainerRef.current.scrollHeight
  })

  useEffect(() => {
    if (!scrollContainerRef.current) {
      return
    }

    virtualizaitonDispatch({
      type: 'setViewportScrollHeight',
      payload: 0
    })

    dispatch(ChatReadyAction())
  }, [virtualizaitonDispatch])

  const scrollHandler = useCallback<ScrollHandler>(
    ({ currentTarget }) => {
      const { clientHeight, scrollTop, scrollHeight } = currentTarget

      /**
       * enable/disable "autoscroll" which is, scroll to the end of the
       * viewport's scroll height as messages come in
       */
      const isScrolledToBottom =
        scrollHeight <=
        // not exactly sure why, but sometime's there's an extra half-pixel
        Math.floor(scrollTop + clientHeight + 1)

      if (isScrolledToBottom && !autoscrollChat) {
        dispatch(ActivateAutoscrollAction())
      } else if (!isScrolledToBottom && autoscrollChat) {
        dispatch(DeactivateAutoscrollAction())
      }

      /**
       * track scroll position, we use this to not render message items as they
       * enter or leave the viewport
       */
      virtualizaitonDispatch({
        type: 'setViewportScrollTop',
        payload: Math.max(scrollTop)
      })
    },
    [autoscrollChat, dispatch, virtualizaitonDispatch]
  )

  return [scrollContainerRef, scrollHandler]
}
