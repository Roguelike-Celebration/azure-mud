/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (kebabs: string) => {
  return `${kebabs}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
    "You devour some #monster# #bodyPart# skewers!"
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
    bodyPart: [
      'Leg',
      'Thigh',
      'Arm',
      'Finger',
      'Toe',
      'Wing',
      'Tongue',
      'Heart'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
