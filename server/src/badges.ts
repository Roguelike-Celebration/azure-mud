import DB from './redis'
import { updateUserProfile } from './user'

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
    description: 'This emoji looks like a butt.'
  },
  {
    emoji: '🇨🇦',
    description: 'Nice country, eh?'
  }
]
