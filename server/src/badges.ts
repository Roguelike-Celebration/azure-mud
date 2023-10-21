import { keyBy } from 'lodash'
import { BadgeCategories } from './types'

export interface Badge {
  /** We don't do any checks around string length, because Unicode Is Weird.
  * ~Please~ don't make this longer than one rendered character */
  emoji: string

  description?: string

  isCustom?: boolean

  category: BadgeCategories
}

export const FreeBadges: Badge[] = [
  {
    emoji: '😈',
    description: 'Staying awhile and listening',
    category: BadgeCategories.Default
  },
  {
    emoji: '🏳️‍⚧️',
    description: 'Why is everyone from this country so attractive?',
    category: BadgeCategories.Default
  },
  {
    emoji: '🦀',
    description: "It's a crab.",
    category: BadgeCategories.Default
  },
  {
    emoji: '🍑',
    description: 'A juicy piece of fruit with no innuendo.',
    category: BadgeCategories.Default
  },
  {
    emoji: '🇨🇦',
    description: 'Nice country, eh?',
    category: BadgeCategories.Default
  },
  {
    emoji: '🦷',
    description: 'Teeth! Teeth! Teeth!',
    category: BadgeCategories.Default
  },
  {
    emoji: '🏳️‍🌈',
    description: '🌈🌈🌈',
    category: BadgeCategories.Default
  },
  {
    emoji: '👋',
    description: 'Say hi to me!',
    category: BadgeCategories.Default
  },
  {
    emoji: '📸',
    description: 'Tourist',
    category: BadgeCategories.Default
  },
  {
    emoji: '🐀',
    description: 'Killed by a rat on level 1',
    category: BadgeCategories.Default
  },
  {
    emoji: '🕴️',
    description: 'Caves of Qud, probably',
    category: BadgeCategories.Default
  },
  {
    emoji: '🥣',
    description: 'Reformed oatmeal maker',
    category: BadgeCategories.Default
  },
  {
    emoji: '🖼️',
    description: 'Does this dungeon have a tileset?',
    category: BadgeCategories.Default
  },
  {
    emoji: '🧦',
    description: 'Equipped: Roguelike Celebration socks',
    category: BadgeCategories.Default
  },
  {
    emoji: '⛏️',
    description: 'Diggy diggy hole',
    category: BadgeCategories.Default
  },
  {
    emoji: '🤔',
    description: 'Unreliable narrator',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: '📊',
    description: 'Spreadsheet criminal',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: '🎶',
    description: 'Procedurally generated vibes',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: '🍊',
    description: 'Emoji of my favorite food, award-winning photography',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: '💓',
    description: 'Mean hedonic rating increasing',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: '🎛️',
    description: 'Modder',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: '✍️',
    description: 'Documentation enthusiast',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: '📺',
    description: 'Streamer',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: '👍',
    description: 'Don\'t Panic',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: '🪤',
    description: 'Build a better adventurer trap',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: '🧠',
    description: 'Neurogue',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: '🎣',
    description: 'Definitely not a monster. Really. I promise.',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: '🧃',
    description: 'Juice, now 100% vegan!',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: '😵‍💫',
    description: 'Got a strange mood',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: '⏳',
    description: 'Sand with anxiety',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: '😉',
    description: 'Cute but difficult',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: '🔢',
    description: 'Math! Math! Math!',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: '🎴',
    description: 'Deck enjoyer',
    category: BadgeCategories.Talk2022
  },
  {
    emoji: 'device_of_luthien',
    description: 'Heraldic Device of Lúthien Tinúviel (h/t MicroChasm)',
    isCustom: true,
    category: BadgeCategories.Special
  },
  {
    emoji: 'artificer',
    description: 'Procgen Artificer: You get a tool, and you get a tool!',
    isCustom: true,
    category: BadgeCategories.Default
  },
  {
    emoji: 'bard',
    description: 'Procgen Bard: Embrace the funky edges, make weird art!',
    isCustom: true,
    category: BadgeCategories.Default
  },
  {
    emoji: 'cleric',
    description: 'Procgen Cleric: It works if you run it twice... don\t ask why.',
    isCustom: true,
    category: BadgeCategories.Default
  },
  {
    emoji: 'druid',
    description: 'Procgen Druid: Prune and shape your generator, watch it grow!',
    isCustom: true,
    category: BadgeCategories.Default
  },
  {
    emoji: 'paladin',
    description: 'Procgen Paladin: No, procedural does\'t just mean \'random\'',
    isCustom: true,
    category: BadgeCategories.Default
  },
  {
    emoji: 'ranger',
    description: 'Procgen Ranger: Guide your party around the oatmeal bogs!',
    isCustom: true,
    category: BadgeCategories.Default
  },
  {
    emoji: 'sorceror',
    description: 'Procgen Sorceror: Generation is a conversation with yourself',
    isCustom: true,
    category: BadgeCategories.Default
  },
  {
    emoji: 'warlock',
    description: 'Procgen Warlock: Give the generator *whatever* it likes',
    isCustom: true,
    category: BadgeCategories.Default
  }, {
    emoji: 'wizard',
    description: 'Procgen Wizard: Gaze into the Abyss, understand WFC',
    isCustom: true,
    category: BadgeCategories.Default
  },
  {
    emoji: 'eelhead',
    description: 'EELated to be here',
    isCustom: true,
    category: BadgeCategories.Year2023
  },
  {
    emoji: 'eeltail',
    description: 'Does this EELicit a smile?',
    isCustom: true,
    category: BadgeCategories.Year2023
  }
]

