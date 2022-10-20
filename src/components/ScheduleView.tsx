import { now } from 'lodash'
import React from 'react'

const SOCIAL_TIME = 'Social Time'

// Generate the current date for both the schedule and "happening now"
// If you want to test functionality, stub in a fake date here
// (this only exists to allow that testing functionality)
export function nowDate () {
  // After 2022 day 1, before day 2: '2022-10-22T22:00:00.000-07:00'
  return new Date()
}

export interface ScheduleEntry {
  time: Date,
  text: string,
  roomIds: string[]
  breakoutRoomId?: string,
  day: number
}

const dayPreview = (time) => new Date(`2022-09-11T${time}:00.000-07:00`)
const dayOneDate = (time) => new Date(`2022-10-22T${time}:00.000-07:00`)
const dayTwoDate = (time) => new Date(`2022-10-23T${time}:00.000-07:00`)

function ScheduleEntry (time: string, day: number, text: string, roomIds?: string[], breakoutRoomId?: string) {
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
  } else {
    console.error('Your static data is messed up, somehow.')
  }
}

export const ScheduleEntries = [
  ScheduleEntry('09:00', 1, 'Doors Open'),
  ScheduleEntry('09:15', 1, 'Kickoff', ['theater']),
  ScheduleEntry('09:30', 1, 'Younès Rabii: "La Horde du Contrevent": A Novel That Didn\'t Know It Was A Roguelike', ['theater'], 'warrior'),
  ScheduleEntry('09:45', 1, 'Sherveen Uduwana: Persistence and Resistence: How narrative in roguelikes is currently underutilized', ['theater'], 'mage'),
  ScheduleEntry('10:00', 1, 'Florence Smith Nichols: Object Biographies: An Archaeological Approach to PCG', ['theater'], 'rogue'),
  ScheduleEntry('10:15', 1, 'Tyler Robinson: Prototyping your games in Google Sheets', ['cleric'], ''),
  ScheduleEntry('10:30', 1, SOCIAL_TIME),
  ScheduleEntry('11:00', 1, 'Sonut Uzun: Procedural Music of Tea Garden', ['theater'], 'warrior'),
  ScheduleEntry('11:30', 1, 'Janelle Shane: The Baltimore Orioles Effect: Hey! Stop poisoning my image prompt!', ['theater'], 'mage'),
  ScheduleEntry('12:00', 1, SOCIAL_TIME),
  ScheduleEntry('13:00', 1, 'Dylan Gedig: Perfect Synergy: How Roguelike Developers and Streamers Form the Perfect Ecosystem', ['theater'], 'rogue'),
  ScheduleEntry('13:30', 1, 'George Moromisato: Creating a Modding System for Roguelikes', ['theater'], 'cleric'),
  ScheduleEntry('14:00', 1, 'Jeremy Rose: The Hitchhiker\'s Guide to the Cataclysm', ['theater'], 'warrior'),
  ScheduleEntry('14:30', 1, SOCIAL_TIME),
  ScheduleEntry('15:00', 1, 'Reed Lockwood: Common "Pitfalls" of Roguelike Traps and How to Circumvent Them', ['theater'], 'warrior'),
  ScheduleEntry('15:15', 1, 'Chris King: How To Let Your Players Take The Wheel (without crashing the car)', ['theater'], 'mage'),
  ScheduleEntry('15:30', 1, 'Benet Devereux: Seeking Treasure in the Tangled Bank: Biological Inspiration for Roguelike Mechanics ', ['theater'], 'rogue'),
  ScheduleEntry('15:45', 1, 'Hannah Blair Salzman: Roguelikes, Neurodiversity, and Mental Illness', ['theater'], 'cleric'),
  ScheduleEntry('16:00', 1, SOCIAL_TIME),
  ScheduleEntry('16:30', 1, 'Jack Schlesinger: Your Puzzle Is A Secret Dungeon', ['theater'], 'mage'),
  ScheduleEntry('17:00', 1, 'Sersa Victory: Choice Design in Roguelikes', ['theater'], 'rogue'),
  ScheduleEntry('17:30', 1, SOCIAL_TIME),
  ScheduleEntry('18:00', 1, 'Unconferencing', ['unconference']),
  ScheduleEntry('19:00', 1, 'Doors Close'),

  ScheduleEntry('09:00', 2, 'Doors Open'),
  ScheduleEntry('09:15', 2, 'Kickoff', ['theater']),
  ScheduleEntry('09:30', 2, 'Tabea Iseli: How hard can it be to create a non-violent rogue-lite dungeon crawler?', ['theater'], 'mage'),
  ScheduleEntry('10:00', 2, 'Dustin Freeman: Simulating History as You’re Living Through It AKA Everyone is a Bunch of Concerns in a Trench Coat', ['theater'], 'rogue'),
  ScheduleEntry('10:30', 2, SOCIAL_TIME),
  ScheduleEntry('11:00', 2, 'Unconferencing', ['unconference']),
  ScheduleEntry('12:00', 2, SOCIAL_TIME),
  ScheduleEntry('12:30', 2, 'Philomena Schwab: This is too hard! How to broaden your game’s target audience with smart difficulty tricks', ['theater'], 'warrior'),
  ScheduleEntry('12:45', 2, 'Adam Newgas: Constraint Based Generation is a swiss army knife', ['theater'], 'mage'),
  ScheduleEntry('13:00', 2, 'Pierre Vigier: Room Generation using Constraint Satisfaction', ['theater'], 'rogue'),
  ScheduleEntry('13:15', 2, 'Evan Debenham: Smoothing the Sharp Edges of RNG', ['theater'], 'cleric'),
  ScheduleEntry('13:30', 2, SOCIAL_TIME),
  ScheduleEntry('14:00', 2, 'Alexander Byaly: Causal Graphs for Procedural Generation', ['theater'], 'warrior'),
  ScheduleEntry('14:30', 2, 'Abdelrahman Madkour: Controlling your generator using Expressive Range Analysis', ['theater'], 'mage'),
  ScheduleEntry('15:00', 2, 'Phenry Ewing: A Million Little Players: Monte Carlo Simulations for Game Design', ['theater'], 'rogue'),
  ScheduleEntry('15:30', 2, SOCIAL_TIME),
  ScheduleEntry('16:00', 2, 'Sergio Garces: Procedural 3D environments on a budget', ['theater'], 'cleric'),
  ScheduleEntry('16:30', 2, 'Joel Ryan: A Small Clump of Pixels: Creating the Sil-Q Tileset', ['theater'], 'mage'),
  ScheduleEntry('17:00', 2, SOCIAL_TIME),
  ScheduleEntry('17:30', 2, 'Cara Esten Hurtle: Telnet, a New Session, and transsexualizing the past', ['theater'], 'warrier'),
  ScheduleEntry('17:45', 2, 'Santiago Zapata: Celebrating Moria - a roguelike before the roguelikes', ['theater'], 'rogue'),
  ScheduleEntry('18:15', 2, SOCIAL_TIME),
  ScheduleEntry('19:00', 2, 'Doors Close')
]

export default function ScheduleView () {
  const formatter = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' })
  const userTimeZone = formatter.resolvedOptions().timeZone

  const today = nowDate()

  // If it's before the event or day 1, show day 1. Otherwise show day 2
  // TODO: This logic will need adjusting for a preview event

  const endOfDayOne = ScheduleEntries.slice().reverse().find(e => e.day === 1).time
  endOfDayOne.setTime(endOfDayOne.getTime() + (1 * 60 * 60 * 1000)) // Add 1 hour after the last event

  let day = 2
  // TODO: This will be busted, time zones
  if (today <= endOfDayOne) {
    day = 1
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
      <h1>Schedule: Day {day}</h1>
      <p>Times below should be in your local time zone. We believe your time zone is {userTimeZone}.</p>
      <table>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  )
}
