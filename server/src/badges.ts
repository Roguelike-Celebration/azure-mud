import { keyBy } from 'lodash'

export interface Badge {
  /** We don't do any checks around string length, because Unicode Is Weird.
  * ~Please~ don't make this longer than one rendered character */
  emoji: string

  description?: string
}

// TODO: These 4 descriptions (trans, crab, peach, canada) are placeholders!
// If they make it to production, please tease Em mercilessly
export const FreeBadges: Badge[] = [
  {
    emoji: '🏳️‍⚧️',
    description: 'Why is everyone from this country so attractive?'
  },
  {
    emoji: '🦀',
    description: "It's a crab."
  },
  {
    emoji: '🍑',
    description: 'This emoji looks like a butt.'
  },
  {
    emoji: '🇨🇦',
    description: 'Nice country, eh?'
  }
]

export const UnlockableBadges: Badge[] = [
  {
    emoji: '🤖',
    description: 'Beep boop this robot was fabricated in a lab'
  },
  {
    emoji: '👾',
    description: 'Beep boop this robot was fabricated in a lab'
  },
  {
    emoji: '⚔️',
    description: 'A mighty adventurer'
  },
  {
    emoji: '🧙‍♀️',
    description: 'A wizened master of transmutation and alchemy'
  },
  {
    emoji: '💾',
    description: 'C://STEAM.EXE'
  },
  {
    emoji: '🌎',
    description: 'A worldly traveler of our event space!'
  }
]

/* This results in an object of the form
*   {
*    '🤖': {
*       emoji: '🤖',
*       description: 'Beep boop this robot was fabricated in a lab'
*     }, ...
*   }
*  This lets us index into UnlockableBadgeMap['🤖'] when checking for existence
*/
export const UnlockableBadgeMap = keyBy(UnlockableBadges, 'emoji')
