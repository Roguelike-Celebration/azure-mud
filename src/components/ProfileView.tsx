import React, { useContext } from 'react'
import Linkify from 'react-linkify'
import { PublicUser } from '../../server/src/user'
import { HideProfileAction, SendMessageAction, ReceivedMyProfileAction } from '../Actions'
import { DispatchContext } from '../App'
import { Message, WhisperMessage, MessageType } from '../message'
import InputView from './InputView'
import NameView from './NameView'
import ReactTooltip from 'react-tooltip'

import '../../style/profileView.css'

const ProfileWhisperView = (props: WhisperMessage & {id: string, otherUser: PublicUser}) => {
  const { otherUser } = props

  if (props.senderIsSelf) {
    return (
      <div className="whisper-message">
        <em>
          You:{' '}
          {props.message}
        </em>
      </div>
    )
  } else {
    return (
      <div className="whisper-message">
        <em>
          <span data-tip={otherUser && otherUser.pronouns}>
            {otherUser.username}
          </span>:{' '}
          {props.message}
          <ReactTooltip />
        </em>
      </div>
    )
  }
}

export default function ProfileView (props: { user: PublicUser, whispers: WhisperMessage[] }) {
  const { user, whispers } = props
  const dispatch = useContext(DispatchContext)

  React.useEffect(() => {
    const lastMessage = document.querySelector(
      '#chat .whisper-message:last-of-type'
    )
    if (!lastMessage) return

    // I was using lastMessage.scrollIntoView()
    // But I was seeing odd behavior when there was only one message on-screen.
    // This very TS-unfriendly code fixes taht.
    (lastMessage.parentNode as Element).scrollTop =
      (lastMessage as any).offsetTop -
      (lastMessage.parentNode as any).offsetTop
  })

  const whisperMessages = (whispers || []).filter((m, _) => m.userId === user.id) as Array<WhisperMessage>

  const realName = user.realName ? (
    <div id="profile-realName">{user.realName}</div>
  ) : (
    null
  )

  const twitterHandle = user.twitterHandle ? (
    <div id="profile-twitter">
      <strong>Twitter</strong>:{' '}
      <a href={`https://twitter.com/${user.twitterHandle}`} target="_blank" rel="noreferrer">
      @{user.twitterHandle}
      </a>
    </div>
  ) : (
    null
  )

  const url = user.url ? (
    <div id="profile-url">
      <strong>Web Site</strong>:{' '}
      {user.url}
    </div>
  ) : (
    null
  )

  const description = user.description ? (
    <div id="profile-description">{user.description}</div>
  ) : (
    null
  )

  const askMeAbout = user.askMeAbout ? (
    <div id="profile-askme">
      <strong>Ask me about:</strong>{' '}
      {user.askMeAbout}
    </div>
  ) : (
    null
  )

  const linkDecorator = (href, text, key) => (
    <a href={href} key={key} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  )

  return (
    <Linkify componentDecorator={linkDecorator}>
      <div id="profile" style={{ overflowWrap: 'anywhere' }}>
        <div className='fixed'>
          <div id="header">
            <h2 className={user.isMod ? 'mod' : ''}><NameView userId={user.id} id={`profile-nameview-${user.id}`} /></h2>
            <button className='close-profile' onClick={() => dispatch(HideProfileAction())}>X</button>
          </div>
          <p>
            {realName}
            <div id="profile-pronouns">{user.pronouns}</div>
            {description}
          </p>

          {user.item ? <p>{user.username} is currently holding {user.item}</p> : null}

          <p>
            {twitterHandle}
            {url}
            {askMeAbout}
          </p>
          <div id="chat-container">
            <div id="chat-header">Whisper Chat</div>
            <div id="chat">
              {whisperMessages.length > 0 ? whisperMessages.map((m, idx) => {
                const id = `whisper-message-${idx}`
                return <ProfileWhisperView {...m} key={id} id={id} otherUser={user} />
              }) : <em>{`This is the beginning of your whisper chat with ${user.username}`}</em>}
            </div>
            <InputView sendMessage={(message) => dispatch(SendMessageAction(`/whisper ${user.username} ${message}`))}/>
          </div>
        </div>
      </div>
    </Linkify>
  )
}
