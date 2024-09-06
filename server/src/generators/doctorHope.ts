/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (doctorHope: string) => {
  return `${doctorHope}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'As she mixes two viscous liquids together, you can\'t help but notice her complete lack of protective gear.',
      'She doesn\'t seem to notice you, too busy furiously scratching at her notepad.',
      'You watch her, half bent over and holding a bottle at a threatening angle, chase down a rat that is trying desperately to reach a hole in the wall.',
      'She mumbles to herself, not seeming to notice that you\'re even in the room.',
      'You notice the edges of her lab coat appear to be singed and dyed a variety of colors.',
      'You notice, sticking out from its hiding place beneath a stack of books, a check signed \'Mom & Dad\'.',
      'As she moves, the burnt hay stack that is her hair stiffly waves back and forth, as if trying to signal for rescue.',
      'She walks by a trash can, mumbling, and you can\'t help but notice a pile of Cease and Desist letters, torn and discarded.',
      'You look at the equipment she\'s using and can\t help but marvel at how clean it is, a stark contrast to her own lab coat.',
      'You peer over her notes - is that a recipe for #bakedGood#?'
    ],
    bakedGood: [
      '#flavor# cookies',
      'extremely decadent brownies',
      'cheesecake',
      'brioche',
      'coffee cake'
    ],
    flavor: [
      'fortune',
      'chocolate chip',
      'snickerdoodle',
      'chocolate mint',
      'coconut caramel',
      'lemon drizzle',
      'maple cream',
      'speculaas',
      'shortbread',
      'gingersnap'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
