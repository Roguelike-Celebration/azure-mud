import tracery from 'tracery-grammar'

export const actionString = (item: string) => {
  return `The crane grabs hold of something with the weakest possible grip, releasing a ${item} into the prize chute.`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      '#material# #item#',
      '#material# #item#',
      '#size# #material# #item#'
    ],
    size: [
      'huge',
      'miniature',
      'average',
      'microscopic',
      'life-sized',
      'room-sized'
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
