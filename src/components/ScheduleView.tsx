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

const PREVIEW_END = new Date('2025-09-07T18:00:00-07:00')
const FIRST_DAY_END = new Date('2025-10-24T21:00:00-07:00')
const SECOND_DAY_END = new Date('2025-10-25T21:00:00-07:00')
const THIRD_DAY_END = new Date('2025-10-26T21:00:00-07:00')

const dayPreview = (time) => new Date(`2025-09-07T${time}:00.000-07:00`)
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

export const ScheduleEntries: ScheduleEntry[] = [
  ScheduleEntry('14:45', 0, 'Doors Open'),
  ScheduleEntry('15:10', 0, 'Kickoff'),
  ScheduleEntry('15:15', 0, 'Jon Perry: Fireside chat with Jon Perry (UFO 50)', ['theater']),
  ScheduleEntry('16:00', 0, 'Ezra Szanton: Building Synergy Networks for better Roguelike Deckbuilders', ['theater']),
  ScheduleEntry('16:30', 0, 'Alexei Pepers: Designing for System Suspense', ['theater']),
  ScheduleEntry('17:15', 0, 'Hang Out & Explore!'),
  ScheduleEntry('17:30', 0, 'Doors Close'),

  // Day "1" (Friday) for RLC 2025 wasn't really announced. But leaving this in for testing,
  // and consistency of date numbers with previous years
  ScheduleEntry('18:00', 1, 'Doors Open'),
  ScheduleEntry('20:00', 1, 'Doors Close'),

  ScheduleEntry('09:00', 2, 'Doors Open'),
  ScheduleEntry('09:15', 2, 'Kickoff', ['theater']),
  ScheduleEntry('09:30', 2, 'Michael Brough: The Roots of Roguelikes in Fantasy Fiction', ['theater'], 'underTheStage'),
  ScheduleEntry('10:00', 2, 'Sebastien "deepnight" Benard: Mixing hand-crafted content with procgen to achieve quality', ['theater'], 'dressingRooms'),
  ScheduleEntry('10:30', 2, 'Max Sahin: Stuff: the behavioral science of inventory', ['theater'], 'propsCloset'),
  ScheduleEntry('10:45', 2, 'Florence Smith Nicholls: Roll for Reminiscence: Procedural Keepsake Games', ['theater'], 'breakRoom'),
  ScheduleEntry('11:00', 2, SOCIAL_TIME),
  ScheduleEntry('11:30', 2, 'Alexander Birke and Sofie Kjær Schmidt: Hoist the colours! Art direction and tech art in Sea Of Rifts, a naval story generation RPG', ['theater'], 'dressingRooms'),
  ScheduleEntry('12:00', 2, 'bleeptrack: From Code to Craft: Procedural Generation for the Physical World', ['theater'], 'propsCloset'),
  ScheduleEntry('12:30', 2, 'Zeno Rogue: The best genre for a non-Euclidean game', ['theater'], 'breakRoom'),
  ScheduleEntry('13:00', 2, SOCIAL_TIME),
  ScheduleEntry('13:30', 2, 'Cole Wehrle: Play as Procedural Generation: Oath as a Roguelike Strategy Game', ['theater'], 'dressingRooms'),
  ScheduleEntry('14:00', 2, 'Jeff Lait: Teaching Long Term Consequences in Games', ['theater'], 'propsCloset'),
  ScheduleEntry('14:30', 2, SOCIAL_TIME),
  ScheduleEntry('15:00', 2, 'Ray: A Mythopoetic Interface Reading of Caves of Qud', ['theater'], 'dressingRooms'),
  ScheduleEntry('15:15', 2, 'Jonathan Pagnutti: Wait, No, Hear Me Out: Simulating Encounter AI in Slay the Spire with SQL', ['theater'], 'propsCloset'),
  ScheduleEntry('15:30', 2, 'Jamie Brew: Robot Karaoke Goes Electric', ['theater'], 'breakRoom'),
  ScheduleEntry('16:00', 2, SOCIAL_TIME),
  ScheduleEntry('16:30', 2, 'Stephen G. Ware: Planning and Replanning Structured Adaptive Stories: 25 Years of History', ['theater'], 'dressingRooms'),
  ScheduleEntry('17:00', 2, 'Tyriq: Scrubbin\' Trubble: The Journey to Multiplayer Roguelikery', ['theater'], 'propsCloset'),
  ScheduleEntry('17:15', 2, 'Andrew Doull: Roguelike Radio 2011-present', ['theater'], 'breakRoom'),
  ScheduleEntry('17:30', 2, SOCIAL_TIME),
  ScheduleEntry('18:00', 2, 'Unconferencing', ['unconferencingHub']),
  ScheduleEntry('19:00', 2, 'Doors Close'),

  ScheduleEntry('09:00', 3, 'Doors Open'),
  ScheduleEntry('09:30', 3, 'Kickoff', ['theater']),
  ScheduleEntry('09:45', 3, 'Ada Null: Dyke sex and ennui: Generating unending narrative in \'Kiss Garden\'', ['theater'], 'dressingRooms'),
  ScheduleEntry('10:00', 3, 'Younès Rabii: We Are Maxwell\'s Demons: The Thermodynamics of Procedural Generators', ['theater'], 'propsCloset'),
  ScheduleEntry('10:30', 3, 'Dennis Greger: The Procedurality of Reality TV Design - An Overview', ['theater'], 'breakRoom'),
  ScheduleEntry('10:45', 3, SOCIAL_TIME),
  ScheduleEntry('11:15', 3, 'Unconferencing', ['unconferencingHub']),
  ScheduleEntry('12:15', 3, SOCIAL_TIME),
  ScheduleEntry('13:15', 3, 'Paul Dean: Picking up the Pieces: building story in a roguelike world', ['theater'], 'dressingRooms'),
  ScheduleEntry('13:45', 3, 'Patrick Belanger and Jackson Wagner: Hand-Crafted Randomness: Storytelling in Wildermyth\'s Proc-Gen World', ['theater'], 'propsCloset'),
  ScheduleEntry('14:15', 3, 'Nifflas: Music algorithm showcase', ['theater'], 'breakRoom'),
  ScheduleEntry('14:45', 3, SOCIAL_TIME),
  ScheduleEntry('15:15', 3, 'Seth Cooper: Building a Roguelike with a Tile Rewrite Language', ['theater'], 'dressingRooms'),
  ScheduleEntry('15:30', 3, 'Quinten Konyn: Anatomy of a Morgue File', ['theater'], 'propsCloset'),
  ScheduleEntry('15:45', 3, 'Alexander King: Don\'t Pick Just One: Set-Based Card Mechanics in Roguelike-Deckbuilders', ['theater'], 'breakRoom'),
  ScheduleEntry('16:00', 3, 'Brian Cronin: Playtesting Process for Ultra Small Teams', ['theater'], 'underTheStage'),
  ScheduleEntry('16:30', 3, SOCIAL_TIME),
  ScheduleEntry('17:00', 3, 'Mark Gritter: Sol LeWitt, Combinatorial Enumeration, and Rogue', ['theater'], 'dressingRooms'),
  ScheduleEntry('17:15', 3, 'Dan Dilorio: Luck be a Landlord - 10 Lessons Learned', ['theater'], 'propsCloset'),
  ScheduleEntry('17:45', 3, 'Liza Knipscher: The Form and Function of Weird Li\'l Guys: Procedural Organism Generation in a Simulated Ecosystem', ['theater'], 'unconfLilGuys'),
  ScheduleEntry('18:15', 3, SOCIAL_TIME),
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
