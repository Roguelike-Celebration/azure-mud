import React, { useContext } from 'react'
import { PublicUser } from '../../server/src/user'
import { HideProfileAction } from '../Actions'
import { DispatchContext } from '../App'
import MessageView from './MessageView'
import { Message, MessageType } from '../message'
import InputView from './InputView'

import '../../style/profileView.css'

export default function ProfileView (props: { user: PublicUser, messages: Message[] }) {
  const { user, messages } = props
  const dispatch = useContext(DispatchContext)

  const whisperMessages = messages.filter((m, _) => m.type === MessageType.Whisper)

  return (
    <div id="profile">
      <div id="header">
        <h2>{user.username} {user.isMod ? '(👑 moderator)' : ''}</h2>
        <button
          onClick={() => dispatch(HideProfileAction())}
          id="profile-close"
        >
            x
        </button>
      </div>
      {user.realName && (
        <div id="profile-realName">{user.realName}</div>
      )}
      <div id="profile-pronouns">{user.pronouns}</div>
      {user.description && (
        <div id="profile-description">{user.description}</div>
      )}
      {user.twitterHandle && (
        <div id="profile-twitter">
          <strong>Twitter</strong>:{' '}
          <a href={`https://twitter.com/${user.twitterHandle}`} target="_blank" rel="noreferrer">
            @{user.twitterHandle}
          </a>
        </div>)}
      {user.url && (
        <div id="profile-url">
          <strong>Web Site</strong>:{' '}
          <a href={user.url} target="_blank" rel="noreferrer">
            {user.url}
          </a>
        </div>)}
      {user.askMeAbout && (
        <div id="profile-askme">
          <strong>Ask me about:</strong>
          {user.askMeAbout}
        </div>
      )}
      <div id="chat-container">
        <div id="chat-header">Whisper Chat</div>
        <div id="chat">
          {whisperMessages.length > 0 ? whisperMessages.map((m, idx) => {
            const id = `message-${idx}`
            return <MessageView message={m} key={id} id={id} />
          }) : <em>{`This is the beginning of your whisper chat with ${user.username}`}</em>}
        </div>
        <InputView />
      </div>
    </div>
  )
}
