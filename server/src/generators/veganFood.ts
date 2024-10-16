/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (veganFood: string) => {
  return `${veganFood}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
    "You eat a delicious bowl of #fruit# and #plant# with #powerup# sauce."
    ],
    fruit: [
    'Strawberry',
    'Lemon',
    'Lime',
    'Orange',
    'Dragonfruit',
    'Stinky Durian',
    'Lychee',
    'Mango',
    'Kumquats',
    'Guava',
    'Rambutan',
    'Feijoa',
    'Noni'
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
      'Lemongrass',
      'Quinoa',
      'Chickpea',
      'Burb Root',
      'Moss of Mareilon',
      'Spenseweed',
      'Mandrake',
      'Nopales',
      'Yucca',
      'Spinach',
      'Kale',
      'Seaweed'

    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
