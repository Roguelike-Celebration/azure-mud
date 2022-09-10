/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useContext, FunctionComponent } from 'react'
import ReactTooltip from 'react-tooltip'
import Linkify from 'react-linkify'

import { MenuItem, ContextMenuTrigger, ContextMenu } from 'react-contextmenu'

import {
  Message,
  MessageType,
  ConnectedMessage,
  DisconnectedMessage,
  EnteredMessage,
  LeftMessage,
  MovedRoomMessage,
  SameRoomMessage,
  ChatMessage,
  WhisperMessage,
  ErrorMessage,
  ShoutMessage,
  EmoteMessage,
  DanceMessage,
  ModMessage,
  CommandMessage,
  CaptionMessage
} from '../message'
import NameView from './NameView'
import { DispatchContext, UserMapContext, RoomDataContext } from '../App'
import { deleteMessage, fetchProfile, moveToRoom } from '../networking'
import { join, split } from 'lodash'
import { renderCustomEmojiString } from '../emoji'

const formatter = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' })

export default function MessageView (props: { message: Message; id: string, hideTimestamp: boolean, msgIndex: number }) {
  const { message } = props
  if (!message) { return <div/> }

  const messageMap = {
    [MessageType.Connected]: ConnectedMessageView,
    [MessageType.Disconnected]: DisconnectedMessageView,
    [MessageType.Entered]: EnteredView,
    [MessageType.Left]: LeftView,
    [MessageType.MovedRoom]: MovedView,
    [MessageType.SameRoom]: SameView,
    [MessageType.Chat]: ChatMessageView,
    [MessageType.Whisper]: WhisperView,
    [MessageType.Shout]: ShoutView,
    [MessageType.Emote]: EmoteView,
    [MessageType.Dance]: DanceView,
    [MessageType.Caption]: CaptionView,
    [MessageType.Error]: ErrorView,
    [MessageType.Mod]: ModMessageView,
    [MessageType.Command]: CommandView
  }

  const component = messageMap[message.type]
  if (!component) {
    console.log('Unexpected message type', message.type)
    return <div />
  }

  const date = (typeof message.timestamp === 'string' ? new Date(message.timestamp) : message.timestamp)
  let className = 'message-wrapper'
  if (props.msgIndex % 2 === 0) {
    className += ' even-message'
  }

  return (
    <div className={className}>
      <div className={`time ${props.hideTimestamp ? 'show-on-hover' : null}`}>{formatter.format(date)}</div>
      {React.createElement(component, { ...message, id: props.id })}
    </div>
  )
}

const handleDeleteMessage = (e, data) => {
  const doDelete = confirm(`Are you sure you would like to delete the message '${data.message}'?`)
  if (doDelete) {
    deleteMessage(data.messageId)
  }
}

type DeletableMessageViewProps = {
  messageId: string
}

const linkDecorator = (href, text, key) => (
  <a href={href} key={key} target="_blank" rel="noopener noreferrer">
    {text}
  </a>
)

const DeletableMessageView: FunctionComponent<DeletableMessageViewProps> = (props) => {
  const { userMap, myId } = useContext(UserMapContext)
  const playerIsMod = userMap[myId] && userMap[myId].isMod

  if (!playerIsMod) {
    return <Linkify componentDecorator={linkDecorator}>{props.children}</Linkify>
  } else {
    return (
      <Linkify componentDecorator={linkDecorator}>
        <span className="deleteMenu">
          <ContextMenuTrigger id={props.messageId} mouseButton={2} renderTag="span">
            {props.children}
          </ContextMenuTrigger>
          <ContextMenu id={props.messageId}>
            <MenuItem
              data={{ messageId: props.messageId, message: props.children }}
              onClick={handleDeleteMessage}
            >
              { 'Delete Message?' }
            </MenuItem>
          </ContextMenu>
          <ReactTooltip />
        </span>
      </Linkify>
    )
  }
}

const ConnectedMessageView = (props: ConnectedMessage & { id: string }) => (
  <div className="message">
    <NameView userId={props.userId} id={props.id} /> has connected.
  </div>
)

const DisconnectedMessageView = (
  props: DisconnectedMessage & { id: string }
) => (
  <div className="message">
    <NameView userId={props.userId} id={props.id} /> has disconnected.
  </div>
)

const EnteredView = (props: EnteredMessage & { id: string }) => {
  const onClick = () => {
    moveToRoom(props.fromId)
  }
  const roomData = useContext(RoomDataContext)

  if (roomData[props.fromId]) {
    const fromButton: JSX.Element = roomData[props.fromId].hidden ? <text>somewhere...</text> : <button onClick={onClick} className='link-styled-button'>{props.fromName}.</button>
    return (
      <div className="message movement-message">
        <NameView userId={props.userId} id={props.id}/> has entered from{' '}{fromButton}
      </div>
    )
  }
  return null
}

