import React, { FC, memo, useContext, useEffect, useRef } from 'react'
import { MessagesContext } from '../../App'
import { MessageType } from '../../message'
import MessageView from '../MessageView'
import { VirtualizationContext } from '../VirtualizationProvider'
import './MessageItem.css'

interface MessageItemProps {
  messageId: string;
  hideTimestamp: boolean;
  msgIndex: number;
}

const { getComputedStyle: getStyle } = window

const outerHeight: (el: HTMLElement) => number = (el) => {
  const { marginTop, height, marginBottom } = getStyle(el)
  return [marginTop, height, marginBottom].reduce(
    (acc, px) => acc + parseInt(px, 10),
    0
  )
}

export const MessageItem: FC<MessageItemProps> = memo(
  ({ messageId, hideTimestamp, msgIndex }) => {
    const [{ messagePositions, viewportScrollHeight }, virtualizationDispatch] =
      useContext(VirtualizationContext)
    const { entities } = useContext(MessagesContext)
    const message = entities[messageId]

    const messageItemRef = useRef<HTMLLIElement>(null)
    useEffect(() => {
      if (!messageItemRef.current) {
        return
      }

      const { top, height } = messagePositions[messageId] ?? {}

      if (top === undefined && height === undefined) {
        virtualizationDispatch({
          type: 'setMessagePosition',
          payload: {
            id: messageId,
            top: viewportScrollHeight + messageItemRef.current.offsetTop,
            height: outerHeight(messageItemRef.current)
          }
        })
      }
    }, [
      messageId,
      messagePositions[messageId],
      viewportScrollHeight,
      virtualizationDispatch
    ])

    return message ? (
      <li
        className="message-item"
        style={{ top: messagePositions[messageId]?.top }}
        ref={messageItemRef}
      >
        {message.type === MessageType.MovedRoom && <hr />}
        <MessageView
          message={message}
          hideTimestamp={hideTimestamp}
          msgIndex={msgIndex}
        />
      </li>
    ) : null
  }
)

MessageItem.displayName = 'MessageItem'
