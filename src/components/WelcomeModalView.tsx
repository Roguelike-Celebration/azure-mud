import React from 'react'

export default function WelcomeModalView (props: {}) {
  return (
    <div>
      <h1>This isn&apos;t a normal chat app!</h1>
      <p>
        In the Roguelike Celebration conference space, you can only send/receive
        messages <strong>in the chat room you are currently in</strong>.
      </p>
      <p>
        You can move from virtual room to virtual room to talk to different
        people.
      </p>
      <p>
        You may see or hear others on videochat, but they can&apos;t see or hear you
        unless you explicitly turn on your audio or video.
      </p>
      <p>
        Our hope is to facilitate smaller group conversations, to capture the feel of an in-person conference, and to give
        you a fun and playful space to explore with your fellow attendees.
      </p>
      <p>
        Happy wandering, and be wary of reading scrolls without identifying them
        first ;)
      </p>
      <p>-The Roguelike Celebration team</p>
    </div>
  )
}
