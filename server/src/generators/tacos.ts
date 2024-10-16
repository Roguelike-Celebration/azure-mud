/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (tacos: string) => {
  return `${tacos}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      "You inhale a scrumptious taco with #monster# meat and #bean#."
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
      'Yeti',
      'Eel'
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
