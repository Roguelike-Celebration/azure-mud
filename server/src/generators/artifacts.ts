/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (artifact: string) => {
  return `Your reach into the pile and pick up a: ${artifact}!`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      '#material.a# #item#',
      '#material.a# #item#',
      '#size.a# #material# #item#',
      '#color.a# #material# #item#',
      '#size.a# #color# #material# #item#'
    ],
    size: [
      'huge',
      'miniature',
      'average',
      'microscopic',
      'life-sized',
      'room-sized',
      'pocket-sized',
      'extra-large',
      'tiny',
      'gigantic',
      'eel-sized'
    ],
    color: [
      'pale',
      'golden',
      'silver',
      'red',
      'pink',
      'yellow',
      'green',
      'blue',
      'cyan',
      'violet'
    ],
    material: [
      'stuffed',
      'plush',
      'plastic',
      'mithril',
      'leather',
      'dragonglass',
      'faux-leather',
      'stainless steel',
      'jello',
      'wooden',
      'glass',
      'ceramic',
      'cardboard',
      'ceramic',
      'cloth',
      'golden',
      'titanium',
      'eelskin'
      ],
    item: [
      'Eel',
      'Eel Statuette',
      'Amulet of Yendor',
      'Health Potion',
      'Ape Figurine',
      'Orb of Zot',
      'Lumenstone',
      'Tiny puppy statue',
      'Box of crayons',
      'Mysterious music box',
      'Tattered Pirate Flag',
      'Tattered Pride Flag',
      'Glow In The Dark Clock',
      'Haunted Statue',
      'Treasure Chest',
      'Message In A Bottle',
      'Mechanism with Many Gears [purpose unknown]',
      'Dice Collection',
      'Unlucky Dice Collection',
      'Weighted Dice Collection',
      'Blessed Dice Collection',
      'Chandelier',
      'Solid Gold Calf',
      'Circle of Salt',
      'Set of Wizard Robes',
      'Full Pirate Costume',
      'Set of Plate Mail',
      'Set of Chain Mail',
      'Enchanted Sword',
      'Sword of Omens',
      'Cheap Halloween Costume',
      'Sexy Berlin Interpretation Costume',
      'Axe',
      'Staff',
      'Sword',
      'Mace'

    ]


    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
