/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (obeliskSouvenirs: string) => {
  return `You eat a bag of ${obeliskSouvenirs}!`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      "Obelisk#knicknack#"
    ],
    knicknack: [
      '-shaped Cowboy Hat',
      ' Snow Globe',
      ' Knit Gloves',
      ' Socks',
      ' Popcorn Bucket',
      ' Keyring',
      ' Plushie',
      ' Plushie (Giant)',
      ' Plushie (Mini)',
      '-themed novelty license plate',
      ' Fancier’s Magazine',
      ' Incorporated Brochure',
      ' Sock Puppet',
      ' Brand Gum',
      ' Brand Mints',
      ' Brand Lozenges',
      ' Brand Cough Drops',
      ' Brand Steak Sauce',
      ' Magnet',
      ' Temporary Tattoo',
      ' Phone Charm',
      ' Bath Mat',
      ' Assembly Kit',
      ' Tarot Deck',
      '-scented Candles',
      ' Balloon',
      '-scented Soap',
      '-shaped Soap',
      ' Costume',
      ' Spice Shaker',
      ' Board Game',
      ' Chess Set',
      '-flavor Ramen Noodles',
      '-flavor Soda Pop',
      ' Juggling Set (Beginner)',
      ' Juggling Set (Advanced)',
      ' Portal Summoning Kit',
      ' Earrings',
      '-patterned Scarves',
      ' Lollipop (Suspicious)'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
