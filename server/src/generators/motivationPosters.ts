var tracery = require('tracery-grammar')

export const actionString = (item: string) => {
  return `You look more closely at one of the many posters - ${item}.`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'it says "#slogan#" in bold face type.',
      'Someone has scrawled "#slogan#" over it, large enough you cannot see the original text.'
    ],
    slogan: [
      'bones bones bones',
      'The Enemy Within',
      'The Power Inside You - Bones',
      'Hit da bricks! Real winners quit!',
      'Did you know you have a skeleton inside you right now?'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
