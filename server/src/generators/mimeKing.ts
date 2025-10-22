/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (mimeKing: string) => {
  return `${mimeKing}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'Find the other king. His colors will tell you his origins. /go there.',
      'Ask the Blue Prince for your destination\'s name.',	  
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
