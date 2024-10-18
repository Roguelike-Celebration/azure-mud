/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (boba: string) => {
  return `${boba}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      "You drink #refreshing.a# #powerup# potion with #boba#."
    ],
    refreshing: [
      'refreshing',
      'tasty',
      'delicious',
      'lovely',
      'incredible',
      'delectable',
      'wonderfully #refreshing#', // learning a few years ago that you can recurse grammars like this makes me too powerful - kawa
      '#flavor#-flavored'
    ],
    flavor: [
      'banana',
      'orange',
      'lychee',
      'strawberry',
      'mango',
      'peach',
      'elderberry',
      'haskap berry',
      'almond',
      'cherry',
      'green tea',
      'chai',
      'oolong',
      'black tea',
      'ambrosia', // mostly positive but a few weirdos down here, which are all roguelike references - kawa
      'choko',
      'Gros Michel banana',
      'slime mold',
      'cheap imitation Amulet of Yendor',
      'starapple'
    ],
    powerup: [
      'blindness',
      'confusion',
      'detect monster',
      'detect things',
      'extra healing',
      'hallucination',
      'haste self',
      'healing',
      'increase strength',
      'levitation',
      'poison',
      'raise level',
      'restore strength',
      'see invisible',
      'torment',
      'brilliance',
      'Amulet seeking',
      'Speak With Eels',
      'intoxication',
      'fire breath',
      'ice breath',
      'entirely normal breath',
      'levitation',
      'enlightenment',
      'brown',
      'red',
      'white',
      'blue',
      'green',
      'yellow',
      'purple',
      'orange',
      'octarine'
    ],
    boba: [
      'Tapioca Pearls',
      'Mana Crystals',
      'Health Crystals',
      'Popping Crystals',
      'Ponderous Orbs',
      'Frog\'s Eyes',
      'Jester\'s Bells',
      'Newt\'s Eyes',
      'Lychee Jelly',
      'Stinky Durian Jelly',
      'Dragonfruit Jelly',
      'Strawberry Jelly',
      '#flavor# bits',
      'Eel Jelly',
      'whipped cream and #boba#'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
