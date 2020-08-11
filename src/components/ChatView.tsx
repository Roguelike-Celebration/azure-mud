import React from 'react'
import MessageView from './MessageView'
import { Message } from '../message'

import '../../style/chat.css'

export default function ChatView(props: { messages: Message[] }) {
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
        const id = `message-${idx}`
        return <MessageView message={m} key={id} id={id} />
      })}
    </div>
  )
}
