import React, { useContext } from 'react'
import { PublicUser } from '../../server/src/user'
import { HideProfileAction } from '../Actions'
import { DispatchContext } from '../App'

import '../../style/profileView.css'

export default function ProfileView (props: { user: PublicUser }) {
  const { user } = props
  const dispatch = useContext(DispatchContext)

  const realName = user.realName ? (
    <div id="profile-realName">{user.realName}</div>
  ) : (
    ''
  )

  const twitterHandle = user.twitterHandle ? (
    <div id="profile-twitter">
      <strong>Twitter</strong>:{' '}
      <a href={`https://twitter.com/${user.twitterHandle}`} target="_blank" rel="noreferrer">
        @{user.twitterHandle}
      </a>
    </div>
  ) : (
    ''
  )

  const url = user.url ? (
    <div id="profile-url">
      <strong>Web Site</strong>:{' '}
      <a href={user.url} target="_blank" rel="noreferrer">
        {user.url}
      </a>
    </div>
  ) : (
    ''
  )

  const description = user.description ? (
    <div id="profile-description">{user.description}</div>
  ) : (
    ''
  )

  const askMeAbout = user.askMeAbout ? (
    <div id="profile-askme">
      <strong>Ask me about:</strong>
      {user.askMeAbout}
    </div>
  ) : (
    ''
  )

  return (
    <div id="profile">
      <h1>
        {user.username} {user.isMod ? '(👑 moderator)' : ''}
      </h1>
      {realName}
      <div id="profile-pronouns">{user.pronouns}</div>
      {description}
      {twitterHandle}
      {url}
      {askMeAbout}
      <button onClick={() => dispatch(HideProfileAction())}>Close</button>
    </div>
  )
}
