import React from 'react'

export default function ScheduleView () {
  const dateStr = (time) => `2020-10-03T${time}:00.000-07:00`

  // To do: replace with actual speaker names
  const times = [
    ['09:30', 'Intro / Housekeeping'],
    ['09:30', 'Talk 1'],
    ['10:30', 'Talk 2'],
    ['10:30', 'Unconferencing #1'],
    ['11:30', 'Talk 3'],
    ['12:30', 'Talk 4'],
    ['12:30', 'Break'],
    ['13:30', 'Lightning Talks'],
    ['14:30', 'Talk 5'],
    ['15:30', 'Talk 6'],
    ['15:30', 'Break'],
    ['16:30', 'Talk 7'],
    ['16:30', 'Talk 8'],
    ['17:30', 'Outro / Performances'],
    ['17:30', 'Game Showcase / Unconferencing #2'],
    ['18:30', 'Wrap']
  ]

  // Including these here to be swapped in Saturday to Sunday.
  // Again, needs to be replaced with actual speaker names
  // const SundayTimes = [
  //   ['09:30', 'Intro / Housekeeping'],
  //   ['09:30', 'Lightning Talks'],
  //   ['10:30', 'Game Showcase / Unconferencing #3'],
  //   ['11:30', 'Talk 9'],
  //   ['12:30', 'Talk 10'],
  //   ['12:30', 'Break'],
  //   ['13:30', 'Talk 11'],
  //   ['14:30', 'Talk 12'],
  //   ['14:30', 'Talk 13'],
  //   ['15:30', 'Talk 14'],
  //   ['15:30', 'Break'],
  //   ['16:30', 'Talk 15'],
  //   ['16:30', 'Talk 16'],
  //   ['17:30', 'Lightning Talks'],
  //   ['18:30', 'Outro / Performances'],
  //   ['18:30', 'Unconferencing #4'],
  //   ['19:30', 'Wrap']
  // ]

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
