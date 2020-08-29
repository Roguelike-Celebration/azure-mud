import React from 'react'
import { SlashCommands } from '../SlashCommands'

export default function HelpView () {
  const rows = SlashCommands.map(command => {
    return (
      <tr key={command.type}>
        <td>{command.invocations.join(', ')}</td>
        <td>{command.description}</td>
      </tr>
    )
  })

  return (
    <div>
      <h1>Welcome!</h1>
      <p>Welcome to the Roguelike Celebration social space! This is a custom-built, mainly chat-based site for Roguelike Celebration 2020.</p>
      <p>Just remember you can access this reference via the <strong>Help</strong> option in the left sidebar, or via typing <strong>/help</strong> into the chatbox.</p>
      <p>If you have questions, feedback (we would <em>love</em> feedback on the social space), or need to report a code of conduct violation, contact us via the <strong>/mod</strong> command.</p>
      <h2>Quick Guide</h2>
      <ul>
        <li>Text chat and video chat are done via the center pane</li>
        <li>You can edit your profile, change the color scheme, or log out by clicking your user name in the upper-left corner</li>
        <li>The top of the left sidebar contains informational data, such as the map, schedule, and code of conduct</li>
        <li>You can navigate by clicking Map and selecting a room, clicking the highlighted links in the room description, or using the bottom of the left sidebar</li>
        <li>You can view the profile or whisper another user by clicking on their name</li>
      </ul>
      <h2>Slash Commands Reference</h2>
      <table>
        {rows}
      </table>
    </div>
  )
}
