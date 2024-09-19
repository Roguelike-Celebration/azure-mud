import React from 'react'
import { sendMagicEmail } from '../networking'
import '../../style/loggedOut.css'

export default function LoggedOutView () {
  const [email, setEmail] = React.useState('')
  const [emailSent, setEmailSent] = React.useState(false)

  const sendEmail = () => {
    sendMagicEmail(email)
    console.log("Email sent to", email)
    setEmailSent(true)
  }

  const emailInputView = (
    <div className="email">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              autoFocus
            />
            {/* TODO: wire up enter key */}
            <button onClick={sendEmail}>Send Login Link</button>
          </div>  
  )

  const emailSentView = (
    <div className='email-sent'>We sent a magic login link to <strong>{email}</strong>. Check your inbox!</div>
  )

  return (
    <div>
      <header role="banner" className="logged-out">
        <h1>Welcome to Roguelike Celebration 2024!</h1>
      </header>
      <main role="main" className="logged-out">
        <p>
          This is a social space for attendees of{' '}
          <a href='https://roguelike.club'>Roguelike Celebration</a>, a
          community-generated weekend of talks, games, and conversations about
          roguelikes and related topics, including procedural generation and
          game design. It&apos;s for fans, players, developers, scholars, and
          everyone else!
        </p>
        <p>After entering your email address, we will email you a 'magic' link to log you in, no password needed!</p>
          {emailSent ? emailSentView : emailInputView}   
        <p>
          <strong>We now only support logging in via email.</strong><br/>We&apos;re sorry if you used
          a third-party login in previous years. If you sign in using the same email you used for Google, you should still be able to log in as your previous account.
        </p>
        <p>
          If it's your first time here, after logging in, you will have the opportunity to pick whatever chat handle you would
          like before entering the space.
        </p>
        <p>
          By entering the space, you agree to our{' '}
          <a href={'https://roguelike.club/code.html'}>Code of Conduct</a>.
        </p>
      </main>
    </div>
  )
}
