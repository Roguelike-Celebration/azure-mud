import React from 'react'

import { MinimalUser } from '../../server/src/user.js'

import { LoggedInLine } from './LogOutButton.js'

interface Props {
  user: MinimalUser
  email: string
}

export default function YouAreBannedView (props: Props) {
  const { user, email } = props

  return (
    <div id='you-are-banned'>
      <h1>You are banned</h1>
      <p>You have been banned from the social space. If you believe you have been banned in error, please email <b>contact at roguelike.club</b>.</p>
      <p><LoggedInLine user={user} email={email}/></p>
    </div>
  )
}
