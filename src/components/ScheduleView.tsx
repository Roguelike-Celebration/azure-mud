import React from 'react'

const SOCIAL_TIME = 'Social Time'

// Generate the current date for both the schedule and "happening now"
// If you want to test functionality, stub in a fake date here
// (this only exists to allow that testing functionality)
export function nowDate (): Date {
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
const AFTERPARTY_END = new Date('2026-10-21T19:00:00-07:00')

const dayPreview = (time: string) => new Date(`2026-09-13T${time}:00.000-07:00`)
const dayOneDate = (time: string) => new Date(`2026-10-16T${time}:00.000-07:00`)
const dayTwoDate = (time: string) => new Date(`2026-10-17T${time}:00.000-07:00`)
const dayThreeDate = (time: string) => new Date(`2026-10-18T${time}:00.000-07:00`)
const dayAfterparty = (time: string) => new Date(`2026-10-21T${time}:00.000-07:00`)

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
  } else if (day === 4) {
    return {
      time: dayAfterparty(time), text: text, roomIds: roomIds, breakoutRoomId: breakoutRoomId, day
    }
  } else {
    throw new Error(`Your static data is messed up, somehow. day=${day}`)
  }
}

export const ScheduleEntries: ScheduleEntry[] = [
  ScheduleEntry('13:45', 0, 'Doors Open'),
  ScheduleEntry('14:00', 0, 'Kickoff'),
  ScheduleEntry('14:15', 0, 'Martin Pichlmair: Ancient Roguelikes: The Pre-History of Roguelike Games', ['theater']),
  ScheduleEntry('14:45', 0, 'Greg L: Bitwise Black Magic: How to Computer, Better Faster Stronger', ['theater']),
  ScheduleEntry('15:15', 0, 'Jamie Brittain: Don\'t Save The @: What Roguelikes Teach Us About Story Structure', ['theater']),
  ScheduleEntry('15:45', 0, SOCIAL_TIME),
  ScheduleEntry('16:30', 0, 'Doors Close'),

  ScheduleEntry('18:00', 1, 'Doors Open'),
  ScheduleEntry('20:00', 1, 'Doors Close'),

  ScheduleEntry('09:00', 2, 'Doors Open'),
  ScheduleEntry('09:15', 2, 'Kickoff', ['theater']),
  ScheduleEntry('09:30', 2, '“Unfolding” Traps: Extending Hazards Across Time and Space', ['theater'], 'dugout'),
  ScheduleEntry('10:00', 2, 'The City, The Street, The Lens: Perspectives on Building and Appreciating Generative Systems', ['theater'], 'pressbox'),
  ScheduleEntry('10:30', 2, 'Corrupted Databases - Building an (In)finitely Repeatable Logic Puzzle in a Discord Bot', ['theater'], 'vipSeats'),
  ScheduleEntry('10:45', 2, 'Spaces for Contemplation: Procedural Generation as a Tactic for Nonlinear Narrative in Art', ['theater'], 'waterboy'),
  ScheduleEntry('11:00', 2, SOCIAL_TIME),
  ScheduleEntry('11:30', 2, 'it\'s standing right behind you: interface games as metaleptic convergences', ['theater'], 'pressbox'),
  ScheduleEntry('12:00', 2, 'Mazes: Are we lost yet?', ['theater'], 'vipSeats'),
  ScheduleEntry('12:30', 2, 'Dungeons, digging, and wells - the gamers yearn for the mines. This is a retrospective of video game holes.', ['theater'], 'dugout'),
  ScheduleEntry('13:00', 2, SOCIAL_TIME),
  ScheduleEntry('13:45', 2, 'Found (Mathematical) Objects: Generative Beats Without AI/ML', ['theater'], 'dugout'),
  ScheduleEntry('14:15', 2, 'Some Quite Fantastic Shapes: Procedural Narrative & Terry Riley’s In C', ['theater'], 'pressbox'),
  ScheduleEntry('14:45', 2, SOCIAL_TIME),
  ScheduleEntry('15:15', 2, 'Totally Not a Roguelike Deckbuilder', ['theater'], 'dugout'),
  ScheduleEntry('15:30', 2, 'Coin Flips, Violence and Spreadsheets: the binomial distribution in Fire Emblem: Three Houses', ['theater'], 'pressbox'),
  ScheduleEntry('15:45', 2, 'making sudoku poems using tools', ['theater'], 'vipSeats'),
  ScheduleEntry('16:15', 2, SOCIAL_TIME),
  ScheduleEntry('16:45', 2, 'Exploring the Monte Carlo Forest: Using MCTS to balance your game and enlighten your monsters', ['theater'], 'dugout'),
  ScheduleEntry('17:15', 2, 'Modular Motivations: Building Reactive Roguelike NPCs', ['theater'], 'waterboy'),
  ScheduleEntry('17:30', 2, SOCIAL_TIME),
  ScheduleEntry('18:00', 2, 'Unconferencing', ['unconferencingHub']),
  ScheduleEntry('19:00', 2, 'Doors Close'),

  ScheduleEntry('09:00', 3, 'Doors Open'),
  ScheduleEntry('09:15', 3, 'Kickoff', ['theater']),
  ScheduleEntry('09:30', 3, 'Stealing roguelike mechanics from Microsoft Word', ['theater'], 'waterboy'),
  ScheduleEntry('09:45', 3, 'Baseball Is a Roguelike (no, really)', ['theater'], 'dugout'),
  ScheduleEntry('10:00', 3, 'Roguelike Design = Instructional Design: Connecting Procgen and Pedagogy', ['theater'], 'pressbox'),
  ScheduleEntry('10:30', 3, 'Localizing Caves of Qud', ['theater'], 'vipSeats'),
  ScheduleEntry('11:00', 3, SOCIAL_TIME),
  ScheduleEntry('11:15', 3, 'Unconferencing', ['unconferencingHub']),
  ScheduleEntry('12:15', 3, SOCIAL_TIME),
  ScheduleEntry('13:15', 3, 'Cellular automata in Roguelikes', ['theater'], 'dugout'),
  ScheduleEntry('13:45', 3, 'Hubris, Bluffing, and Large Numbers: Exploring Push Your Luck', ['theater'], 'pressbox'),
  ScheduleEntry('14:15', 3, 'Kitbashing & Databending for Proc-Gen', ['theater'], 'vipSeats'),
  ScheduleEntry('14:45', 3, SOCIAL_TIME),
  ScheduleEntry('15:15', 3, 'Please Hold: Building a Playable Museum Exhibit About 1993 Game Support', ['theater'], 'dugout'),
  ScheduleEntry('15:45', 3, 'Hack: The "Lost Roguelike"', ['theater'], 'pressbox'),
  ScheduleEntry('16:30', 3, SOCIAL_TIME),
  ScheduleEntry('17:00', 3, 'Roguelike, more like Roguedyke: A queer Reading of Traditional Roguelike Conventions', ['theater'], 'dugout'),
  ScheduleEntry('17:30', 3, 'Roguelike Run Variety: Balancing Intra and Inter', ['theater'], 'pressbox'),
  ScheduleEntry('17:45', 3, 'The Art of the Long-form Roguelike Run: The Nuzlocke', ['theater'], 'vipSeats'),
  ScheduleEntry('18:00', 3, 'The Decades-Long Design Experiment That Escapes Permadeath and Finds a New Form Every Run', ['theater'], 'waterboy'),
  ScheduleEntry('18:15', 3, SOCIAL_TIME),
  ScheduleEntry('19:00', 3, 'Doors Close'),

  ScheduleEntry('09:00', 4, 'Mods cleaning up the space for after-party'),
  ScheduleEntry('17:00', 4, 'Doors Open'),
  ScheduleEntry('17:01', 4, 'After-Party: private MUD tour for speakers'),
  ScheduleEntry('18:30', 4, 'Doors Close')
]

export default function ScheduleView () {
  const formatter = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' })
  const userTimeZone = formatter.resolvedOptions().timeZone

  const today = nowDate()

  let day = 4
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
  } else if (today <= AFTERPARTY_END) {
    day = 4
    dayText = 'After-Party'
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
