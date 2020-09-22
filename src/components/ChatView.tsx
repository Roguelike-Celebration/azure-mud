import React from 'react'

import MessageView from './MessageView'
import { Message, MessageType, ConnectedMessage, DisconnectedMessage, EnteredMessage, LeftMessage } from '../message'

import '../../style/chat.css'

console.log('Are we linkify9ing?')


function isMovementMessage(message: Message): message is ConnectedMessage | DisconnectedMessage | EnteredMessage | LeftMessage {
  return message.type == MessageType.Connected || message.type == MessageType.Disconnected ||
    message.type == MessageType.Entered || message.type == MessageType.Left
}

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

  var hideMovementThreshold = parseInt(localStorage.getItem('HideMovementThreshold'))
  console.log(hideMovementThreshold)
  if (hideMovementThreshold == NaN) {
    hideMovementThreshold = 6
    localStorage.setItem('HideMovementThreshold', '6')
  }
  const messagesAfterMovementFilter = props.messages.filter((msg) => {
    return !(isMovementMessage(msg) && msg.numUsersInRoom > hideMovementThreshold)
  })

  return (
    <div id="messages">
      {messagesAfterMovementFilter.map((m, idx) => {
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
