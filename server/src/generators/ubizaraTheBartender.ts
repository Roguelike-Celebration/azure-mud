/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (ubizaraTheBartender: string) => {
  return `${ubizaraTheBartender}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'She #expression#, and you are enraptured by her enormous fangs and braided muttonchops.',
      'She washes cups behind the bar, dressed up like a magazine ad for Bartender\'s Monthly.',
      'She stands only three and a half feet tall, but it\'s the most imposing, muscular three feet you\'ve ever seen.',
      'Ubizara #expression#. The twinkle in her eye says she would bench press you if given a chance.',
      'She #expression#, and then she dives over the counter to break up a pair of disgruntled orcs arguing about politics.',
      'You notice a gleam in her immaculate, braided muttonchops. A feature she clearly devotes much of her time towards.',
      'She #expression#, but you cant help notice that behind her, within arms reach, is a twisted orc axe three times her size.',
      'She #expression#',
      'Ubizara #expression#'
    ],
    expression: [
      'flashes you a smile',
      'grins at you',
      'looks at you impishly',
      'gives you a mischievous grin',
      'smiles at you warmly',
      'smiles at you',
      'catches your eye for an instant'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
