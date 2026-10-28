import React, { useContext, useEffect } from 'react'
import Linkify from 'react-linkify'
import ReactTooltip from 'react-tooltip'

import { PublicUser } from '../../server/src/user.js'
import { HideProfileAction, SendMessageAction } from '../Actions.js'
import { DispatchContext } from '../App.js'
import { WhisperMessage } from '../message/index.js'

import BadgeView from './BadgeView.js'
import InputView from './InputView.js'
import NameView from './NameView.js'

import '../../style/profileView.css'

const ProfileWhisperView = (props: WhisperMessage & { id: string, otherUser: PublicUser }) => {
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
          <span data-tip={otherUser?.pronouns}>
            {otherUser.username}
          </span>:{' '}
          {props.message}
        </em>
      </div>
    )
  }
}

export default function ProfileView (props: { user: PublicUser, whispers: WhisperMessage[] }) {
  const { user, whispers } = props
  const dispatch = useContext(DispatchContext)

  useEffect(() => {
    const lastMessage = document.querySelector<HTMLElement>(
      '#chat .whisper-message:last-of-type'
    )
    const container = lastMessage?.parentElement
    if (!lastMessage || !container) return

    // I was using lastMessage.scrollIntoView(). But I was seeing odd behavior when there
    // was only one message on-screen. This fixes that.
    container.scrollTop = lastMessage.offsetTop - container.offsetTop
  })

  const whisperMessages = (whispers || []).filter((m, _) => m.userId === user.id) as Array<WhisperMessage>

  const realName = user.realName ? (
    <div id="profile-realName">{user.realName}</div>
  ) : (
    null
  )

  const socialLink = user.twitterHandle ? (
    <div id="profile-social">
      <strong>Social Link</strong>:{' '}
      {user.twitterHandle}
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

  const linkDecorator = (href: string, text: string, key: number): React.ReactElement => (
    <a href={href} key={key} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  )

  const noInformation = !realName && !user.pronouns && !description && !socialLink && !url && !askMeAbout

  return (<>
    <ReactTooltip />
    <Linkify componentDecorator={linkDecorator}>
      <div id="profile" style={{ overflowWrap: 'anywhere' }}>
        <div className='fixed'>
          <div id="header">
            <h2 className={user.isMod ? 'mod' : ''}><NameView userId={user.id} id={`profile-nameview-${user.id}`} /></h2>
            <button className='close-profile' onClick={() => dispatch(HideProfileAction())}>X</button>
          </div>
          <section className="badges">
            {user.unlockedBadges?.map(badge => {
              return (<BadgeView key={badge.emoji} emoji={badge.emoji} description={badge.description} isCustom={badge.isCustom} />)
            })}
          </section>
          <section className="profile-details">
            <div className="profile-details-group">
              {realName}
              <div id="profile-pronouns">{user.pronouns}</div>
              <i>{description}</i>
            </div>

            <div className="profile-details-group">
              {socialLink}
              {url}
              {askMeAbout}
            </div>

            {noInformation &&
              <i>{user.username} has no further information. How mysterious!</i>
            }

            {user.item && <p>{user.username} is currently holding {user.item}</p>}

          </section>

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
  </>
  )
}
