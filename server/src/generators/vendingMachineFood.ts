var tracery = require('tracery-grammar')

export const actionString = (item: string) => {
  return `The ancient vending machine whirrs and sputters for a few seconds before spitting out ${item}.`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      '#adjective# #food#',
      '#adjective# #food#',
      '#adjective# #food#',
      '#adjective# #food#',
      '#food#',
      '#adjective# #food##postAdjective#'
    ],
    adjective: [
      'a fresh',
      'a pungent',
      'an aromatic',
      'a seared',
      'a moist',
      'a chunky',
      'a smooth',
      'a delicate',
      'a hefty'
    ],
    food: [
      'slime mold',
      'meal ration',
      'apple',
      'orange',
      'pomegranate',
      'döner kebab',
      'donair',
      'hamburger',
      'pizza',
      'kobold corpse',
      'bagged sandwich',
      'cup of soup',
      'loaf of bread',
      'lembas wafer',
      'Cloaca Surprise',
      'gnomish candy',
      'choko',
      'fig',
      'cheesecake',
      'plump helmet mince',
      'bunch of grapes',
      'guava',
      'pancake'
    ],
    postAdjective: [
      ', still in the wrapper',
      ' with a bite taken out of it',
      ' past its expiration date',
      ' that smells AMAZING',
      ', still frozen',
      ', with a sauce packet attached',
      ', with an @ on the packaging'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
