var tracery = require('tracery-grammar')

export const actionString = (pickupLine: string) => {
  return `${pickupLine}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      '#bardIntro# "#pickupLine#"'
    ],
    bardIntro: [
      'The bard clears his throat and says:'
    ],
    pickupLine: [
      'Your RNG or mine?'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
