import React from 'react'

import { MinimalUser } from '../../server/src/user.js'
import { signOut } from '../authentication.js'

/**
 * A link-styled "Log out" button, for pages that are otherwise dead ends and have no menu.
 *
 * Doesn't call the disconnect AzFn like the menu's Log Out item does: closed-space users
 * never connected, and a user banned while connected already got disconnected server-side.
 *
 * Does a reload so the reducer state doesn't carry over to the next login.
 */
export function LogOutLinkButton () {
  const logOut = () => {
    signOut().then(() => window.location.reload())
  }

  return <button className='link-styled-button' onClick={logOut}>Log Out</button>
}

interface UserIdentityProps {
  user: MinimalUser
  email: string
}

export function UserIdentity (props: UserIdentityProps) {
  const { user, email } = props
  return <><b>{user.username}</b> ({email}, id {user.id})</>
}

export function LoggedInLine (props: UserIdentityProps) {
  return <>You&apos;re logged in as <UserIdentity {...props} />. Wrong account? <LogOutLinkButton />.</>
}
