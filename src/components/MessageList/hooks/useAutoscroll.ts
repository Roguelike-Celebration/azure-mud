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
  DeactivateAutoscrollAction
} from '../../../Actions'
import { DispatchContext } from '../../../App'

type ScrollContainerRef = MutableRefObject<HTMLOListElement>;
type ScrollHandler = UIEventHandler<HTMLOListElement>;

export const useAutoscroll = (
  autoscrollChat: boolean
): [ScrollContainerRef, ScrollHandler] => {
  const dispatch = useContext(DispatchContext)
  const scrollContainerRef = useRef<HTMLOListElement>()

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

  const scrollHandler = useCallback<ScrollHandler>(
    ({ currentTarget }) => {
      const isScrolledToBottom =
        currentTarget.scrollHeight ===
        // not exactly sure why, but sometime's there's an extra half-pixel
        Math.floor(currentTarget.scrollTop + currentTarget.clientHeight + 1)

      if (isScrolledToBottom && !autoscrollChat) {
        dispatch(ActivateAutoscrollAction())
      } else if (!isScrolledToBottom && autoscrollChat) {
        dispatch(DeactivateAutoscrollAction())
      }
    },
    [autoscrollChat]
  )

  return [scrollContainerRef, scrollHandler]
}
