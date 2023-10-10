/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (ray: string) => {
  return `${ray}`
}

export const generate = () => {
  const grammar = tracery.createGrammar({
    origin: [
      'His tall, lanky frame is wrapped in a bright yellow jacket 2 sizes too large.',
      'A grey beanie sits atop his long mane of dirty blond hair, and all of it is haphazardly put together with little concern for fashion.',
      'You get a whiff of a strange plant smell any time you so much as glance at him.',
      'The two men stand facing each other and all you hear are expletives, but somehow they seem to understand each other.',
      'As you look at him, he breaks into an impromptu fit of rap.'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)

  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
