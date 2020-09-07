import React from 'react'
import config from '../config'

export default function LoggedOutView () {
  return (
    <div>
      <header role="banner">
        <h1>Welcome to Roguelike Celebration 2020!</h1>
      </header>
      <main role="main">
        <p>
          This is a social space for attendees of{' '}
          <a href={'https://roguelike.club'}>Roguelike Celebration</a>, a
          community-generated weekend of talks, games, and conversations about
          roguelikes and related topics, including procedural generation and
          game design. It&apos;s for fans, players, developers, scholars, and
          everyone else!
        </p>
        <a
          href={`${
            config.SERVER_HOSTNAME
          }/.auth/login/twitter?post_login_redirect_url=${encodeURIComponent(
            window.location.href
          )}`}
        >
          Log In With Twitter
        </a>
        <p>
          We are using Twitter for authentication only. You will have the
          opportunity to pick a distinct chat handle when you enter the space.
          Feel free to sign up for a free throwaway Twitter account if
          necessary.
        </p>
        <p>
          By entering the space, you agree to our{' '}
          <a href={'https://roguelike.club/code.html'}>Code of Conduct</a>.
        </p>
      </main>
    </div>
  )
}
