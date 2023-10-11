/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (loudRobert: string) => {
  return `${loudRobert}`
}

export const generate = () => {
  const grammar = tracery.createGrammar({
    origin: [
      'His short, bulky frame is supporting an enormous green coat that hangs down to his feet.',
      'On his head rests a backwards baseball cap which no longer seems to serve any purpose.',
      'The two men stand facing each other and all you hear are expletives, but somehow they seem to understand each other.',
      'He stares at you intensely, but doesn’t say anything.'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)

  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
