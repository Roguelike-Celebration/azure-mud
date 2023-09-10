import tracery from 'tracery-grammar'

export const actionString = (item: string) => {
  return `The crane grabs hold of something with the weakest possible grip, releasing a ${item} into the prize chute.`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      '#material# #item#',
      '#size# #material# #item#'
    ],
    size: [
      'huge',
      'miniature'
    ],
    material: [
      'stuffed',
      'plush',
      'plastic',
      'mithril',
      'leather'
    ],
    item: [
      'eel'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
