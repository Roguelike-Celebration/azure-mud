/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (randorTheTwisted: string) => {
  return `${randorTheTwisted}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'His eyes glow with a crimson malevolence that shimmers in confusion as he looks around the room, questioning everything he sees.',
      'His goatee has been meticulously bent and shaped by constant twirling.',
      'He exudes an aura of quiet hostility only somewhat belied by the animal fur covering his black cloak.',
      'He sits pondering an orb filled with a blood red mist and emitting #noise.a#.',
      'In his hands is a notebook crafted of #material# and inked with #ink#. He quietly sighs, unable to focus on its content.',
      'You see a sheet of paper on the desk beside Randor\'s skull throne. It\'s folded closed, but you can see it\'s been sealed with a loving heart.',
      'The fel beasts bark in the distance, eager for their master\'s orders, but he only stares off blankly into the middle distance.',
      'You notice a pile of crumpled letters tossed into a nearby trashcan beside his desk.',
      'His bloody crystal ball emits some kind of psychic force, and you sense a deep longing, and the words \'Lovers Lake\' echo in your mind.'
    ],
    material: [
      'rotten flesh',
      'ancient bone',
      'unrecognizable hide'
    ],
    ink: [
      'blood',
      'ichor',
      'bile'
    ],
    noise: [
      'quiet sound of birdsong',
      'gentle purring',
      'soft hum',
      'sound a bit like a snore'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
