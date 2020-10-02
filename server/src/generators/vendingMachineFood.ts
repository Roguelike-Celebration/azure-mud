var tracery = require('tracery-grammar')

export const actionString = (item: string) => {
  return `The ancient vending machine whirrs and sputters for a few seconds before spitting out ${item}.`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    animal: ['panda', 'fox', 'capybara', 'iguana'],
    emotion: ['sad', 'happy', 'angry', 'jealous'],
    origin: ['I am #emotion.a# #animal#.']
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
