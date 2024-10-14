/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (tacos: string) => {
  return `${tacos}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
    "#monster# Taco with #bean#"
    ],
    monster: [
      'Ice Giant',
      'Slime',
      'Crab',
      'Balrog',
      'Cockatrice',
      'Kobold',
      'Mimic',
      'Bat',
      'Dragon',
      'Emu',
      'Venus Flytrap',
      'Jabberwock',
      'Quagga',
      'Rattlesnake',
      'Xeroc',
      'Yeti'
    ],
    bean: [
    'Black Beans',
    'Red Beans',
    'Pinto Beans',
    'Jumping Beans',
    'Refried Beans',
    'Coffee Beans',
    'Jelly Beans',
    'Toe Beans',
    'Cool Beans',
    'Magic Beans'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
