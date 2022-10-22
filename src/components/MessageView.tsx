/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { FunctionComponent, memo, useContext } from 'react'
import Linkify from 'react-linkify'
import ReactTooltip from 'react-tooltip'

import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu'

import {
  DispatchContext,
  MessagesContext,
  RoomDataContext,
  UserMapContext
} from '../App'
import { renderCustomEmojiString } from '../emoji'
import {
  CaptionMessage,
  ChatMessage,
  CommandMessage,
  ConnectedMessage,
  DanceMessage,
  DisconnectedMessage,
  EmoteMessage,
  EnteredMessage,
  ErrorMessage,
  LeftMessage,
  Message,
  MessageType,
  ModMessage,
  MovedRoomMessage,
  SameRoomMessage,
  ShoutMessage,
  WhisperMessage
} from '../message'
import { deleteMessage, fetchProfile, moveToRoom } from '../networking'
import NameView from './NameView'
import { MinimalUser } from '../../server/src/user'

const formatter = new Intl.DateTimeFormat('en', {
  hour: 'numeric',
  minute: 'numeric'
})

export default memo(function MessageView (props: {
  message: Message;
  hideTimestamp: boolean;
  msgIndex: number;
}) {
  const { message } = props
  if (!message) {
    return <div />
  }

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

  const date =
    typeof message.timestamp === 'string'
      ? new Date(message.timestamp)
      : message.timestamp
  let className = 'message-wrapper'
  if (props.msgIndex % 2 === 0) {
    className += ' even-message'
  }

  return (
    <div className={className}>
      <div className={`time ${props.hideTimestamp ? 'show-on-hover' : null}`}>
        {formatter.format(date)}
      </div>
      {React.createElement(component, { ...message })}
    </div>
  )
})

const handleDeleteMessage = (e, data) => {
  const doDelete = confirm(
    `Are you sure you would like to delete the message '${data.messageText}'?`
  )
  if (doDelete) {
    deleteMessage(data.messageId)
  }
}

type DeletableMessageViewProps = {
  messageId: string;
  messageText: string;
};

const linkDecorator = (href, text, key) => (
  <a href={href} key={key} target="_blank" rel="noopener noreferrer">
    {text}
  </a>
)

const DeletableMessageView: FunctionComponent<DeletableMessageViewProps> = (
  props
) => {
  const { userMap, myId } = useContext(UserMapContext)

  const playerIsMod = userMap[myId] && userMap[myId].isMod

  if (!playerIsMod) {
    return (
      <Linkify componentDecorator={linkDecorator}>{props.children}</Linkify>
    )
  } else {
    const key: string = `${props.messageId}-name`

    return (
      <Linkify componentDecorator={linkDecorator}>
        <span className="deleteMenu">
          <ContextMenuTrigger id={key} mouseButton={2} renderTag="span">
            {props.children}
          </ContextMenuTrigger>
          <ContextMenu id={key}>
            <MenuItem
              data={{
                messageId: props.messageId,
                message: props.children,
                messageText: props.messageText
              }}
              onClick={handleDeleteMessage}
            >
              {'Delete Message?'}
            </MenuItem>
          </ContextMenu>
        </span>
      </Linkify>
    )
  }
}

const ConnectedMessageView = (props: ConnectedMessage) => (
  <div className="message">
    <NameView userId={props.userId} id={props.id} /> has connected.
  </div>
)

const DisconnectedMessageView = (props: DisconnectedMessage) => (
  <div className="message">
    <NameView userId={props.userId} id={props.id} /> has disconnected.
  </div>
)

const EnteredView = (props: EnteredMessage) => {
  const onClick = () => {
    moveToRoom(props.fromId)
  }
  const roomData = useContext(RoomDataContext)

  if (roomData[props.fromId]) {
    const fromButton: JSX.Element = roomData[props.fromId].hidden ? (
      <text>somewhere...</text>
    ) : (
      <button onClick={onClick} className="link-styled-button">
        {props.fromName}.
      </button>
    )
    return (
      <div className="message movement-message">
        <NameView userId={props.userId} id={props.id} /> has entered from{' '}
        {fromButton}
      </div>
    )
  }
  return null
}

