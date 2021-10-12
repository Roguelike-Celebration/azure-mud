var tracery = require('tracery-grammar')

export const actionString = (game: string) => {
  return `Phwoop! A capsule shoots out of the tube! Unfurling the paper inside, it reads: ${game}.`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'Game goes here!'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
