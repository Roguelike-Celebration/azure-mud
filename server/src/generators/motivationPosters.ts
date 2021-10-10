var tracery = require('tracery-grammar')

export const actionString = (poster: string) => {
  return `You look more closely at one of the many posters - ${poster}.`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'it says #slogan# in bold face type'
    ],
    slogan: [
      'bones bones bones',
      'The Enemy Within',
      'The Power Inside You - Bones'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