const LeftView = (props: LeftMessage) => {
  const onClick = () => {
    moveToRoom(props.toId)
  }
  const roomData = useContext(RoomDataContext)

  if (roomData[props.toId]) {
    const toButton: JSX.Element = roomData[props.toId].hidden ? (
      <text>somewhere...</text>
    ) : (
      <button onClick={onClick} className="link-styled-button">
        {props.toName}.
      </button>
    )
    return (
      <div className="message movement-message">
        <NameView id={props.id} userId={props.userId} /> has wandered off to{' '}
        {toButton}
      </div>
    )
  }
  return null
}

const MovedView = (props: MovedRoomMessage) => (
  <div className="message">You have moved to {props.to}.</div>
)

const SameView = (props: SameRoomMessage) => (
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

function renderChatMessageWithUsernames (message: string, id: string, userMap: { [userId: string]: MinimalUser }) {
  const splitMessage = message.split(/(@@.*?@@)/)
  return splitMessage.reduce<JSX.Element>(
    (acc, fragment, idx) => {
      if (fragment.startsWith('@@') && fragment.endsWith('@@')) {
        const userIdOrDisplay = parseUserIdOrDisplay(fragment)
        const user = userMap[userIdOrDisplay]
        if (user) {
          return (
            <>
              {acc}{' '}
              <NameView userId={user.id} id={`${id}-mention-${idx}`} />
            </>
          )
        } else {
          return (
            <>
              {acc} {userIdOrDisplay}
            </>
          )
        }
      } else {
        const customEmojified = renderCustomEmojiString(fragment)

        return (
          <>
            {acc} {customEmojified}
          </>
        )
      }
    },
    <></>
  )
}

const ChatMessageView = (props: ChatMessage) => {
  const { userMap } = useContext(UserMapContext)
  const joinedMessage = renderChatMessageWithUsernames(props.message, props.id, userMap)

  return (
    <div className="message">
      <NameView userId={props.userId} id={props.id} />:{' '}
      <DeletableMessageView messageId={props.id} messageText={props.message}>
        {joinedMessage}
      </DeletableMessageView>
    </div>
  )
}

const CaptionView = (props: CaptionMessage) => (
  <div className="message">
    <NameView userId={props.userId} id={props.id} /> (spoken):{' '}
    <DeletableMessageView messageId={props.id} messageText={props.message}>
      {props.message}
    </DeletableMessageView>
  </div>
)

const WhisperView = (props: WhisperMessage) => {
  const { userMap } = useContext(UserMapContext)

  const openProfile = () => {
    fetchProfile(props.userId)
  }

  const message = renderChatMessageWithUsernames(props.message, props.id, userMap)

  if (props.senderIsSelf) {
    return (
      <div className="whisper" onClick={openProfile}>
        You whisper to <NameView id={props.id} userId={props.userId} />:{' '}
        {message}
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

const ModMessageView = (props: ModMessage) => {
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
          <span role="img" aria-label="red exclamation point">
            ❗
          </span>
          <NameView userId={props.userId} id={props.id} /> says to the{' '}
          <strong>mods</strong>:{props.message}
          <span role="img" aria-label="red exclamation point">
            ❗
          </span>
        </em>
      </div>
    )
  }
}

const ShoutView = (props: ShoutMessage) => {
  return (
    <div className="message">
      <NameView userId={props.userId} id={props.id} /> shouts:{' '}
      <DeletableMessageView messageId={props.id} messageText={props.message}>
        {props.message}
      </DeletableMessageView>
    </div>
  )
}

const EmoteView = (props: EmoteMessage) => {
  const { userMap } = useContext(UserMapContext)
  const message = renderChatMessageWithUsernames(props.message, props.id, userMap)

  return (
    <div className="message">
      <em>
        <NameView userId={props.userId} id={props.id} />{' '}
        <DeletableMessageView messageId={props.id} messageText={props.message}>
          {message}
        </DeletableMessageView>
      </em>
    </div>
  )
}

const DanceView = (props: DanceMessage) => {
  return (
    <div className="message">
      <em>
        <NameView userId={props.userId} id={props.id} />{' '}
        <span dangerouslySetInnerHTML={{ __html: props.message }}></span>
      </em>
    </div>
  )
}

const ErrorView = (props: ErrorMessage) => {
  return <div className="error">{props.error}</div>
}

const CommandView = (props: CommandMessage) => {
  return (
    <div className="message">
      <em>
        <span dangerouslySetInnerHTML={{ __html: props.command }}></span>
      </em>
    </div>
  )
}
