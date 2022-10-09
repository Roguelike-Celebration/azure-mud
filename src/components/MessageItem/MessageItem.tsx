import React, { FC, memo, useContext } from 'react'
import { MessagesContext } from '../../App'
import { MessageType } from '../../message'
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
    const message = entities[messageId]

    return message && (
      <li className="message-item">
        {message.type === MessageType.MovedRoom && <hr />}
        <MessageView
          message={message}
          hideTimestamp={hideTimestamp}
          msgIndex={msgIndex}
        />
      </li>
    )
  }
)

MessageItem.displayName = 'MessageItem'
