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
    plant: [
      'Lemongrass',
      'Quinoa',
      'Chickpea',
      'Burb Root',
      'Moss of Mareilon',
      'Spenseweed',
      'Mandrake'

    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
