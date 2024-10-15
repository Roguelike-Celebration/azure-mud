/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (bodyWorksCharacter: string) => {
  return `${bodyWorksCharacter}`
}

export const generate = () => {
  const grammar = tracery.createGrammar({
    origin: [
      'They look at you with a mischievous grin as they mix two smoking fluids together.',
      'The sudden smell of perfume slams into your senses, temporarily blinding you.',
      'A flash of light comes from the cauldron in front of them as they add some mysterious powder into a bubbling concoction of some kind.',
      'They stir a cauldron and you hear muttered words in some language you don\'t understand.',
      'You notice a new growth of mushrooms pop up from the ground in the wake of their footsteps.',
      'Their hand flashes out and snatches a bottle off a shelf, adding its contents to the cauldron.'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)

  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
