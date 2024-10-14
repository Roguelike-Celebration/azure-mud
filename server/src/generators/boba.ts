/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (boba: string) => {
  return `${boba}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
    "#powerup# potion with #boba#"
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
    boba: [
    'Tapioca Pearls',
    'Mana Crystals',
    'Health Crystals',
    'Popping Crystals',
    'Ponderous Orbs',
    'Frog\'s Eyes',
    'Newt\'s Eyes',
    'Lychee Jelly',
    'Stinky Durian Jelly',
    'Dragonfruit Jelly',
    'Strawberry Jelly'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
