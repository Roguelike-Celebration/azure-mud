import tracery from 'tracery-grammar'

export const actionString = (item: string) => {
  return `You make the mistake of reading the catalog out loud. Coins vanish from your purse, and ${item} appears at your feet as ominous laughter echoes in the distance.`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      '#pillType# Pills for #malady#',
      '#person#\'s #cureType# Cure',
      '#cureType# Cure for #malady#',
      'System Builder and Lung Restorer',
      'Giant Power Electric Belt',
      'Griffons\' Plush Cape',
      'Maternity Outfit For Mother',
      'Seer\'s Motor Buggy',
      'Saving Plan For Upper Planes Home Buyer',
      'A Chicken',
      'Wide Cuffed Pants +1',
      '#person#\'s #item#'
    ],
    person: [
      'Syzygyrior',
      'Dr Mandelbrot',
      'Brown',
      'Xanthar',
      'Tasha'
    ],
    pillType: [
      'Goblin',
      'Wizard',
      'Cursed',
      'Blessed',
      'Definitely Not Cursed',
      'Math'
    ],
    cureType: [
      'Consumption',
      'Quick',
      'Vegetable',
      'Instant'
    ],
    malady: [
      'Weak Goblins',
      'Low T (Treasure)',
      'Collapsed Wave Functions',
      'Kobold Weakness',
      'Persistent Undeath'
    ],
    item: [
      'Guide to Everything in the Mall',
      'Hideous Sweater'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
