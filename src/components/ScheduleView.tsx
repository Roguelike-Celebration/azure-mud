import React from 'react'

const SOCIAL_TIME = 'Social Time'

export interface ScheduleEntry {
  time: Date,
  text: string,
  roomIds: string[]
  breakoutRoomId?: string
}

function ScheduleEntry (time: string, day: number, text: string, roomIds?: string[], breakoutRoomId?: string) {
  const dayPreview = (time) => new Date(`2022-09-11T${time}:00.000-07:00`)
  const dayOneDate = (time) => new Date(`2021-10-16T${time}:00.000-07:00`)
  const dayTwoDate = (time) => new Date(`2021-10-17T${time}:00.000-07:00`)

  if (day === 0) {
    return {
      time: dayPreview(time), text: text, roomIds: roomIds, breakoutRoomId: breakoutRoomId
    }
  } else if (day === 1) {
    return {
      time: dayOneDate(time), text: text, roomIds: roomIds, breakoutRoomId: breakoutRoomId
    }
  } else if (day === 2) {
    return {
      time: dayTwoDate(time), text: text, roomIds: roomIds, breakoutRoomId: breakoutRoomId
    }
  } else {
    console.error('Your static data is messed up, somehow.')
  }
}

// 2022 Preview

export const ScheduleEntries = [
  ScheduleEntry('16:00', 0, 'Doors Open'),
  ScheduleEntry('16:25', 0, 'Kickoff - Stream Begins', ['theater']),
  ScheduleEntry('16:30', 0, 'Casey Yano, Mega Crit', ['theater'], 'mage'),
  ScheduleEntry('17:00', 0, 'Justin Ma and Matthew Davis, Subset Games', ['theater'], 'rogue'),
  ScheduleEntry('17:30', 0, SOCIAL_TIME),
  ScheduleEntry('19:00', 0, 'Doors Close')
]

// 2021 entries, kept for formatting reminders for later

// Saturday entries
/*
export const ScheduleEntries = [
  ScheduleEntry('09:00', 1, 'Doors Open'),
  ScheduleEntry('09:15', 1, 'Kickoff', ['theater']),
  ScheduleEntry('09:30', 1, 'Michael Brough: Possibility of Roguelike Elements', ['theater'], 'mage'),
  ScheduleEntry('10:00', 1, 'Jeremiah Reid: Juice Your Turns', ['theater'], 'rogue'),
  ScheduleEntry('10:30', 1, SOCIAL_TIME),
  ScheduleEntry('11:00', 1, 'Brenda Romero: Dynamic Relationships and Traits in Empire of Sin', ['theater'], 'mage'),
  ScheduleEntry('11:15', 1, 'Jasmine Otto: Cyclic Plot Generation in a Mixed-Initiative Narrative Instrument', ['theater'], 'rogue'),
  ScheduleEntry('11:30', 1, 'Francesco Cottone: Chronicles of Stampadia and other postcards from an alternate world', ['theater'], 'tourist'),
  ScheduleEntry('11:45', 1, 'Atty Vohra: Automating D&D Combat Prep with Roguelike Principles', ['theater'], 'warrior'),
  ScheduleEntry('12:00', 1, SOCIAL_TIME),
  ScheduleEntry('13:00', 1, 'Arvi Teikari: Why Noita Became a Roguelite (and Why I Liked That a Lot)', ['theater'], 'mage'),
  ScheduleEntry('13:30', 1, 'Shawn Main: You May Already Be a Roguelike', ['theater'], 'rogue'),
  ScheduleEntry('14:00', 1, SOCIAL_TIME),
  ScheduleEntry('14:30', 1, 'Jason Grinblat: Before you fix a leak ask if it\'s a fountain (a paean for bugs and edge cases)', ['theater'], 'tourist'),
  ScheduleEntry('15:00', 1, 'Allie Signet & Joe Maliksi, Society for Internet Blaseball Research: SIBR - Sports, Splorts, and Statistics: Why Data Accessibility Matters in Blaseball and Beyond', ['theater'], 'mage'),
  ScheduleEntry('15:30', 1, 'Evan Debenham: Community-Driven Roguelike Development', ['theater'], 'warrior'),
  ScheduleEntry('16:00', 1, SOCIAL_TIME),
  ScheduleEntry('17:00', 1, 'Spencer Egart: Tooling for Roguelikes and Procgen', ['theater'], 'rogue'),
  ScheduleEntry('17:15', 1, 'Thomas Robertson: Towards a New Understanding of Procedural Super Attacks', ['theater'], 'warrior'),
  ScheduleEntry('17:30', 1, 'Dylan White: The Cost of Magic', ['theater'], 'mage'),
  ScheduleEntry('17:45', 1, 'Qristy Overton: Exhibition: Attempting Brogue on a Dance Mat', ['theater'], 'tourist'),
  ScheduleEntry('18:00', 1, SOCIAL_TIME),
  ScheduleEntry('18:15', 1, 'Unconferencing', ['unconference']),
  ScheduleEntry('19:00', 1, SOCIAL_TIME),
  ScheduleEntry('20:45', 1, 'Doors Close')
]
*/

