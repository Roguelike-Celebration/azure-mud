/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (dromadTam: string) => {
  return `${dromadTam}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'The #obeliskmerch# are humming a faint but jaunty carnival tune. Tam seems nonplussed.',
      'The #obeliskmerch# pulse in a steady rhythm, and Tam taps a two-toed foot.',
      'Tam flicks a many-ringed ear beneath his giant hat. Is he wearing an Obelisk earring?',
      'He rearranges the display of #obeliskmerch#.',
      'He murmurs a few words of a song, the sound coming from deep in his chest. Something about salt?',
      'The #obeliskmerch# float towards the top of the booth, but Tam shoos them back with an annoyed gesture.',
      'The corner of a #oddity# peeks from beneath his giant Obelisk hat.',
      'You see the flicker of Tam’s third eyelid as a puff of dust blows through the booth.',
      'The way his long lashes rest against his furred cheek reminds you of something you can’t quite name, but it tastes like a burst of fresh water in a salt-parched mouth.',
      'Tam glares at you blankly while chewing something that smells of mint.',
      'The perfect hump of fat on his back, large and handsome though it is, is still humbled in comparison to the sheer enormity of the gigantic Obelisk hat perched upon his long head.',
      'He calls out a greeting to another passing circus-goer, slow and formal.',
      'He lifts one of the #obeliskmerch#, proffering it for you to admire.',
      'A sudden eye blinks down at you from the huge Obelisk hat. Tam seems not to notice.',


obeliskmerch: [
  'Obelisk-scented candles',
  'Obelisk balloons',
  'giant Obelisk plushies',
  'Obelisk plushies',
  'mini Obelisk plushies',
  'Obelisk costumes',
  'Obelisk soaps',
  'Obelisk keyrings',
  'Obelisk spice shakers',
  'Obelisk board games',
  'Obelisk chess sets',
  'Obelisk flavor ramen noodles',
  'Obelisk flavor soda pop',
  'Obelisk juggling sets (for beginners)',
  'Obelisk juggling sets (advanced)',
  'Obelisk portal summoning kits',
  'Obelisk earrings',
  'Obelisk-patterned scarves',
  'suspicious Obelisk lollipops'
]

oddity: [
  'clown-repelling charm',
  'amulet of Rodney',
  'vinewafer',
  'dram of honey',
  'frayed mustache',
  'vorpal sword',
  'chunk of obsidian',
  'brightly-colored egg',
  'circus peanut',
  'slime mold',
  'tiny frog bum',
  'inappropriate camel anatomy',
  'orb of zot'
]


  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
