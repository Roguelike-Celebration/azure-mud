/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (madamChrysalia: string) => {
  return `${madamChrysalia}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      'She #expression#, and you are enraptured by her enormous fangs and braided muttonchops.',
      'She brushes an imaginary dust mote from one of her feathery antennae, the movement quick but precise.',
      'The dark facets of her multi-lensed eyes seem to hold every color of the circus outside.',
      'One of her hands busily grooms her fluffy antennae, but the other three still hover over the cards, waiting.',
      'You wonder if Madam Chrysalia would let you pet her. Probably not. But she looks so soft...',
      'She shakes out her white wings, the smell of #scent# unfurling throughout the cocoon.',
      'The faint scent of #scent# fills the air as Madam Chrysalia adjusts the drape of her silk garments.',
      'You wonder if she spun the Future Hut herself. The heavy silk walls smell something like #scent#.',
      'Her compound gaze never wavers. How does she blink?',
      'The giant pile of scents and silks behind her quivers slightly, and you catch a quick glimpse of the white fluff beneath before she tugs a silken panel patterned with #pattern# back into place.',
      'You think you see something like a giant white pearl beneath the heap of silks, but Madam Chrysalia whisks a beautiful scarf under your nose, showing you the #pattern# decorating the silk. It smells like #scent#.',
      'Her doubled hands are always moving, but her body stays quite still, never separating from the scented silken stack. You notice #pattern# in the pile.',
    ],

    scent: [
      'saffron',
      'vanilla',
      'dried rose petals',
      'fireweed honey',
      'patchouli',
      'sandalwood incense',
      'oolong tea',
      'caramel corn',
      'roasted peanuts',
      'sawdust',
      'ginger',
      'ginseng',
      'pumpkin spice',
      'sand-boiled coffee',
      'camel fur',
      'moth fur',
      'something entirely unlike garlic',
      'petrichor',
      'the sky before a storm',
      'a campfire in autumn',
      'your childhood home',
      'old dreams',
      'silk',
      'mulberries'
    ],

    pattern: [
      'constellations',
      'multicolored diamond-shaped patches',
      'wide stripes of blue and red',
      'black and white stripes',
      'traditional dromad designs',
      'cyanotypes',
      'teddy bears and choo-choo trains',
      'a familiar blue willow design',
      'carp gyotaku',
      'lampshades',
      'slime molds',
      'faint violet markings',
      'Obelisks',
      'card suits',
      'tarot suits',
      'astrological symbols',
      'alchemical symbols',
      'calico spots',
      'rainbow colors',
      'old memories',
      'non-Euclidian geometry',
      'moth wings',
      'mulberry leaves'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
