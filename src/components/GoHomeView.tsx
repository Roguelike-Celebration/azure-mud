import React from 'react'

export default function GoHomeView () {
  const thisYear: string = `${(new Date()).getFullYear()}`

  return (
    <div id='go-home'>
      <h1>A magical force repels you from the entrance</h1>
      <p>Roguelike Celebration is currently closed! Check the <a href={`https://roguelike.club/event${thisYear}.html`} target="_blank" rel="noreferrer">schedule</a> to see when our doors will be open again.</p>
      <p>We look forward to celebrating again with you soon :)</p>
    </div>
  )
}
