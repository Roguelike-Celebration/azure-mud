/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (barathrumites: string) => {
  return `${barathrumites}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'They ask if you have yet gone to retrieve the waydroid.',
      'They lean forward conspiratorially and ask if you have a willing spirit.',
      'They suggest you should /go to the rust caves north of Grit Gate.',
      'Their quills shift around urshiib smiles and their leader steps forward speaking the words Live and Drink.'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
