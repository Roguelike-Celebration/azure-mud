/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (snowCone: string) => {
  return `The machine whirs and dispenses a ${snowCone}!`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      "#flavor# Snow Cone"
    ],
    flavor: [
      'Bacon',
      'Sugar',
      'Cinnamon',
      'Thyme',
      'Oregano-Basil',
      'Hot Sauce',
      'Sriracha',
      'Salt',
      'Butter',
      'Honey',
      'Roasted Herb',
      'English Mustard',
      'Wasabi',
      'Paprika',
      'Za’atar',
      'Banilla',
      'Blue Raspberry',
      'BBQ Sauce',
      'Brown Butter',
      'Garam Masala',
      'Curry',
      'Thai Pepper',
      'Natto',
      'Brine',
      'Nacho Cheese',
      'Honey Mustard',
      'Banana Ketchup',
      'Matcha',
      'Smoked Salt',
      'Angostura',
      'Guacamole',
      'Tajin',
      'Mangonada',
      'Chamoy',
      'Salt & Vinegar',
      'Salt & Vinereaper',
      'Dilute Salt Water',
      'Green Slime',
      'Ochre Jelly',
      'Absinthe',
      'Blackcurrant',
      'Vinewafer',
      'Marinara',
      'Strawberry',
      'Black Tea',
      'Ketchup',
      'Pumpkin Spice',
      'Moss',
      'Tonka Bean',
      'Mint',
      'Rose',
      'Pomegranate',
      'Quince',
      'Mayonnaise',
      'Ranch',
      'Chocolate',
      'Durian',
      'Persimmon',
      'Seasalt',
      'Gochujang',
      'Blood',
      'Melon',
      'Soy Sauce',
      'Milk',
      'Milk Tea',
      'Sea Urchin',
      'Geoduck',
      'Cherry Blossom',
      'Chestnut',
      'Pumpkin',
      'Fig',
      'Sweet Potato',
      'Osmanthus',
      'Saffron',
      'Porcupine'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
