import React, { FC, useContext } from 'react'
import { MessagesContext } from '../../App'
import { MessageItem } from '../MessageItem'
import { useAutoscroll, useShouldHideTimestamp } from './hooks'
import './MessageList.css'

interface MessageListProps {
  autoscrollChat: boolean;
}

export const MessageList: FC<MessageListProps> = ({ autoscrollChat }) => {
  const { ids, entities } = useContext(MessagesContext)

  const [scrollContainerRef, toggleAutoscroll] = useAutoscroll(autoscrollChat)
  const shouldHideTimestamp = useShouldHideTimestamp()

  return (
    <ol
      className="message-list"
      ref={scrollContainerRef}
      onScroll={toggleAutoscroll}
    >
      {ids.map((id, i) => (
        <MessageItem
          key={id}
          messageId={id}
          hideTimestamp={shouldHideTimestamp(
            entities[id],
            entities[ids[i - 1]]
          )}
          msgIndex={i}
        />
      ))}
    </ol>
  )
}
