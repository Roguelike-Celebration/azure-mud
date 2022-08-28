import tracery from 'tracery-grammar'

export const actionString = (item: string) => {
  return `The vending machine whirrs and sputters for a few seconds before spitting out ${item}.`
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
      'a hefty',
      'a perfectly cube-shaped'
    ],
    food: [
      'slime mold',
      'pudding',
      'snak pak',
      'taco',
      'piece of lutefisk',
      'single #mnmcolors# m & m(tm)',
      'chipotle salad bowl',
      'off-brand hard seltzer',
      'turkish delight',
      'bunch of snozzberries',
      "six-pack of 'mystery' nuggets",
      'natto',
      'pickle',
      'jar of tiny pickles',
      'kimchi',
      'scrapple',
      'spiedie',
      'spätzle',
      'Slim Jim(tm)',
      'generic dehydrated meat tube',
      'bowl of #cereal#',
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
      'pancake',
      'pomegranate'
    ],
    mnmcolors: [
      'red',
      'red',
      'red',
      'green',
      'green',
      'green',
      'orange',
      'orange',
      'orange',
      'yellow',
      'yellow',
      'yellow',
      'blue',
      'blue',
      'blue',
      'brown',
      'brown',
      'brown',
      'heliotrope',
      'iridescent',
      'eldritch',
      'octarine'
    ],
    postAdjective: [
      ', still in the wrapper',
      ' with a bite taken out of it',
      ' past its expiration date',
      ' that smells AMAZING',
      ', still frozen',
      ', with a sauce packet attached',
      ', with an @ on the packaging'
    ],
    cereal: [
      'froot loops',
      'golden Os',
      'cinnamon squares',
      'rice crispies',
      'fruit pebbles',
      'Monster Mash',
      'honey crisp',
      'Choco Chow'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
