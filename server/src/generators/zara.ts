/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (zara: string) => {
  return `${zara}`
}

export const generate = () => {
  const grammar = tracery.createGrammar({
    origin: [
      'She flashes you a charming smile around her two enormous fangs and braided muttonchops.',
      'She stands only three and a half feet tall, but it&apos;s the most imposing, muscular three feet you&apos;ve ever seen.',
      'Zara looks at you with a mischievous grin. The twinkle in her eye says she would bench press you, if given a chance.',
      'You catch her eye for an instant before she runs off to break up a pair of feral teens arguing about obscure funk bands.',
      'She stands looking over the food court with absolute authority, a twisted orc axe’s handle extending far over her left shoulder.',
      'You notice a slight gleam in her immaculate, braided muttonchops. A feature she clearly devotes much of her time towards.'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)

  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
