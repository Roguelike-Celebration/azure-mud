var tracery = require('tracery-grammar')

export const actionString = (poster: string) => {
  return `You look more closely at one of the pieces of paper - ${poster}.`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'it reads "#apology# - #closedReason#" in a #writingMethod#'
    ],
    apology: [
      'Sorry',
      'Apologies to our guests',
      "This one's my bad",
      'Oops'
    ],
    closedReason: [
      'overrun with crabs',
      '400 destination not found',
      'we lost this one',
      'dog ate our airport'
    ],
    writingMethod: [
      'hasty handwritten scrawl',
      'messy crayon scribble',
      'comic sans font',
      'standard printed font',
      'series of letters cut from magazines'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