/* export const ScheduleEntries = [
  ScheduleEntry('09:00', 2, 'Doors Open'),
  ScheduleEntry('09:15', 2, 'Kickoff', ['theater']),
  ScheduleEntry('09:30', 2, 'Michael Langford: For the Squishies ⚡ Making Roguelikes Accessible to (Younger) Children and their Parents', ['theater'], 'warrior'),
  ScheduleEntry('09:45', 2, 'Younès Rabii: Pokemon Glitch - Story of A Roguelike With No Author', ['theater'], 'tourist'),
  ScheduleEntry('10:00', 2, 'Sraëka-Lillian: Procedural Phonology: Generating Name Generators', ['theater'], 'rogue'),
  ScheduleEntry('10:15', 1, SOCIAL_TIME),
  ScheduleEntry('10:30', 2, 'Unconferencing', ['unconference']),
  ScheduleEntry('11:30', 2, 'Alice Lai: All Together Now: Creating Multiplicative Power in Hades', ['theater'], 'warrior'),
  ScheduleEntry('12:00', 2, 'Brian Cronin: Off The Rails - Lessons Learned from Monster Train Development', ['theater'], 'rogue'),
  ScheduleEntry('12:30', 2, SOCIAL_TIME),
  ScheduleEntry('13:30', 2, 'Chris McCormick: Building Juicy Minimal Roguelikes in the Browser', ['theater'], 'mage'),
  ScheduleEntry('14:00', 2, 'Rich Wilson: Roguelikes, Immersive Sims, and the Church of the Simulation', ['theater'], 'rogue'),
  ScheduleEntry('14:30', 2, 'Xalavier Nelson Jr.: Building an Economic Flesh Simulation Will Make You Disassociate from Reality', ['theater'], 'tourist'),
  ScheduleEntry('15:00', 2, SOCIAL_TIME),
  ScheduleEntry('15:30', 2, 'Kristen Yu: Video Game Quest Theory for Improved Procedural Content Generation', ['theater'], 'mage'),
  ScheduleEntry('16:00', 2, 'Ally Brinken & Michelle Webb, En Rogue: Who’s the Boss (And How and Why)?', ['theater'], 'warrior'),
  ScheduleEntry('16:30', 2, 'John Harris: The Lost Roguelikes', ['theater'], 'rogue'),
  ScheduleEntry('17:00', 2, SOCIAL_TIME),
  ScheduleEntry('17:30', 2, 'Nick McConnell: Things I\'ve Learnt from Maintaining Angband', ['theater'], 'rogue'),
  ScheduleEntry('17:45', 2, 'Nathan Savant: One Quest To Rule Them All: Quest Design in Non-Games Media', ['theater'], 'warrior'),
  ScheduleEntry('18:00', 2, 'Noah Swartz: The Tombs of Atuan: The Original Roguelike?', ['theater'], 'mage'),
  ScheduleEntry('18:15', 2, SOCIAL_TIME),
  ScheduleEntry('19:00', 2, 'Doors Close')
] */

export default function ScheduleView () {
  const formatter = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' })
  const userTimeZone = formatter.resolvedOptions().timeZone

  const rows = ScheduleEntries.flatMap(r => {
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
