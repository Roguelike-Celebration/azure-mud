import { keyBy } from 'lodash'

export interface Badge {
  /** We don't do any checks around string length, because Unicode Is Weird.
  * ~Please~ don't make this longer than one rendered character */
  emoji: string

  description?: string
}

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
    description: 'A juicy piece of fruit with no innuendo.'
  },
  {
    emoji: '🇨🇦',
    description: 'Nice country, eh?'
  },
  {
    emoji: '🦷',
    description: 'Teeth! Teeth! Teeth!'
  },
  {
    emoji: '🏳️‍🌈',
    description: '🌈🌈🌈'
  },
  {
    emoji: '👋',
    description: 'Say hi to me!'
  }
]

export const UnlockableBadges: Badge[] = [
  {
    emoji: '🌱',
    description: 'The tiniest little plant can survive anywhere'
  },
  {
    emoji: '🚀',
    description: 'To infinity and beyond!'
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
  },
  {
    emoji: '🐣',
    description: 'Attended the 2022 preview event!'
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