const LeftView = (props: LeftMessage & { id: string }) => {
  const onClick = () => {
    moveToRoom(props.toId)
  }
  const roomData = useContext(RoomDataContext)

  if (roomData[props.toId]) {
    const toButton: JSX.Element = roomData[props.toId].hidden ? <text>somewhere...</text> : <button onClick={onClick} className='link-styled-button'>{props.toName}.</button>
    return (
      <div className="message movement-message">
        <NameView id={props.id} userId={props.userId} /> has wandered off to{' '}{toButton}
      </div>
    )
  }
  return null
}

const MovedView = (props: MovedRoomMessage & { id: string }) => (
  <div className="message">You have moved to {props.to}.</div>
)

const SameView = (props: SameRoomMessage & { id: string }) => (
  <div className="message">You are already in {props.roomId}.</div>
)

const parseUserIdOrDisplay = (messageFragment): string => {
  const userId = messageFragment.match(/``(.*?)``/)

  if (!userId) {
    return 'Malformed Mention'
  }

  if (userId.length === 2) {
    return userId[1]
  }
  const display = messageFragment.match(/\[\[(.*?)\]\]/)
  if (display.length === 2) {
    return display[1]
  }
  return 'Malformed Mention'
}

const ChatMessageView = (props: ChatMessage & { id: string }) => {
  const { userMap } = useContext(UserMapContext)

  const splitMessage = props.message.split(/(@@.*?@@)/)
  const joinedMessage = splitMessage.reduce<JSX.Element>((acc, fragment, idx) => {
    if (fragment.startsWith('@@') && fragment.endsWith('@@')) {
      const userIdOrDisplay = parseUserIdOrDisplay(fragment)
      const user = userMap[userIdOrDisplay]
      if (user) {
        return <>{acc} <NameView userId={user.id} id={`${props.id}-mention-${idx}`}/></>
      } else {
        return <>{acc} {userIdOrDisplay}</>
      }
    } else {
      const customEmojified = renderCustomEmojiString(fragment)

      return <>{acc} {customEmojified}</>
    }
  }, <></>)

  return (
    <div className="message">
      <NameView userId={props.userId} id={props.id} />: <DeletableMessageView messageId={props.messageId}>{joinedMessage}</DeletableMessageView>
    </div>
  )
}

const CaptionView = (props: CaptionMessage & { id: string }) => (
  <div className="message">
    <NameView userId={props.userId} id={props.id} /> (spoken): <DeletableMessageView messageId={props.messageId}>{props.message}</DeletableMessageView>
  </div>
)

const WhisperView = (props: WhisperMessage & { id: string }) => {
  const dispatch = useContext(DispatchContext)
  const openProfile = () => {
    fetchProfile(props.userId)
  }

  if (props.senderIsSelf) {
    return (
      <div className="whisper" onClick={openProfile}>
        You whisper to <NameView id={props.id} userId={props.userId} />:{' '}
        {props.message}
      </div>
    )
  } else {
    return (
      <div className="whisper" onClick={openProfile}>
        <NameView userId={props.userId} id={props.id} /> whispers:{' '}
        {props.message}
      </div>
    )
  }
}

const ModMessageView = (props: ModMessage & { id: string }) => {
  if (props.senderIsSelf) {
    return (
      <div className="message">
        <em>
          <strong>You</strong> said to the <strong>mod team</strong>:{' '}
          {props.message}
          <br />
          Someone from the <strong>mod team</strong> will be in touch soon.
        </em>
      </div>
    )
  } else {
    return (
      <div className="message">
        <em>
          <span role="img" aria-label="red exclamation point">❗</span><NameView userId={props.userId} id={props.id} /> says to the{' '}
          <strong>mods</strong>:{props.message}<span role="img" aria-label="red exclamation point">❗</span>
        </em>
      </div>
    )
  }
}

const ShoutView = (props: ShoutMessage & { id: string }) => {
  return (
    <div className="message">
      <NameView userId={props.userId} id={props.id} /> shouts: <DeletableMessageView messageId={props.messageId}>{props.message}</DeletableMessageView>
    </div>
  )
}

const EmoteView = (props: EmoteMessage & { id: string }) => {
  return (
    <div className="message">
      <em><NameView userId={props.userId} id={props.id} /> <DeletableMessageView messageId={props.messageId}>{props.message}</DeletableMessageView></em>
    </div>
  )
}

const DanceView = (props: DanceMessage & { id: string }) => {
  return (
    <div className="message">
      <em><NameView userId={props.userId} id={props.id} /> <span dangerouslySetInnerHTML={ { __html: props.message } }></span></em>
    </div>
  )
}

const ErrorView = (props: ErrorMessage & { id: string }) => {
  return <div className="error">{props.error}</div>
}

const CommandView = (props: CommandMessage & { id: string }) => {
  return <div className="message"><em><span dangerouslySetInnerHTML={ { __html: props.command } }></span></em></div>
}
