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
      <p>Welcome to the Roguelike Celebration social space! This is an open-source chat app / virtual world built specifically for Roguelike Celebration.</p>
      <p>You can access this reference at any time by clicking the <strong>Help</strong> button in the left sidebar or by typing <strong>/help</strong> into the chat box.</p>
      <p>If you have questions, feedback, or need to report a code of conduct violation, you can contact us via the <strong>/mod</strong> command.</p>
      <h2>Command Reference</h2>
      <p>You can enter any of these commands by typing directly into the chat box.</p>
      <table>
        {rows}
      </table>
    </div>
  )
}
