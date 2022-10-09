import React, { FC, memo, useContext } from 'react'
import { MessagesContext } from '../../App'
import MessageView from '../MessageView'
import './MessageItem.css'

interface MessageItemProps {
  messageId: string;
  hideTimestamp: boolean;
  msgIndex: number;
}

export const MessageItem: FC<MessageItemProps> = memo(
  ({ messageId, hideTimestamp, msgIndex }) => {
    const { entities } = useContext(MessagesContext)

    return (
      <li className="message-item">
        <MessageView
          message={entities[messageId]}
          hideTimestamp={hideTimestamp}
          msgIndex={msgIndex}
        />
      </li>
    )
  }
)

MessageItem.displayName = 'MessageItem'
