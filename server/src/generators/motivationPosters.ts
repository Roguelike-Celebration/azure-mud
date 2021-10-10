var tracery = require('tracery-grammar')

export const actionString = (item: string) => {
  return `You look more closely at one of the many posters. ${item}.`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'It says "#slogan#" in bold face type.',
      'Someone has scrawled "#slogan#" over it, large enough you cannot see the original text.',
      `It's filled with all sorts of text, but you can make out "#slogan#"`,
      '#afriendly# skeleton is saying "#slogan#'
    ],
    slogan: [
      'bones bones bones',
      'The Enemy Within',
      'The Power Inside You - Bones',
      'Hit da bricks! Real winners quit!',
      'Did you know you have a skeleton inside you right now?',
      'Drink more milk! Calcium is good for you!',
      'Flesh is overrated.',
      'I can see right through you!'
    ],
    aFriendly: [
      'A #friendly#',
      'An #appealing#'
    ],
    friendly: [
      'friendly',
      'delightful',
      'boisterous'
    ],
    appealing: [
      'appealing',
      'excited',
      'oddly attractive'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
