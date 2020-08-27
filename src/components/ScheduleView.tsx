import React from 'react'

export default function ScheduleView () {
  const dateStr = (time) => `2020-08-30T${time}:00.000-07:00`

  const times = [
    ['16:00', 'Doors Open'],
    ['16:20', 'Kickoff'],
    ['16:30', 'Darren Grey'],
    ['16:40', 'Julian Day'],
    ['16:50', 'Todd Furmanski'],
    ['17:00', 'Tabitha Sable'],
    ['17:10', 'Break'],
    ['17:20', 'Gabriel Koenig'],
    ['17:30', 'Cat Manning'],
    ['17:40', 'Kate Comptom'],
    ['17:50', 'Break'],
    ['18:10', 'Preview of "Help Me Steal The Mona Lisa"'],
    ['19:00', 'Doors Close']
  ]

  const formatter = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' })

  const rows = times.map(r => {
    const date = new Date(dateStr(r[0]))

    return (
      <tr key={r[0]}>
        <td>{formatter.format(date)}</td>
        <td>{r[1]}</td>
      </tr>
    )
  })

  return (
    <div>
      <h1>Schedule</h1>
      <table>
        {rows}
      </table>
    </div>
  )
}
