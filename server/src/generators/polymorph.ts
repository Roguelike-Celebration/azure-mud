import tracery from 'tracery-grammar'

export const actionString = (text: string) => {
  const start = text.indexOf('(')
  const stop = text.indexOf(')')
  return text.substring(start + 1, stop)
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'You turn into something different! (#creature#)',
      'You feel like something has changed... (#creature#)',
      'You turn into some kind of creature! (#creature#)',
      'A sound comes out of your mouth that sounds like it belongs in a zoo! (#creature#)',
      'You turn into something different! (#creature#)',
      'You feel like something has changed... (#creature#)',
      'You turn into some kind of creature! (#creature#)',
      'A sound comes out of your mouth that sounds like it belongs in a zoo! (#creature#)',
      'You turn into something different! (#creature#)',
      'You feel like something has changed... (#creature#)',
      'You turn into some kind of creature! (#creature#)',
      'A sound comes out of your mouth that sounds like it belongs in a zoo! (#creature#)',
      'You turn into something different! (#plant#)',
      'You feel like something has changed... (#plant#)',
      'You feel yourself become rooted! (#plant#)',
      'You feel a sudden love for the sun! (#plant#)',
      'You turn into something different! (#weather#)',
      'You become something... meteorological? (#weather#)',
      'You turn into something different! (#supernatural#)',
      'You turn into some kind of strange being! (#supernatural#)',
      'You turn into something different! (#object#)',
      'You mimic something nearby! (#object#)',
      'You turn into something different! (#food#)',
      'You mimic something nearby! (#food#)',
      'Uh oh, you better hope nobody is feeling hungry, you look pretty tasty... (#food#)',
      'You turn into something different! (#food#)',
      'You mimic something nearby! (#food#)',
      'Uh oh, you better hope nobody is feeling hungry, you look pretty tasty... (#food#)',
      'You turn into something different! (#food#)',
      'You mimic something nearby! (#food#)',
      'Uh oh, you better hope nobody is feeling hungry, you look pretty tasty... (#food#)'
    ],
    creature: ['🐶', '🐕', '🐩', '🐕‍🦺', '🐺', '🦊', '🐰', '🐇', '🦝', '🐀', '🐅', '🐎', '🦓', '🦌', '🐮', '🐷', '🐫', '🐭', '🐹', '🐇', '🦇', '🐿', '🐨', '🐻', '🐼', '🦦', '🦥', '🐌', '🦨', '🐣', '🐥', '🐔', '🦩', '🦉', '🦜', '🦚', '🐸', '🐬', '🐳', '🐙', '🦑', '🦈', '🐛', '🦋', '🐞', '🐝', '🦀', '🦞', '🦐', '🐑', '🐞', '🐧', '🐢', '🐯'],
    plant: ['🌸', '🌺', '🌷', '🌱', '🌲', '🌴', '🌵', '🍁', '🍄', '🌻', '🌹'],
    weather: ['🌝', '🌞', '☁', '⭐', '🌀', '🌈', '🌕', '🌙'],
    supernatural: ['⛄', '👾', '👻', '👹', '👺', '🦖', '🦕', '🦄', '🐲', '🎃', '🧛‍♂️', '👽', '💀'],
    object: ['👓', '🧶', '🧵', '💾', '💽', '💻', '🖱', '🖊', '✏', '📝', '🎱', '🥇', '🏆', '🎲', '🔮', '🧩', '🪀', '🔑', '📱', '🔋', '📷', '📔', '✉', '💳', '♔', '♟', '♕', '♖', '♘', '⚾', '🎷', '🚂', '🚪'],
    food: ['🍕', '🍔', '🍟', '🌭', '🥐', '🥨', '🍞', '🧇', '🥯', '🧀', '🥗', '🌮', '🥪', '🌯', '🍠', '🥟', '🍚', '🍣', '🥮', '🧆', '🥣', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🍫', '🍬', '🍭', '🍮', '🍯', '☕', '🍵', '🧉', '🧃', '🥛', '🧊', '🥥', '🍇', '🍈', '🍉', '🍊', '🍋', '🍍', '🥭', '🍎', '🌽', '🍅', '🥑', '🥬', '🥦', '🥔', '🥕', '🥜']
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
