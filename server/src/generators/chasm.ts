/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (tossARock: string) => {
  return `You drop a rock down into the chasm ${tossARock}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      "and you never hear it land.",
      "and the walls briefly shake, dust falling from above.",
      "and it flies back up into your hand.",
      "and it comes back to you with a +1 enchantment."
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
