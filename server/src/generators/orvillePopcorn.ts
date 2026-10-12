/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (popcorn: string) => {
  return `You get a bucket of ${popcorn}!`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      "popped #plant# topped with #toppings#"
    ],
    plant: [
      'Corn',
      'Habanero',
      'Sunflower Seeds',
      'Barley',
      'Sesame',
      'Tarts',
      'Potatoes',
      'Cactus',
      'Jalapeño',
      'Peas',
      'Rose Petals',
      'Water Lily Seeds',
      'Seaweed',
      'Sorghum',
      'Lotus Seeds',
      'Chickpeas',
      'Cauliflower',
      'Rice',
      'Sushi Rice',
      'Jasmine Rice',
      'Basmati Rice'

    ],
    toppings: [
      'Chili',
      'Sprinkles',
      'Croutons',
      'Sauerkraut',
      'Goat Cheese',
      'Fresh Sprouts',
      'Mini Donuts',
      'Roasted Vegetables',
      'Grilled Onions',
      'Creamed Spinach',
      'Spinach',
      'Taco Medley',
      'Potato Chips',
      'Crushed Mana Crystal',
      'Sunflower Seeds',
      'Barley',
      'Sesame Seeds',
      'Walnuts',
      'Cashews',
      'Brazil Nuts',
      'Marinara',
      'Pesto Aioli',
      'Garlic Aioli',
      'Oolong Tea Leaves',
      'Dong Ding Tea Leaves',
      'Wild Garlic',
      'Wild Gensing',
      'Flakes of Gold',
      'Fairy Dust',
      'Powdered Bacon',
      'Dried Halibut',
      'Dried Squid',
      'Dried Eel',
      'Experience Points',
      'Hot Sauce',
      'Anchovies',
      'Butter',
      'Garlic Powder',
      'Furikake',
      'Li Hing Powder',
      'Cajun Seasoning',
      'Tony Chachere’s',
      'Slap Ya Mama Hot Sauce',
      'Buttered Eel'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
