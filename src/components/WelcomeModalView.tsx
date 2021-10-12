import React from 'react'

export default function WelcomeModalView (props: {}) {
  return (
    <div>
      <h1>This isn&apos;t a normal chat app!</h1>
      <p>In the Roguelike Celebration conference space,
        you can only send/receive messages <strong>in the chat room you are currently in</strong>. </p>
      <p>You can move from virtual room to virtual room to talk to different people.</p>
      <p>Most rooms have integrated audio and video chat. You cannot be seen or heard unless you explicitly opt-in!</p>
      <p>Our hope is to facilitate smaller group conversations, to make Roguelike Celebration feel a little more like a real-world conference, and to give you a fun and playful space to explore with your fellow attendees.</p>
      <p>Happy wandering, and be wary of reading scrolls without identifying them first ;)</p>
      <p>-The Roguelike Celebration team</p>
    </div>
  )
}
