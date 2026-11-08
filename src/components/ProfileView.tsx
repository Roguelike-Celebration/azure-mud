import Linkify from 'linkify-react'
import React, { useContext, useEffect } from 'react'
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu-rlc'
import ReactDOM from 'react-dom'

import { PublicUser } from '../../server/src/user.js'
import { ClearWhisperHistoryAction, HideProfileAction, SendMessageAction } from '../Actions.js'
import { DispatchContext, SettingsContext } from '../App.js'
import { tooltipAttrs } from '../display.js'
import { linkifyOpts } from '../linkifyOptions.js'
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
          <span {...tooltipAttrs(otherUser?.pronouns)}>
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
  const { showDebugControls } = useContext(SettingsContext)

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

  const clearWhisperHistory = () => {
    const doClear = confirm(
      `Clear your whisper history with ${user.username}?\n\n` +
      "(This only clears the history in this browser, and doesn't remove the whispers from the main chat or the other " +
      "user's view of your whisper history.)"
    )
    if (doClear) {
      dispatch(ClearWhisperHistoryAction(user.id))
    }
  }

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

  const noInformation = !realName && !user.pronouns && !description && !socialLink && !url && !askMeAbout

  // Have debug menu's trigger wrap #chat from the outside, because scroll-to-latest effect needs #chat
  // to be the messages' direct parent.
  const whisperMenuId = `whisper-history-menu-${user.id}`
  const whisperHistoryDiv = (
    <div id="chat">
      {whisperMessages.length > 0 ? whisperMessages.map((m, idx) => {
        const id = `whisper-message-${idx}`
        return <ProfileWhisperView {...m} key={id} id={id} otherUser={user} />
      }) : (
        <div className="whisper-chat-empty">
          [This is the beginning of your whisper chat with {user.username}.]
        </div>
      )}
    </div>
  )

  return (<>
    <Linkify options={linkifyOpts}>
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
            {showDebugControls ? (
              <ContextMenuTrigger id={whisperMenuId}>{whisperHistoryDiv}</ContextMenuTrigger>
            ) : whisperHistoryDiv}
            {/* Portal the menu to main <body> to avoid inheriting profile pane's styling. */}
            {showDebugControls && ReactDOM.createPortal(
              <ContextMenu id={whisperMenuId}>
                <MenuItem onClick={clearWhisperHistory} disabled={whisperMessages.length === 0}>
                  Clear Whisper History
                </MenuItem>
              </ContextMenu>,
              document.body
            )}
            <InputView sendMessage={(message) => dispatch(SendMessageAction(`/whisper ${user.username} ${message}`))}/>
          </div>
        </div>
      </div>
    </Linkify>
  </>
  )
}
