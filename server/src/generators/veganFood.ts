/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (veganFood: string) => {
  return `${veganFood}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      "You eat a delicious bowl of #fruit# and #plant# with #powerup# sauce.",
      "You eat a bowl of #plant# and #protein#. Yum!"
    ],
    fruit: [
      'strawberry',
      'lemon',
      'lime',
      'orange',
      'dragonfruit',
      'stinky durian',
      'lychee',
      'mango',
      'kumquat',
      'guava',
      'rambutan',
      'feijoa',
      'noni',
      'choko',
      'Gros Michel banana'
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
      'intoxication',
      'fire breath',
      'brown',
      'red',
      'white',
      'blue',
      'green',
      'yellow',
      'purple',
      'orange'
    ],
    plant: [
      'lemongrass',
      'quinoa',
      'chickpea',
      'burb root',
      'moss of mareilon',
      'spenseweed',
      'mandrake',
      'nopales',
      'yucca',
      'spinach',
      'kale',
      'seaweed',
      'slime mold',
      'vinewafer',
      'wild rice',
      'meterlong beans',
      'corn (or is it maize?)',
      'maize (or is it corn?)'
    ],
    protein: [
      'imitation #meat#',
      'tofu',
      'tempeh',
      'turtle beans', // shoutout to one of the weirder balatro jokers - kawa
      'sunflower seeds',
      'delicately spiced #plant#'
    ],
    meat: [
      'chicken',
      'beef',
      'pork',
      'turkey',
      'salmon',
      'tilapia',
      'Magikarp',
      'eel',
      'minotaur'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
