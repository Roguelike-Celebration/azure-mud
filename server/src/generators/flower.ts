/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (flower: string) => {
  return `${flower}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'GO...',
      'UNDERWORLD...',
      'GO... UNDER... WORLD...'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
