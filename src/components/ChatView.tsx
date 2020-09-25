import React, { useContext } from 'react'

import MessageView from './MessageView'
import { Message, MessageType } from '../message'

import '../../style/chat.css'
import { DispatchContext } from '../App'
import { ActivateAutoscrollAction, DeactivateAutoscrollAction } from '../Actions'

export default function ChatView (props: { messages: Message[], autoscrollChat: Boolean }) {
  const dispatch = useContext(DispatchContext)

  const handleScroll = () => {
    const messageWindow = document.querySelector('#messages')
    const isScrolledToBottom = messageWindow.scrollHeight == messageWindow.scrollTop + messageWindow.clientHeight

    if (isScrolledToBottom && !props.autoscrollChat) {
      dispatch(ActivateAutoscrollAction())
    } else if (!isScrolledToBottom && props.autoscrollChat) {
      dispatch(DeactivateAutoscrollAction())
    }
  }

  React.useEffect(() => {
    const lastMessage = document.querySelector(
      '#messages .message-wrapper:last-of-type'
    )
    if (lastMessage && props.autoscrollChat) {
      // I was using lastMessage.scrollIntoView()
      // But I was seeing odd behavior when there was only one message on-screen.
      // This very TS-unfriendly code fixes taht.
      (lastMessage.parentNode as Element).scrollTop =
        (lastMessage as any).offsetTop -
        (lastMessage.parentNode as any).offsetTop
    }
  })

  return (
    <div id="messages" onScroll={handleScroll}>
      {props.messages.slice(-150).map((m, idx) => {
        let hideTimestamp = false
        const previousMessage = props.messages[idx - 1]
        if (previousMessage) {
          // TODO: Give all messages a userId for this to be meaningful
          if ((previousMessage as any).userId && (m as any).userId && (previousMessage as any).userId === (m as any).userId) {
            const diff = (new Date(m.timestamp).getTime() - new Date(previousMessage.timestamp).getTime())
            // This is a bad way to calculate '3 minutes' and I should feel bad -em
            if (diff < 1000 * 60 * 3) {
              hideTimestamp = true
            }
          }
        }

        const id = `message-${idx}`
        return <MessageView message={m} key={id} id={id} hideTimestamp={hideTimestamp} />
      })}
    </div>
  )
}
