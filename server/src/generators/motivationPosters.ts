var tracery = require('tracery-grammar')

export const actionString = (poster: string) => {
  return `You look more closely at one of the many posters - ${poster}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'It says "#slogan#" in bold face type.',
      'Someone has scrawled "#slogan#" over it, large enough you cannot see the original text.',
      'It\'s filled with all sorts of text in small type, but you can make out "#slogan#"',
      '#aFriendly# skeleton is saying "#slogan#'
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
    friendly: [ // consonant-friendly
      'friendly',
      'delightful',
      'boisterous'
    ],
    appealing: [ // vowel-friendly
      'appealing',
      'excited',
      'oddly attractive'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
