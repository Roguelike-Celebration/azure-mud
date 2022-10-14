import React, { FC, memo, useContext, useEffect, useRef } from 'react'
import { MessagesContext } from '../../App'
import { MessageType } from '../../message'
import MessageView from '../MessageView'
import { VirtualizationContext } from '../VirtualizationProvider/VirtualizationProvider'
import './MessageItem.css'

interface MessageItemProps {
  messageId: string;
  hideTimestamp: boolean;
  msgIndex: number;
}

const { getComputedStyle: getStyle } = window

const outerTop: (el: HTMLElement) => number = (el) => {
  const { marginTop } = getStyle(el)
  return el.offsetTop - parseInt(marginTop, 10)
}

const outerHeight: (el: HTMLElement) => number = (el) => {
  const { marginTop, height, marginBottom } = getStyle(el)
  return [marginTop, height, marginBottom].reduce(
    (acc, px) => acc + parseInt(px, 10),
    0
  )
}

export const MessageItem: FC<MessageItemProps> = memo(
  ({ messageId, hideTimestamp, msgIndex }) => {
    const [{ positions, viewportClientHeight }, virtualizationDispatch] =
      useContext(VirtualizationContext)
    const { entities } = useContext(MessagesContext)
    const message = entities[messageId]

    const messageItemRef = useRef<HTMLLIElement>(null)
    useEffect(() => {
      if (!messageItemRef.current) {
        return
      }

      const { top, height } = positions[messageId]

      if (top === undefined && height === undefined) {
        virtualizationDispatch({
          type: 'setVerticalPosition',
          payload: {
            id: messageId,
            top: viewportClientHeight + outerTop(messageItemRef.current),
            height: outerHeight(messageItemRef.current)
          }
        })
      }
    }, [
      messageId,
      positions[messageId],
      viewportClientHeight,
      virtualizationDispatch
    ])

    return message ? (
      <li
        className="message-item"
        style={{ top: positions[messageId]?.top }}
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
