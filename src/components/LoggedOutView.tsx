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
          <a href='https://roguelike.club'>Roguelike Celebration</a>, a
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
        </a><br/>
        <a
          href={`${
            config.SERVER_HOSTNAME
          }/.auth/login/google?post_login_redirect_url=${encodeURIComponent(
            window.location.href
          )}`}
        >
          Log In With Google
        </a><br/>
        {(window as any).safari ?
          <p>
            <strong style={{color: "red"}}> You appear to be using Safari.</strong> <br/>
            If you are having difficulty logging in, you may need to allow third-party cookies 
            <ul>
              <li>On macOS, Safari -> Preferences -> uncheck "Prevent cross-site tracking"</li>
              <li>On iOS, Settings -> Safari -> uncheck "Prevent cross-site tracking"</li>
              </ul>
            We know this is sketchy! We promise we're not capturing or selling data to any third party, it's just a limitation of the way we're handling logins.<br/> 
            If you're not comfortable with this, feel free to switch to Chrome, Firefox, or another non-Safari browser.
            </p> : null
          }        
        <p>
          No matter which service you log in with, we do not access any data
          other than what is needed to authenticate you. If it would make you
          more comfortable, feel free to sign up for and use a throwaway
          account on one of these services.
        </p>
        <p>
          After logging in, you will have the opportunity to pick whatever chat handle you would
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
