import React from 'react'
import { sendMagicEmail } from '../../networking'
import '../../../style/loggedOut.css'

export default function LoggedOutView () {
  return (
    <div className='logged-out'>
      <header role="banner">
        <h1>Welcome to the secret Roguelike Celebration backstage area!</h1>
      </header>
      <main role="main">
        <p>
          If you&apos;re not a Roguelike Celebration admin, this isn&apos;t for you. If you should be an admin, but can&apos;t log in, ask in our other chat.
        </p>
        <p>If you are an admin, log into the normal social space, then come back here.</p>
      </main>
    </div>
  )
}
