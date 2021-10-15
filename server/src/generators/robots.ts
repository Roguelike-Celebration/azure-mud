var tracery = require('tracery-grammar')

export const actionString = (robot: string) => {
  return `${robot}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      '#soundEffect#! A #robot# rolls off the assembly line.'
    ],
    soundEffect: [
        'Clonk',
        'Boop',
        'Cshhhhh'
    ],
    robot: [
        'cute robot'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
