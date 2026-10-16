import React, { FC, ReactNodeArray, useContext } from 'react'
import { MessagesContext } from '../../App'
import { MessageItem } from '../MessageItem'
import { VirtualizationContext } from '../VirtualizationProvider'
import { useAutoscroll, useShouldHideTimestamp } from './hooks'
import './MessageList.css'

interface MessageListProps {
  autoscrollChat: boolean;
  messagesLoadProgress: number;
}

export const MessageList: FC<MessageListProps> = ({
  autoscrollChat,
  messagesLoadProgress
}) => {
  const { ids, entities } = useContext(MessagesContext)
  const [{ messagePositions, viewportScrollTop, viewportScrollHeight }] =
    useContext(VirtualizationContext)

  const isLoading = ids.length > 0 && messagesLoadProgress < 1
  const autoscrollAndNotLoading = autoscrollChat && !isLoading
  const [scrollContainerRef, toggleAutoscroll] = useAutoscroll(autoscrollAndNotLoading)
  const shouldHideTimestamp = useShouldHideTimestamp()

  return (
    <div className="message-list-container">
      <ol
        className="message-list"
        ref={scrollContainerRef}
        onScroll={toggleAutoscroll}
      >
        {ids.reduce<ReactNodeArray>((acc, id, i) => {
          if (!scrollContainerRef.current) {
            return acc
          }

          const { clientHeight } = scrollContainerRef.current
          const { top, height } = messagePositions[id] ?? {}
          const didMeasure = top !== undefined && height !== undefined
          const isInBounds =
          didMeasure &&
          top < viewportScrollTop + clientHeight &&
          top + height > viewportScrollTop

          if (!didMeasure || isInBounds) {
            acc.push(
              <MessageItem
                key={id}
                messageId={id}
                hideTimestamp={shouldHideTimestamp(
                  entities[id],
                  entities[ids[i - 1]]
                )}
                msgIndex={i}
              />
            )
          }

          return acc
        }, [])}
        <li className="sentinel" style={{ top: viewportScrollHeight }} />
      </ol>
      {isLoading && (
        <div className="messages-load-progress">
          Loading {Math.floor(messagesLoadProgress * 100)}%
        </div>
      )}
    </div>
  )
}
