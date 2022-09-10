/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (drinkSkeleton: string) => {
  return `${drinkSkeleton}`
}

/* -drinkContent-, -drinkVessel-, -drinkName-, and -userName- are all replaced when orderNewDrink or orderExistingDrink are called. */
export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      "#vessel_sentence# -drinkContent- #name_sentence#"
    ],
    vessel_sentence: [
      "The bartender hands -userName- -drinkVessel-.",
      "-userName-'s drink comes in -drinkVessel-.",
      "Ubizara places -drinkVessel- in front of -userName."
    ],
    name_sentence: [
      "\"-drinkName-, as you ordered,\" Ubizara smiles.",
      "\"It's called -drinkName-,\" the bartender grins.",
      "Ubizara shouts that the name of the drink is -drinkName-."
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
