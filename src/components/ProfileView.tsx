import React, { useContext } from 'react'
import Linkify from 'react-linkify'

import { PublicUser } from '../../server/src/user'
import { HideProfileAction, WhisperAction } from '../Actions'
import { DispatchContext } from '../App'
import MessageView from './MessageView'
import { Message, MessageType } from '../message'
import InputView from './InputView'

import '../../style/profileView.css'

export default function ProfileView (props: { user: PublicUser, messages: Message[] }) {
  const { user, messages } = props
  const dispatch = useContext(DispatchContext)

  React.useEffect(() => {
    const lastMessage = document.querySelector(
      '#chat .message:last-of-type'
    )
    if (!lastMessage) return;

    // I was using lastMessage.scrollIntoView()
    // But I was seeing odd behavior when there was only one message on-screen.
    // This very TS-unfriendly code fixes taht.
    (lastMessage.parentNode as Element).scrollTop =
      (lastMessage as any).offsetTop -
      (lastMessage.parentNode as any).offsetTop
  })

  const whisperMessages = messages.filter((m, _) => m.type === MessageType.Whisper && m.userId === user.id)

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
      <strong>Ask me about:</strong>
      {user.askMeAbout}
    </div>
  ) : (
    null
  )

  return (
    <Linkify>
      <div id="profile">
        <div id="header">
          <h2>{user.username} {user.isMod ? '(👑 moderator)' : ''}</h2>
          <button className='close-profile' onClick={() => dispatch(HideProfileAction())}>Close</button>
        </div>
        {realName}
        <div id="profile-pronouns">{user.pronouns}</div>
        {description}
        {twitterHandle}
        {url}
        {askMeAbout}
        <div id="chat-container">
          <div id="chat-header">Whisper Chat</div>
          <div id="chat">
            {whisperMessages.length > 0 ? whisperMessages.map((m, idx) => {
              const id = `message-${idx}`
              return <MessageView message={m} key={id} id={id} />
            }) : <em>{`This is the beginning of your whisper chat with ${user.username}`}</em>}
          </div>
          <InputView sendMessage={(message) => dispatch(WhisperAction(user.id, message))}/>
        </div>
      </div>
    </Linkify>
  )
}
