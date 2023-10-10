/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (hotDogGuy: string) => {
  return `${hotDogGuy}`
}

export const generate = () => {
  const grammar = tracery.createGrammar({
    origin: [
      'A young man stares at you, wearing a floppy, multicolored hat, his eyes pleading for your mercy.',
      'He glances at you as he dips a battered hotdog into hot oil.',
      'His outfit&apos;s bright colors seem to leap out at you, no matter where you turn.',
      'He looks out into the food court at all the trays left haphazardly about, and sighs.',
      'A beeping sound rings out from behind him, but he does not move.',
      'You catch him maliciously slapping the side of an ice cream machine, cursing loudly.',
      'You notice a small notepad on the side of the cash register, filled with sketches.'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)

  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
