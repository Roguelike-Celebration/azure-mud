import React from 'react'

const SOCIAL_TIME = 'Social Time'

// Generate the current date for both the schedule and "happening now"
// If you want to test functionality, stub in a fake date here
// (this only exists to allow that testing functionality)
export function nowDate () {
  return new Date()
}

export interface ScheduleEntry {
  time: Date,
  text: string,
  roomIds: string[]
  breakoutRoomId?: string,
  day: number
}

const PREVIEW_END = new Date('2026-09-13T17:00:00-07:00')
const FIRST_DAY_END = new Date('2026-10-16T21:00:00-07:00')
const SECOND_DAY_END = new Date('2026-10-17T21:00:00-07:00')
const THIRD_DAY_END = new Date('2026-10-18T21:00:00-07:00')

const dayPreview = (time) => new Date(`2026-09-13T${time}:00.000-07:00`)
const dayOneDate = (time) => new Date(`2026-10-16T${time}:00.000-07:00`)
const dayTwoDate = (time) => new Date(`2026-10-17T${time}:00.000-07:00`)
const dayThreeDate = (time) => new Date(`2026-10-18T${time}:00.000-07:00`)

function ScheduleEntry (time: string, day: number, text: string, roomIds?: string[], breakoutRoomId?: string): ScheduleEntry {
  if (day === 0) {
    return {
      time: dayPreview(time), text: text, roomIds: roomIds, breakoutRoomId: breakoutRoomId, day
    }
  } else if (day === 1) {
    return {
      time: dayOneDate(time), text: text, roomIds: roomIds, breakoutRoomId: breakoutRoomId, day
    }
  } else if (day === 2) {
    return {
      time: dayTwoDate(time), text: text, roomIds: roomIds, breakoutRoomId: breakoutRoomId, day
    }
  } else if (day === 3) {
    return {
      time: dayThreeDate(time), text: text, roomIds: roomIds, breakoutRoomId: breakoutRoomId, day
    }
  } else {
    console.error('Your static data is messed up, somehow.')
  }
}

export const ScheduleEntries: ScheduleEntry[] = [
  ScheduleEntry('13:45', 0, 'Doors Open'),
  ScheduleEntry('14:00', 0, 'Kickoff'),
  ScheduleEntry('14:15', 0, 'Martin Pichlmair: Ancient Roguelikes: The Pre-History of Roguelike Games', ['theater']),
  ScheduleEntry('14:45', 0, 'Greg L: Bitwise Black Magic: How to Computer, Better Faster Stronger', ['theater']),
  ScheduleEntry('15:15', 0, 'Jamie Brittain: Don\'t Save The @: What Roguelikes Teach Us About Story Structure', ['theater']),
  ScheduleEntry('15:45', 0, SOCIAL_TIME),
  ScheduleEntry('16:30', 0, 'Doors Close')
]

export default function ScheduleView () {
  const formatter = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' })
  const userTimeZone = formatter.resolvedOptions().timeZone

  const today = nowDate()

  let day = 3
  let dayText = 'Sunday'
  if (today <= PREVIEW_END) {
    day = 0
    dayText = 'Preview'
  } else if (today <= FIRST_DAY_END) {
    day = 1
    dayText = 'Friday Pre-Party'
  } else if (today <= SECOND_DAY_END) {
    day = 2
    dayText = 'Saturday'
  } else if (today <= THIRD_DAY_END) {
    day = 3
    dayText = 'Sunday'
  }
  const entries = ScheduleEntries.filter(e => e.day === day)

  const rows = entries.flatMap(r => {
    if (r.text === SOCIAL_TIME) {
      return [(<tr key={formatter.format(r.time) + 'hr1'}><th className='break' colSpan={2}><hr /></th></tr>),
        (<tr key={formatter.format(r.time) + 'text'}><td className='time'>{formatter.format(r.time)}</td><td className='segment'>Social Time</td></tr>),
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
      <h1>Schedule: {dayText}</h1>
      <p>Times below should be in your local time zone. We believe your time zone is {userTimeZone}.</p>
      <table>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  )
}
