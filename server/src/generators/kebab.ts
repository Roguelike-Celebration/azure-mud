/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (tacos: string) => {
  return `${tacos}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
    "#monster# #bodyPart# skewers"
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
