/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (drinkVessel: string) => {
  return `${drinkVessel}`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      "#vessel_descriptor.a# #vessel_material# #vessel_type#",
      "#vessel_descriptor.a# #vessel_type#",
      "#vessel_material.a# #vessel_type#"
    ],
    vessel_descriptor: [
      "translucent",
      "ornate",
      "unadorned",
      "thin",
      "round",
      "broad",
      "delicate",
      "sturdy",
      "overflowing",
      "dripping",
      "tiny",
      "oversized",
      "child-sized",
      "heavy",
      "freezing",
      "steaming"
    ],
    vessel_material: [
      "glass",
      "crystal",
      "diamond",
      "silver",
      "gold",
      "copper",
      "plastic",
      "tin",
      "granite",
      "stone",
      "bone",
      "rubber",
      "iron",
      "ceramic",
      "styrofoam",
      "porcelain",
      "ivory",
      "obsidian"
    ],
    vessel_type: [
      "goblet",
      "glass",
      "cup",
      "bowl",
      "stein",
      "mug",
      "pitcher",
      "horn",
      "jar",
      "beaker",
      "flask",
      "quaich",
      "tumbler",
      "chalice",
      "teacup",
      "skull",
      "bottle",
      "vial"
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
