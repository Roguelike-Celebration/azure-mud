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
      <h1>Commands</h1>
      <table>
        {rows}
      </table>
    </div>
  )
}
