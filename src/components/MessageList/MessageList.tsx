import React, { FC, useContext } from 'react'
import { MessagesContext } from '../../App'
import { Message } from '../../message'
import { MessageItem } from '../MessageItem'
import './MessageList.css'
import '../../../style/chat.css'

const THREE_MINUTES = 1_000 * 60 * 3
const shouldHideTimestamp = (
  message: Message,
  previousMessage: Message | undefined
): boolean =>
  previousMessage &&
  'userId' in previousMessage &&
  'userId' in message &&
  previousMessage.userId === message.userId &&
  new Date(message.timestamp).getTime() -
    new Date(previousMessage.timestamp).getTime() <
    THREE_MINUTES

export const MessageList: FC = () => {
  const { ids, entities } = useContext(MessagesContext)

  return (
    <ol className="message-list">
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
