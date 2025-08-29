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

const PREVIEW_END = new Date('2025-09-10T15:30:00-07:00')
const FIRST_DAY_END = new Date('2025-10-24T21:00:00-07:00')
const SECOND_DAY_END = new Date('2025-10-25T21:00:00-07:00')
const THIRD_DAY_END = new Date('2025-10-26T21:00:00-07:00')

// Just guessing at the preview time for 2025; haven't set it yet as of 5/8/25? -apj
const dayPreview = (time) => new Date(`2025-09-08T${time}:00.000-07:00`)
const dayOneDate = (time) => new Date(`2025-10-24T${time}:00.000-07:00`)
const dayTwoDate = (time) => new Date(`2025-10-25T${time}:00.000-07:00`)
const dayThreeDate = (time) => new Date(`2025-10-26T${time}:00.000-07:00`)

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

// This is still last year 2024's schedule. Leaving in place as example data for now. -apj 5/8/25
export const ScheduleEntries: ScheduleEntry[] = [
  ScheduleEntry('12:45', 0, 'Doors Open'),
  ScheduleEntry('13:00', 0, 'James Cartlidge: The Rise of the Roguelite: Inside a Gaming Phenomenon', ['theater']),
  ScheduleEntry('13:45', 0, 'Andrew Cedotal: Literary Origins of the Rogue Archetype', ['theater']),
  ScheduleEntry('14:15', 0, 'Gavin Verhey: Fireside Chat About Randomness in Magic: The Gathering', ['theater']),
  ScheduleEntry('15:00', 0, SOCIAL_TIME),
  ScheduleEntry('15:30', 0, 'Doors Close'),

  ScheduleEntry('18:00', 1, 'Doors Open'),
  ScheduleEntry('20:00', 1, 'Doors Close'),

  ScheduleEntry('09:00', 2, 'Doors Open'),
  ScheduleEntry('09:15', 2, 'Kickoff', ['theater']),
  ScheduleEntry('09:30', 2, 'Harry Solomons: Trampling on Ghosts: Hauntology and Permadeath', ['theater'], 'goblinSingers'),
  ScheduleEntry('10:00', 2, 'Cezar Capacle: Enhancing Narrative Through Randomness and Complications', ['theater'], 'joust'),
  ScheduleEntry('10:30', 2, 'Max Bottega: Keeping Art Direction ', ['theater'], 'whipShow'),
  ScheduleEntry('10:45', 2, 'Stanley W. Baxton: Brining Real-World Occultism into Your Games Without Accidentally Being Racist', ['theater'], 'fountain'),
  ScheduleEntry('11:00', 2, SOCIAL_TIME),
  ScheduleEntry('11:30', 2, 'Jeff Entmenn and Martin Austwick: Neutrinowatch - the podcast that plays itself ', ['theater'], 'goblinSingers'),
  ScheduleEntry('12:00', 2, 'Nic Junius: Braided Narratives: Or How I Learned to Stop Worrying and Love Linear Stories', ['theater'], 'joust'),
  ScheduleEntry('12:30', 2, SOCIAL_TIME),
  ScheduleEntry('13:30', 2, 'Pandamander: "Out of Book": The Psychology of Why Roguelikes Keep Us Playing', ['theater'], 'goblinSingers'),
  ScheduleEntry('13:45', 2, 'Loren Schmidt: Inverse Terrain Solver', ['theater'], 'joust'),
  ScheduleEntry('14:15', 2, 'Adrian: Probably Impossible: NecroDancer\'s network code', ['theater'], 'whipShow'),
  ScheduleEntry('14:45', 2, SOCIAL_TIME),
  ScheduleEntry('15:15', 2, 'John Harris: A Trip Through The Mystery Dungeons', ['theater'], 'goblinSingers'),
  ScheduleEntry('15:45', 2, 'Marlowe Dobbe: A Swarm of Monsters is Hard To Build: Generating Visual Concepts for Enemies in Roguelikes', ['theater'], 'joust'),
  ScheduleEntry('16:15', 2, SOCIAL_TIME),
  ScheduleEntry('16:45', 2, 'John Bond: Doors? How Roguelike games take you places', ['theater'], 'goblinSingers'),
  ScheduleEntry('17:00', 2, 'Dan Norder: Chase: The BASIC Language Proto-Roguelike', ['theater'], 'joust'),
  ScheduleEntry('17:30', 2, SOCIAL_TIME),
  ScheduleEntry('18:00', 2, 'Unconferencing', ['unconferencingHub']),
  ScheduleEntry('19:00', 2, 'Doors Close'),

  ScheduleEntry('09:00', 3, 'Doors Open'),
  ScheduleEntry('09:15', 3, 'Kickoff', ['theater']),
  ScheduleEntry('09:30', 3, 'Yong Zhen Zhou: Who Controls the Controller? Thinking about physical player interactions outside a digital game', ['theater'], 'goblinSingers'),
  ScheduleEntry('09:45', 3, 'Tabea Iseli: Animal Crossing meets Roguelite Dungeon Crawler: The surprising genre mixture behind Grimoire Groves', ['theater'], 'joust'),
  ScheduleEntry('10:00', 3, 'Philomena Schwab: 100\'000 wishlists in 3 months - Weird roguelikes are taking over the world', ['theater'], 'whipShow'),
  ScheduleEntry('10:15', 3, 'Kaysa Konopljak: Going legit with DotA: How to transform a thousand authors into four', ['theater'], 'fountain'),
  ScheduleEntry('10:45', 3, 'Alexander Birke: Practical procedural world and story generation in Sea Of Rifts, a naval roguelike RPG', ['theater'], 'theater'),
  ScheduleEntry('11:15', 3, SOCIAL_TIME),
  ScheduleEntry('11:45', 3, 'Unconferencing', ['unconferencingHub']),
  ScheduleEntry('12:45', 3, SOCIAL_TIME),
  ScheduleEntry('13:30', 3, 'Robin Mendoza: The Use of Knowledge in the Labyrinth: The price mechanism as a storytelling device', ['theater'], 'goblinSingers'),
  ScheduleEntry('13:45', 3, 'Oliver Withington: The Right Variety: Understanding and Visualising the Output Diversity of Your Generators', ['theater'], 'joust'),
  ScheduleEntry('14:00', 3, 'Eiríkr Åsheim: Uxn: Permacomputing & Roguelikes', ['theater'], 'whipShow'),
  ScheduleEntry('14:15', 3, 'Brian Cronin: Black Box Sim for Roguelikes', ['theater'], 'fountain'),
  ScheduleEntry('14:45', 3, SOCIAL_TIME),
  ScheduleEntry('15:15', 3, 'Isaac Io Schankler: Orb Pondering Simulator LIVE!', ['theater'], 'goblinSingers'),
  ScheduleEntry('16:00', 3, 'Emily Halina: New Levels from a Single Example via Tree-based Reconstructive Partitioning (TRP)', ['theater'], 'joust'),
  ScheduleEntry('16:30', 3, 'Courtney: Cheating the System (By Design!) for Epic Combos', ['theater'], 'whipShow'),
  ScheduleEntry('16:45', 3, SOCIAL_TIME),
  ScheduleEntry('17:15', 3, 'Joe: Magic in Game Design: (Mis)Directing the Player\'s Attention', ['theater'], 'goblinSingers'),
  ScheduleEntry('17:30', 3, 'Tyler Coleman: Finding your 80/20 Rule with Proc-Gen', ['theater'], 'joust'),
  ScheduleEntry('18:00', 3, 'Nat: Procedurality and the Primes', ['theater'], 'whipShow'),
  ScheduleEntry('18:30', 3, SOCIAL_TIME),
  ScheduleEntry('19:00', 3, 'Doors Close')
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