export const UnlockableBadges: Badge[] = [
  {
    emoji: '🌱',
    description: 'The tiniest little plant can survive anywhere',
    category: BadgeCategories.Year2022
  },
  {
    emoji: '🚀',
    description: 'To infinity and beyond!',
    category: BadgeCategories.Year2022
  },
  {
    emoji: '⚔️',
    description: 'A mighty adventurer',
    category: BadgeCategories.Year2022
  },
  {
    emoji: '🧙‍♀️',
    description: 'A wizened master of the dark sciences',
    category: BadgeCategories.Year2022
  },
  {
    emoji: '💾',
    description: 'C://STEAM.EXE',
    category: BadgeCategories.Year2022
  },
  {
    emoji: '🌎',
    description: 'A worldly traveler of our event space!',
    category: BadgeCategories.Year2022
  },
  {
    emoji: '🐣',
    description: 'Attended the 2022 preview event!',
    category: BadgeCategories.Year2022
  },
  {
    emoji: '7️⃣',
    description: 'Attended the seventh Roguelike Celebration in 2022!',
    category: BadgeCategories.Year2022
  },
  {
    emoji: '🎙️',
    description: 'Speaker Alumni Club',
    category: BadgeCategories.Special
  },
  {
    emoji: 'golden_thesis',
    description: 'A PhD-worthy scientific paper',
    isCustom: true,
    category: BadgeCategories.Year2022
  },
  {
    emoji: 'phylactery',
    description: 'A blood-red jewel with a warm, accepting glow',
    isCustom: true,
    category: BadgeCategories.Year2022
  },
  {
    emoji: 'nega_ticket',
    description: 'Admit One',
    isCustom: true,
    category: BadgeCategories.Year2022
  },
  {
    emoji: 'undermuffin',
    description: 'It radiates hatred',
    isCustom: true,
    category: BadgeCategories.Year2022
  },
  {
    emoji: '🏬',
    description: 'Attended the 2023 preview event!',
    category: BadgeCategories.Year2023
  },
  {
    emoji: '8️⃣',
    description: 'Attended the eighth Roguelike Celebration in 2023!',
    category: BadgeCategories.Year2023
  },
  {
    emoji: '🔑',
    description: 'Employees ONLY?',
    category: BadgeCategories.Year2023
  },
  {
    emoji: '🌭',
    description: 'A much better food than a color scheme',
    category: BadgeCategories.Year2023
  },
  {
    emoji: '🎃',
    description: 'Happy Crawloween!',
    category: BadgeCategories.Year2023
  },
  {
    emoji: '🔮',
    description: 'Won the game',
    category: BadgeCategories.Year2023
  },
  {
    emoji: '👁️',
    description: 'Found harmony',
    category: BadgeCategories.Year2023
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
