/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (zeroCrash: string) => {
  return `${zeroCrash}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'Their black leather jacket drapes all the way down to the floor, sweeping the dust as they pace back and forth.',
	  'Their eyes dart back and forth, frantically searching every inch of the room.',
	  'Their clothes seem to be entirely made of black leather, highlighted with spikes and strips of bright pink cloth.',
	  'The visor on their forehead glows a bright green and you can make out nonsensical symbols marching across its screen.',
	  'You glance down as they move and could swear you caught a glimpse of a romance novel sticking out of an interior pocket.',
	  'You take a moment to appreciate their freshly-shaved head, and the effort they clearly put into their appearance.',
	  'You notice their boots appear to include a 3 inch rise, and look incredibly uncomfortable to walk in.',
	  'Your eyes are dazzled by the light reflecting off numerous metal spikes adorning their coat.',
	  'Their eyes plead with the world, begging the universe itself to send some small relief, just this once.'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
