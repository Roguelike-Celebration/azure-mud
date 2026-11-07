import React from 'react'

import { MinimalUser } from '../../server/src/user.js'

import { LoggedInLine } from './LogOutButton.js'

interface Props {
  user: MinimalUser
  email: string
}

export default function GoHomeView (props: Props) {
  const { user, email } = props

  return (
    <div id='go-home'>
      <h1>A magical force repels you from the entrance</h1>
      <p>Roguelike Celebration is currently closed! Check the <a href="https://roguelike.club/event2026.html" target="_blank" rel="noreferrer">schedule</a> to see when our doors will be open again.</p>
      <p>We look forward to celebrating again with you soon :)</p>
      <p><LoggedInLine user={user} email={email}/></p>
    </div>
  )
}
