import React from 'react'

export interface ScheduleEntry {
  time: Date,
  text: string,
  roomIds: string[]
}

function ScheduleEntry (time: string, day: number, text: string, roomIds?: string[]) {
  const dayOneDate = (time) => new Date(`2020-10-03T${time}:00.000-07:00`)
  const dayTwoDate = (time) => new Date(`2020-10-04T${time}:00.000-07:00`)

  if (day === 1) {
    return {
      time: dayOneDate(time), text: text, roomIds: roomIds
    }
  } else if (day === 2) {
    return {
      time: dayTwoDate(time), text: text, roomIds: roomIds
    }
  } else {
    console.error('Your static data is messed up, somehow.')
  }
}

// Including these here to be swapped in Saturday to Sunday.
export const ScheduleEntries = [
  ScheduleEntry('09:15', 2, 'Intro / Housekeeping', ['theater']),
  ScheduleEntry('09:30', 2, 'Lightning Talks 2: Xalavier Nelson Jr., Max Kreminski, Clarissa Littler, Nicholas Feinberg, Tanya X. Short', ['theater']),
  ScheduleEntry('10:30', 2, 'Game Showcase / Unconferencing #3', ['northShowcaseHall', 'eastShowcaseHall', 'southShowcaseHall', 'westShowcaseHall', 'unconference']),
  ScheduleEntry('11:00', 2, 'Joel Clark: A Perfectly Mundane Blaseball Experience', ['theater']),
  ScheduleEntry('11:30', 2, 'Cat Manning: How To Build A Character System That Doesn\'t Fall Apart Two Turns Later (with apologies to PKD)', ['theater']),
  ScheduleEntry('12:00', 2, 'Gabriel Koenig: Good Mutation/Bad Mutation: Player Agency in Procedural Generation', ['theater']),
  ScheduleEntry('12:30', 2, 'Break'),
  ScheduleEntry('13:30', 2, 'Caelyn Sandel: Teaching the Fun of Losing', ['theater']),
  ScheduleEntry('14:00', 2, 'Ivy Melinda: A flower in the garden: cultivating a community for Caves of Qud', ['theater']),
  ScheduleEntry('14:30', 2, 'Kate Compton: Making Polite Programming Languages: How to Design a Generative Language without a Programming Language Degree', ['theater']),
  ScheduleEntry('15:00', 2, 'Aaron A. Reed: Cadences, Lacunae, and Subcutaneans: Ten Years of Procedural Novels', ['theater']),
  ScheduleEntry('15:30', 2, 'Break'),
  ScheduleEntry('16:00', 2, 'Julian Day: Poetry at the Edge of Roguelikes: Writing Around Iterative Media', ['theater']),
  ScheduleEntry('16:30', 2, 'Todd Furmanski: Mysty Roguelikes, or: Using First Person Point-and-Click Paradigms with Realtime Graphics and Simulation', ['theater']),
  ScheduleEntry('17:00', 2, 'Lightning Talks 3: Lee Tusman, Alexander Martin, Josh Grams, Adrian Herbez, Younès Rabii, Duke Dougal', ['theater']),
  ScheduleEntry('18:00', 2, 'Closing Announcements', ['theater']),
  ScheduleEntry('18:15', 2, 'Unconferencing #4', ['unconference']),
  ScheduleEntry('19:30', 2, 'Wrap')]

export default function ScheduleView () {
  const formatter = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' })
  const userTimeZone = formatter.resolvedOptions().timeZone

  const rows = ScheduleEntries.flatMap(r => {
    if (r.text === 'Break') {
      return [(<tr key={formatter.format(r.time) + 'hr1'}><th className='break' colSpan={2}><hr /></th></tr>),
        (<tr key={formatter.format(r.time) + 'text'}><td className='time'>{formatter.format(r.time)}</td><td className='segment'>**** BREAK ****</td></tr>),
        (<tr key={formatter.format(r.time) + 'hr2'}><th className='break' colSpan={2}><hr /></th></tr>)]
    } else {
      return [(
        <tr key={formatter.format(r.time)}>
          <td className='time'>{formatter.format(r.time)}</td>
          <td className='segment'>{r.text}</td>
        </tr>
      )]
    }
  })

  return (
    <div id='Schedule'>
      <h1>Schedule</h1>
      <p>Times below should be in your local time zone. We believe your time zone is {userTimeZone}.</p>
      <table>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  )
}
