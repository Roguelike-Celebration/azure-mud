import { keyBy } from 'lodash'

export interface Badge {
  /** We don't do any checks around string length, because Unicode Is Weird.
  * ~Please~ don't make this longer than one rendered character */
  emoji: string

  description?: string

  isCustom?: boolean
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
  },
  {
    emoji: '📸',
    description: 'Tourist'
  },
  {
    emoji: '🐀',
    description: 'Killed by a rat on level 1'
  },
  {
    emoji: '🕴️',
    description: 'Caves of Qud, probably'
  },
  {
    emoji: '🥣',
    description: 'Reformed oatmeal maker'
  },
  {
    emoji: '🖼️',
    description: 'Does this dungeon have a tileset?'
  },
  {
    emoji: '🧦',
    description: 'Equipped: Roguelike Celebration socks'
  },
  {
    emoji: 'device_of_luthien',
    description: 'Heraldic Device of Lúthien Tinúviel (h/t MicroChasm)',
    isCustom: true
  },
  {
    emoji: 'artificer',
    description: 'Procgen Artificer: You get a tool, and you get a tool!',
    isCustom: true
  },
  {
    emoji: 'bard',
    description: 'Procgen Bard: Embrace the funky edges, make weird art!',
    isCustom: true
  },
  {
    emoji: 'cleric',
    description: 'Procgen Cleric: It works if you run it twice... don\t ask why.',
    isCustom: true
  },
  {
    emoji: 'druid',
    description: 'Procgen Druid: Prune and shape your generator, watch it grow!',
    isCustom: true
  },
  {
    emoji: 'paladin',
    description: 'Procgen Paladin: No, procedural does\'t just mean \'random\'',
    isCustom: true
  },
  {
    emoji: 'ranger',
    description: 'Procgen Ranger: Guide your party around the oatmeal bogs!',
    isCustom: true
  },
  {
    emoji: 'sorceror',
    description: 'Procgen Sorceror: Generation is a conversation with yourself',
    isCustom: true
  },
  {
    emoji: 'warlock',
    description: 'Procgen Warlock: Give the generator *whatever* it likes',
    isCustom: true
  }, {
    emoji: 'wizard',
    description: 'Procgen Wizard: Gaze into the Abyss, understand WFC',
    isCustom: true
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
    description: 'A wizened master of the dark sciences'
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
  },
  {
    emoji: '🎙️',
    description: 'Speaker Alumni Club'
  },
  {
    emoji: 'golden_thesis',
    description: 'A PhD-worthy scientific paper',
    isCustom: true
  },
  {
    emoji: 'phylactery',
    description: 'A blood-red jewel with a warm, accepting glow',
    isCustom: true
  },
  {
    emoji: 'nega_ticket',
    description: 'Admit One',
    isCustom: true
  },
  {
    emoji: 'undermuffin',
    description: 'It radiates hatred',
    isCustom: true
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
