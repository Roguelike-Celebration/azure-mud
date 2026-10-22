import { keyBy } from 'lodash'

import { BadgeCategory } from './types'

// See server/src/moveToRoom.ts for the badge-awarding logic, including the setting for
// which is the current-event badge.

export interface Badge {
  /** We don't do any checks around string length, because Unicode Is Weird.
  * ~Please~ don't make this longer than one rendered character */
  emoji: string

  description?: string

  isCustom?: boolean

  category: BadgeCategory
}

export const FreeBadges: Badge[] = [
  {
    emoji: '😈',
    description: 'Staying awhile and listening',
    category: BadgeCategory.Default
  },
  {
    emoji: '🏳️‍⚧️',
    description: 'Why is everyone from this country so attractive?',
    category: BadgeCategory.Default
  },
  {
    emoji: '🦀',
    description: "It's a crab.",
    category: BadgeCategory.Default
  },
  {
    emoji: '🍑',
    description: 'A juicy piece of fruit with no innuendo.',
    category: BadgeCategory.Default
  },
  {
    emoji: '🇨🇦',
    description: 'Nice country, eh?',
    category: BadgeCategory.Default
  },
  {
    emoji: '🦷',
    description: 'Teeth! Teeth! Teeth!',
    category: BadgeCategory.Default
  },
  {
    emoji: '🏳️‍🌈',
    description: '🌈🌈🌈',
    category: BadgeCategory.Default
  },
  {
    emoji: '👋',
    description: 'Say hi to me!',
    category: BadgeCategory.Default
  },
  {
    emoji: '📸',
    description: 'Tourist',
    category: BadgeCategory.Default
  },
  {
    emoji: '🐀',
    description: 'Killed by a rat on level 1',
    category: BadgeCategory.Default
  },
  {
    emoji: '🕴️',
    description: 'Caves of Qud, probably',
    category: BadgeCategory.Default
  },
  {
    emoji: '🥣',
    description: 'Reformed oatmeal maker',
    category: BadgeCategory.Default
  },
  {
    emoji: '🖼️',
    description: 'Does this dungeon have a tileset?',
    category: BadgeCategory.Default
  },
  {
    emoji: '🧦',
    description: 'Equipped: Roguelike Celebration socks',
    category: BadgeCategory.Default
  },
  {
    emoji: '⛏️',
    description: 'Diggy diggy hole',
    category: BadgeCategory.Default
  },
  {
    emoji: '🤔',
    description: 'Unreliable narrator',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: '📊',
    description: 'Spreadsheet criminal',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: '🎶',
    description: 'Procedurally generated vibes',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: '🍊',
    description: 'Emoji of my favorite food, award-winning photography',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: '💓',
    description: 'Mean hedonic rating increasing',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: '🎛️',
    description: 'Modder',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: '✍️',
    description: 'Documentation enthusiast',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: '📺',
    description: 'Streamer',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: '👍',
    description: 'Don\'t Panic',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: '🪤',
    description: 'Build a better adventurer trap',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: '🧠',
    description: 'Neurogue',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: '🎣',
    description: 'Definitely not a monster. Really. I promise.',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: '🧃',
    description: 'Juice, now 100% vegan!',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: '😵‍💫',
    description: 'Got a strange mood',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: '⏳',
    description: 'Sand with anxiety',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: '😉',
    description: 'Cute but difficult',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: '🔢',
    description: 'Math! Math! Math!',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: '🎴',
    description: 'Deck enjoyer',
    category: BadgeCategory.Talk2022
  },
  {
    emoji: 'device_of_luthien',
    description: 'Heraldic Device of Lúthien Tinúviel (h/t MicroChasm)',
    isCustom: true,
    category: BadgeCategory.Special
  },
  {
    emoji: 'artificer',
    description: 'Procgen Artificer: You get a tool, and you get a tool!',
    isCustom: true,
    category: BadgeCategory.Default
  },
  {
    emoji: 'bard',
    description: 'Procgen Bard: Embrace the funky edges, make weird art!',
    isCustom: true,
    category: BadgeCategory.Default
  },
  {
    emoji: 'cleric',
    description: 'Procgen Cleric: It works if you run it twice... don\t ask why.',
    isCustom: true,
    category: BadgeCategory.Default
  },
  {
    emoji: 'druid',
    description: 'Procgen Druid: Prune and shape your generator, watch it grow!',
    isCustom: true,
    category: BadgeCategory.Default
  },
  {
    emoji: 'paladin',
    description: 'Procgen Paladin: No, procedural does\'t just mean \'random\'',
    isCustom: true,
    category: BadgeCategory.Default
  },
  {
    emoji: 'ranger',
    description: 'Procgen Ranger: Guide your party around the oatmeal bogs!',
    isCustom: true,
    category: BadgeCategory.Default
  },
  {
    emoji: 'sorceror',
    description: 'Procgen Sorceror: Generation is a conversation with yourself',
    isCustom: true,
    category: BadgeCategory.Default
  },
  {
    emoji: 'warlock',
    description: 'Procgen Warlock: Give the generator *whatever* it likes',
    isCustom: true,
    category: BadgeCategory.Default
  }, {
    emoji: 'wizard',
    description: 'Procgen Wizard: Gaze into the Abyss, understand WFC',
    isCustom: true,
    category: BadgeCategory.Default
  },
  {
    emoji: 'eelhead',
    description: 'EELated to be here',
    isCustom: true,
    category: BadgeCategory.Year2023
  },
  {
    emoji: 'eeltail',
    description: 'Does this EELicit a smile?',
    isCustom: true,
    category: BadgeCategory.Year2023
  },
  {
    emoji: '🧝‍♂️',
    description: 'Pocket Elrond',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🧭',
    description: 'Finding a path through chaos',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '⏬',
    description: 'The invention of depth',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🐻',
    description: 'Non-violent bear',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🧑‍🤝‍🧑',
    description: 'Date around and find out',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🧟',
    description: 'Negative hitpoints monster',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🧙‍♂️',
    description: 'Searching for Endlebrook',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🧌',
    description: 'Friend of Fluffy',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🖌️',
    description: 'Lovingly handcrafted sudoku',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '📈',
    description: 'Here to look at tables',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '⚾',
    description: 'The name\'s Blaggart. Mud Blaggart.',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🎼',
    description: 'Traversing the musical lattice',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🏷️',
    description: 'The poor game dev\'s constraint solver',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🚪',
    description: 'Door apologist',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: 'obelisk',
    description: 'Post it to the obelisk',
    isCustom: true,
    category: BadgeCategory.Year2023
  },
  {
    emoji: '🧩',
    description: 'Looking for the relic, to find the merchant, to...',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '📬',
    description: 'Delivered by the mail daemon',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🕵️',
    description: 'MacMansion murder mystery solver',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🔧',
    description: 'eXcited about Modding Languages',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🎹',
    description: 'Gameplay beat drop',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🦄',
    description: 'A tapestry of aesthetic value',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🅰️',
    description: 'More than Spam and space',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🧹',
    description: 'Real time procedural generation!',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '📖',
    description: 'Looking into the simulation',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🃏',
    description: 'Boring shuffle -> Better cards',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🛠️',
    description: 'Better living through internal tooling',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🎒',
    description: 'Inventory manager',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🚢',
    description: 'Storylet scribe',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🕯️',
    description: 'Generating solvable puzzles',
    category: BadgeCategory.Talk2023
  },
  {
    emoji: '🤖',
    description: 'Curating the chaos',
    category: BadgeCategory.Talk2023
  }
]

