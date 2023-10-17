import tracery from 'tracery-grammar'

export const actionString = (item: string) => {
  return `The crane grabs hold of something with the weakest possible grip, releasing ${item} into the prize chute.`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      '#material.a# #item#',
      '#material.a# #item#',
      '#size.a# #material# #item#',
      '#color.a# #material# #item#',
      '#size.a# #color# #material# #item#'
    ],
    size: [
      'huge',
      'miniature',
      'average',
      'microscopic',
      'life-sized',
      'room-sized',
      'pocket-sized',
      'extra-large',
      'tiny',
      'gigantic'
    ],
    color: [
      'pale',
      'golden',
      'silver',
      'red',
      'pink',
      'yellow',
      'green',
      'blue',
      'cyan',
      'violet'
    ],
    material: [
      'stuffed',
      'plush',
      'plastic',
      'mithril',
      'leather',
      'dragonglass',
      'faux-leather',
      'stainless steel',
      'jello',
      'wooden',
      'glass',
      'ceramic',
      'cardboard',
      'ceramic',
      'cloth',
      'golden',
      'titanium'
    ],
    item: [
      'eel'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
