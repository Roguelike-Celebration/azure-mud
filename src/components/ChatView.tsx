import React from 'react'

import MessageView from './MessageView'
import { Message, MessageType } from '../message'

import '../../style/chat.css'

console.log('Are we linkify9ing?')

export default function ChatView (props: { messages: Message[] }) {
  React.useEffect(() => {
    const lastMessage = document.querySelector(
      '#messages .message:last-of-type'
    )
    if (!lastMessage) return;

    // I was using lastMessage.scrollIntoView()
    // But I was seeing odd behavior when there was only one message on-screen.
    // This very TS-unfriendly code fixes taht.
    (lastMessage.parentNode as Element).scrollTop =
      (lastMessage as any).offsetTop -
      (lastMessage.parentNode as any).offsetTop
  })

  return (
    <div id="messages">
      {props.messages.map((m, idx) => {
        let hideTimestamp = false
        const previousMessage = props.messages[idx - 1]
        if (previousMessage) {
          // TODO: Give all messages a userId for this to be meaningful
          if ((previousMessage as any).userId && (m as any).userId && (previousMessage as any).userId === (m as any).userId) {
            hideTimestamp = true
          }
        }

        const id = `message-${idx}`
        return <MessageView message={m} key={id} id={id} hideTimestamp={hideTimestamp} />
      })}
    </div>
  )
}