export const UnlockableBadges: Badge[] = [
  {
    emoji: '🌱',
    description: 'The tiniest little plant can survive anywhere',
    category: BadgeCategory.Year2022
  },
  {
    emoji: '🚀',
    description: 'To infinity and beyond!',
    category: BadgeCategory.Year2022
  },
  {
    emoji: '⚔️',
    description: 'A mighty adventurer',
    category: BadgeCategory.Year2022
  },
  {
    emoji: '🧙‍♀️',
    description: 'A wizened master of the dark sciences',
    category: BadgeCategory.Year2022
  },
  {
    emoji: '💾',
    description: 'C://STEAM.EXE',
    category: BadgeCategory.Year2022
  },
  {
    emoji: '🌎',
    description: 'A worldly traveler of our event space!',
    category: BadgeCategory.Year2022
  },
  {
    emoji: '🐣',
    description: 'Attended the 2022 preview event!',
    category: BadgeCategory.Year2022
  },
  {
    emoji: '7️⃣',
    description: 'Attended the seventh Roguelike Celebration in 2022!',
    category: BadgeCategory.Year2022
  },
  {
    emoji: '🎙️',
    description: 'Speaker Alumni Club',
    category: BadgeCategory.Special
  },
  {
    emoji: 'golden_thesis',
    description: 'A PhD-worthy scientific paper',
    isCustom: true,
    category: BadgeCategory.Year2022
  },
  {
    emoji: 'phylactery',
    description: 'A blood-red jewel with a warm, accepting glow',
    isCustom: true,
    category: BadgeCategory.Year2022
  },
  {
    emoji: 'nega_ticket',
    description: 'Admit One',
    isCustom: true,
    category: BadgeCategory.Year2022
  },
  {
    emoji: 'undermuffin',
    description: 'It radiates hatred',
    isCustom: true,
    category: BadgeCategory.Year2022
  },
  {
    emoji: '🏬',
    description: 'Attended the 2023 preview event!',
    category: BadgeCategory.Year2023
  },
  {
    emoji: '8️⃣',
    description: 'Attended the eighth Roguelike Celebration in 2023!',
    category: BadgeCategory.Year2023
  },
  {
    emoji: '🔑',
    description: 'Employees ONLY?',
    category: BadgeCategory.Year2023
  },
  {
    emoji: '🌭',
    description: 'A much better food than a color scheme',
    category: BadgeCategory.Year2023
  },
  {
    emoji: '🎃',
    description: 'Happy Crawloween!',
    category: BadgeCategory.Year2023
  },
  {
    emoji: '🔮',
    description: 'Won the game',
    category: BadgeCategory.Year2023
  },
  {
    emoji: '👁️',
    description: 'Found harmony',
    category: BadgeCategory.Year2023
  },
  {
    emoji: '🎪',
    description: 'Attended the 2024 preview event!',
    category: BadgeCategory.Year2024
  },
  {
    emoji: '9️⃣',
    description: 'Attended the 9th Roguelike Celebration in 2024!',
    category: BadgeCategory.Year2024
  },
  {
    emoji: 'turkey_leg',
    description: 'Alarmingly large, but delicious!',
    isCustom: true,
    category: BadgeCategory.Year2024
  },
  {
    emoji: 'goblin_barbie',
    description: 'It comes with kung-fu grip!',
    isCustom: true,
    category: BadgeCategory.Year2024
  },
  {
    emoji: 'goblin_appreciation',
    description: 'The feeling of friendship',
    isCustom: true,
    category: BadgeCategory.Year2024
  },
  {
    emoji: '🎪', // emoji from 2024 reused as placeholder -apj
    description: 'Attended the 2025 preview event!',
    category: BadgeCategory.Year2025
  },
  {
    emoji: '🔟',
    description: 'Attended the 10th Roguelike Celebration in 2025!',
    category: BadgeCategory.Year2025
  },
  {
    emoji: 'mimeCrown',
    description: 'Met the king of mimes',
    isCustom: true,
    category: BadgeCategory.Year2025
  },
  {
    emoji: 'rainbowCrown',
    description: 'Met the king of clowns',
    isCustom: true,
    category: BadgeCategory.Year2025
  },
  {
    emoji: 'mirror',
    description: 'Reached the other side',
    isCustom: true,
    category: BadgeCategory.Year2025
  },
  {
    emoji: 'chadOfCloaca',
    description: 'Met Chad of the Cloaca',
    isCustom: true,
    category: BadgeCategory.Year2025
  },
  {
    emoji: '⏸️',
    description: 'Attended the 11th Roguelike Celebration in 2026!',
    category: BadgeCategory.Year2026
  },
  {
    emoji: 'torch2',
    description: 'Met the Queen',
    isCustom: true,
    category: BadgeCategory.Year2026
  },
  {
    emoji: 'enter_temple',
    description: 'Found the Temple',
    isCustom: true,
    category: BadgeCategory.Year2026
  },
  {
    emoji: 'globe_of_annihilation_tar1',
    description: 'Found the Ball Pit',
    isCustom: true,
    category: BadgeCategory.Year2026
  },
  {
    emoji: 'death_yak',
    description: 'Met the Dire Goat',
    isCustom: true,
    category: BadgeCategory.Year2026
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
