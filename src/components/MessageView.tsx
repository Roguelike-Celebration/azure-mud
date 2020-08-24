import React, { useContext, FunctionComponent, ReactElement } from 'react'
import {
  Message,
  MessageType,
  ConnectedMessage,
  DisconnectedMessage,
  EnteredMessage,
  LeftMessage,
  MovedRoomMessage,
  ChatMessage,
  WhisperMessage,
  ErrorMessage,
  ShoutMessage,
  EmoteMessage,
  ModMessage
} from '../message'
import NameView from './NameView'
import { MenuItem, ContextMenuTrigger, ContextMenu } from 'react-contextmenu'
import ReactTooltip from 'react-tooltip'
import { UserMapContext } from '../App'
import { deleteMessage } from '../networking'

export default function MessageView (props: { message: Message; id: string }) {
  const { message } = props

  const messageMap = {
    [MessageType.Connected]: ConnectedMessageView,
    [MessageType.Disconnected]: DisconnectedMessageView,
    [MessageType.Entered]: EnteredView,
    [MessageType.Left]: LeftView,
    [MessageType.MovedRoom]: MovedView,
    [MessageType.Chat]: ChatMessageView,
    [MessageType.Whisper]: WhisperView,
    [MessageType.Shout]: ShoutView,
    [MessageType.Emote]: EmoteView,
    [MessageType.Error]: ErrorView,
    [MessageType.Mod]: ModMessageView
  }

  const component = messageMap[message.type]
  if (!component) {
    console.log('Unexpected message type', message.type)
    return <div />
  }

  return React.createElement(component, { ...message, id: props.id })
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

const DeletableMessageView: FunctionComponent<DeletableMessageViewProps> = (props) => {
  const { userMap, myId } = useContext(UserMapContext)
  const playerIsMod = userMap[myId] && userMap[myId].isMod

  if (!playerIsMod) {
    return props.children as ReactElement
  } else {
    return (
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
  return (
    <div className="message">
      <NameView userId={props.userId} id={props.id} /> has entered from{' '}
      {props.from}.
    </div>
  )
}

const LeftView = (props: LeftMessage & { id: string }) => (
  <div className="message">
    <NameView id={props.id} userId={props.userId} /> has wandered off to{' '}
    {props.to}.
  </div>
)

const MovedView = (props: MovedRoomMessage & { id: string }) => (
  <div className="message">You have moved to {props.to}.</div>
)

const ChatMessageView = (props: ChatMessage & { id: string }) => (
  <div className="message">
    <NameView userId={props.userId} id={props.id} />: <DeletableMessageView messageId={props.messageId}>{props.message}</DeletableMessageView>
  </div>
)

const WhisperView = (props: WhisperMessage & { id: string }) => {
  if (props.senderIsSelf) {
    return (
      <div className="message">
        <em>
          You whisper to <NameView id={props.id} userId={props.userId} />:{' '}
          {props.message}
        </em>
      </div>
    )
  } else {
    return (
      <div className="message">
        <em>
          <NameView userId={props.userId} id={props.id} /> whispers:{' '}
          {props.message}
        </em>
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

const ErrorView = (props: ErrorMessage & { id: string }) => {
  return <div className="message">{props.error}</div>
}
