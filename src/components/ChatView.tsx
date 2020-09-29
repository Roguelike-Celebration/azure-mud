import React, { useContext } from 'react'

import MessageView from './MessageView'
import { Message, MessageType, ConnectedMessage, DisconnectedMessage, EnteredMessage, LeftMessage } from '../message'

import '../../style/chat.css'
import { DispatchContext } from '../App'
import { ActivateAutoscrollAction, DeactivateAutoscrollAction } from '../Actions'
import { LOCALSTORAGE_SHOW_ALL_MOVEMENT_MESSAGES_KEY } from './SettingsView'
import { ServerSettings } from '../../server/src/types'

function isMovementMessage(message: Message): message is ConnectedMessage | DisconnectedMessage | EnteredMessage | LeftMessage {
  return message.type == MessageType.Connected || message.type == MessageType.Disconnected ||
    message.type == MessageType.Entered || message.type == MessageType.Left
}

export default function ChatView (props: { messages: Message[], autoscrollChat: Boolean, serverSettings: ServerSettings}) {
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

  var showAllMovementMessages: Boolean = JSON.parse(localStorage.getItem(LOCALSTORAGE_SHOW_ALL_MOVEMENT_MESSAGES_KEY))
  if (showAllMovementMessages === null) {
    localStorage.setItem(LOCALSTORAGE_SHOW_ALL_MOVEMENT_MESSAGES_KEY, 'false')
  }
  const messagesAfterMovementFilter = showAllMovementMessages ? props.messages : props.messages.filter((msg) => {
    return !(isMovementMessage(msg) && msg.numUsersInRoom > props.serverSettings.movementMessagesHideThreshold)
  })

  return (
    <div id="messages" onScroll={handleScroll}>
      {messagesAfterMovementFilter.slice(-150).map((m, idx) => {
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
