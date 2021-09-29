import React from 'react'

export interface ScheduleEntry {
  time: Date,
  text: string,
  roomIds: string[]
}

function ScheduleEntry (time: string, day: number, text: string, roomIds?: string[]) {
  const dayOneDate = (time) => new Date(`2021-10-16T${time}:00.000-07:00`)
  const dayTwoDate = (time) => new Date(`2021-10-17T${time}:00.000-07:00`)

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

// Saturday entries
export const ScheduleEntries = [
  ScheduleEntry('09:00', 1, 'Doors Open'),
  // TODO: Are we doing this?
  ScheduleEntry('09:15', 1, 'Intro / Housekeeping', ['theater']),
  ScheduleEntry('09:30', 1, 'Michael Brough: Possibility of Roguelike Elements', ['theater']),
  ScheduleEntry('10:00', 1, 'Jeremiah Reid: Juice Your Turns', ['theater']),
  ScheduleEntry('10:30', 1, 'Social Time'),
  ScheduleEntry('11:00', 1, 'Brenda Romero: Dynamic Relationships and Traits in Empire of Sin', ['theater']),
  ScheduleEntry('11:15', 1, 'Jasmine Otto: Cyclic Plot Generation in a Mixed-Initiative Narrative Instrument', ['theater']),
  ScheduleEntry('11:30', 1, 'Francesco Cottone: Chronicles of Stampadia and other postcards from an alternate world', ['theater']),
  ScheduleEntry('11:45', 1, 'Atty Vohra: Automating D&D Combat Prep with Roguelike Principles', ['theater']),
  ScheduleEntry('12:00', 1, 'Social Time'),
  ScheduleEntry('13:00', 1, 'Arvi Teikari: Why Noita Became a Roguelite (and Why I Liked That a Lot)', ['theater']),
  ScheduleEntry('13:30', 1, 'Shawn Main: You May Already Be a Roguelike', ['theater']),
  ScheduleEntry('14:00', 1, 'Social Time'),
  ScheduleEntry('14:30', 1, 'Jason Grinblat: Before you fix a leak ask if it\'s a fountain (a paean for bugs and edge cases)', ['theater']),
  ScheduleEntry('15:00', 1, 'Allie Signet & Joe Maliksi, Society for Internet Blaseball Research: SIBR - Sports, Splorts, and Statistics: Why Data Accessibility Matters in Blaseball and Beyond ', ['theater']),
  ScheduleEntry('16:00', 1, 'Social Time'),
  ScheduleEntry('17:00', 1, 'Spencer Egart: Tooling for Roguelikes and Procgen', ['theater']),
  ScheduleEntry('17:15', 1, 'Thomas Robertson: Towards a New Understanding of Procedural Super Attacks', ['theater']),
  ScheduleEntry('17:30', 1, 'Dylan White: The Cost of Magic', ['theater']),
  ScheduleEntry('17:45', 1, 'Qristy Overton: Exhibition: Attempting Brogue on a Dance Mat', ['theater']),
  // TODO: Add the unconferencing room(s) when they're implemented
  ScheduleEntry('18:00', 1, 'Unconferencing', ['theater']),
  ScheduleEntry('18:45', 1, 'Social Time'),
  ScheduleEntry('20:45', 1, 'Doors Close'),
]

/* Sunday Entries
export const ScheduleEntries = [
  ScheduleEntry('09:00', 2, 'Doors Open'),
  // TODO: Are we doing this?
  ScheduleEntry('09:15', 2, 'Intro / Housekeeping', ['theater']),
  ScheduleEntry('09:30', 2, 'For the Squishies ⚡ Making Roguelikes Accessible to (Younger) Children and their Parents', ['theater']),
  ScheduleEntry('09:45', 2, 'Younès Rabii: Pokemon Glitch - Story of A Roguelike With No Author', ['theater']),
  ScheduleEntry('10:00', 2, 'Sraëka-Lillian: Procedural Phonology: Generating Name Generators', ['theater']),
  ScheduleEntry('10:15', 2, 'Clarissa Littler: Mediating Music and Machine', ['theater']),
  // TODO: Add the unconferencing room(s) when they're implemented
  ScheduleEntry('10:30', 2, 'Unconferencing', ['theater']),
  ScheduleEntry('11:30', 2, 'Alice Lai: All Together Now: Creating Multiplicative Power in Hades', ['theater']),
  ScheduleEntry('12:00', 2, 'Brian Cronin: Off The Rails - Lessons Learned from Monster Train Development', ['theater']),
  ScheduleEntry('12:30', 2, 'Social Time'),
  ScheduleEntry('13:30', 2, 'Chris McCormick: Building Juicy Minimal Roguelikes in the Browser', ['theater']),
  ScheduleEntry('14:00', 2, 'Rich Wilson: Roguelikes, Immersive Sims, and the Church of the Simulation', ['theater']),
  ScheduleEntry('14:30', 2, 'Xalavier Nelson Jr.: Building an Economic Flesh Simulation Will Make You Disassociate from Reality', ['theater']),
  ScheduleEntry('15:00', 2, 'Social Time'),
  ScheduleEntry('15:30', 2, 'Kristen Yu: Video Game Quest Theory for Improved Procedural Content Generation', ['theater']),
  ScheduleEntry('16:00', 2, 'Ally Brinken & Michelle Webb, En Rogue: Who’s the Boss (And How and Why)?', ['theater']),
  ScheduleEntry('16:30', 2, 'John Harris: The Lost Roguelikes', ['theater']),
  ScheduleEntry('17:00', 2, 'Social Time'),
  ScheduleEntry('17:30', 2, 'Nick McConnell: Things I\'ve Learnt from Maintaining Angband', ['theater']),
  ScheduleEntry('17:45', 2, 'Nathan Savant: One Quest To Rule Them All: Quest Design in Non-Games Media', ['theater']),
  ScheduleEntry('18:00', 2, 'Noah Swartz: The Tombs of Atuan: The Original Roguelike?', ['theater']),
  ScheduleEntry('18:15', 2, 'Social Time'),
  ScheduleEntry('19:00', 2, 'Doors Close')
]
*/

export default function ScheduleView () {
  const formatter = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' })
  const userTimeZone = formatter.resolvedOptions().timeZone

  const rows = ScheduleEntries.flatMap(r => {
    if (r.text === 'Break') {
      return [(<tr><th className='break' colSpan={2}><hr /></th></tr>),
        (<tr><td className='time'>{formatter.format(r.time)}</td><td className='segment'>**** BREAK ****</td></tr>),
        (<tr><th className='break' colSpan={2}><hr /></th></tr>)]
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
