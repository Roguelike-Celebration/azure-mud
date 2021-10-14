export enum SpecialFeature {
  RainbowDoor = 'RAINBOW_DOOR',
  DullDoor = 'DULL_DOOR',
}

export const exploreHub = {
  id: 'exploreHub',
  displayName: 'Adventurer\'s Guild Hall',
  shortName: 'the Guild',
  description: 'A shockingly fast steam engine whisks you to a grand lounge of bronze, dark woods, and ivy trellises. Every once in a while you hear the pneumatic "whoosh" as items are carried through tubing. There\'s plenty of sturdy tufted couches and velvet lounge chairs, and a variety of elegantly carved coffee tables covered in books and journals.</br></br>You can go back to the central [[hall]], or check in at the [[Office of Transmutations->transmute]] or the [[Office of Steam->steam]].',
  hasNoteWall: true,
  noteWallData: {
    roomWallDescription: 'One journal is open, a black tome decorated with silvery and bronze swirls - "Procedural Generation Surprises" on the cover. Quill pens are nearby.',
    noteWallButton: 'Contribute',
    addNoteLinkText: 'Contribute',
    addNotePrompt: 'Tell us of a time a procedural generator has surprised or delighted you!',
    noteWallDescription: 'Tales of strange, delightful emergent results from procedural generators.'
  }
}

export const steam = {
  id: 'steam',
  displayName: 'Office of Steam',
  shortName: 'Steam',
  description: 'A hulking steam engine is under glass, powering an ancient computer. It\'s hooked to a typewriter, akin to teletext, and regularly printing out game [[recommendations->getGameRec]]. If you\'d like, you can investigate the<a href="https://store.steampowered.com/sale/roguelikecelebration2021" target="_blank">source of its steam power</a>, or go back to the [[Guild Hall->exploreHub]].'
}

export const transmute = {
  id: 'transmute',
  displayName: 'Office of Transmutations',
  shortName: 'Transmutations',
  description: 'Most of the workers are busy crafting potions - you recognize the crates they\'re filling as matching the ones from the [[bar]]. While most of the hallways are blocked off by swathes of alchemical gear, you can just squeeze through to one, with an orante sign for [[Dye Machines->dyes]]. Or you can return to the [[Guild Hall->exploreHub]].'
}
// Right now I am *fairly* sure this leads into *exactly* the modals of 2020's 'rainbow door' and 'dull door', the text of which is way over in /src/components/feature. TO DO: update that text.

export const dyes = {
  id: 'dyes',
  displayName: 'Dye Machines',
  shortName: 'the dye machines',
  description: 'There are huge archways on either side of this large room. One is covered in [[gears and paint splatters->doctorPaint]]; the other is dominated by delicate [[glass tubes->shower]]. Or you can turn around and return to [[the office->transmute]].'
}

export const doctorPaint = {
  id: 'doctorPaint',
  displayName: 'An incredibly complicated machine',
  shortName: 'the paint machine',
  description: 'You find yourself in a space dominate by an incredibly complicated machine. Arcs of aetheric energy jump between leyden jars, and what appears to be an enormous water clock is driving an incomprehensible mass of gearwork. At the center of it all, like a tiny egg in rather large nest, is a simple chair. A frenetic individual in a white coat, their features obscured by thick googles and safety gear is tightening a bolt on the machine when you walk up.<br/><br/>Or maybe you should just [[leave->dyes]].',
  specialFeatures: [SpecialFeature.RainbowDoor]
}

export const shower = {
  id: 'shower',
  displayName: 'The Secondarily-Hydrogenated Oxygen Weighted Emulsion Remover',
  shortName: 'the S.H.O.W.E.R.',
  description: 'There\'s a large glass object here, embedded in a cage of tubes and wires. It\'s almost like a giant vacuum tube or a huge beaker closed off at the top, except that there\'s an opening in the side large enough to step through.<br/><br/>Or simply [[return->dyes]].',
  specialFeatures: [SpecialFeature.DullDoor]
}

/* // all of the below is blocked by being able to tag the source of the item you're holding, and read that, and do different things based on what it is.

// idea i have no idea how to implement: give up your artefact (in the Old-School treasure vault, after the mini-game in the sci-fi area), and control what color you get.

// the idea here is that giving up food (Munxip's, in the Hub) or drinks (in the bar) will give you partial control of your emoji.

export const victuals = {
  id: 'victuals',
  displayName: 'Victual Studies',
  shortName: 'victuals',
  description: 'Scientists are examining the properties of food and drinks. If you\'re willing, you can drop some off here to help them, and they\'ll reward you accordingly. Or return to [[the office->transmute]].'
}

// the idea here is to make other rooms with special items, and if you have *all* of them, bring them here for full emoji control, including a couple of exclusive ones.

export const quest = {
  id: 'quest',
  displayName: 'Quest for the Whatevers',
  shortName: 'the quest giver',
  description: 'Oh, I\'m so glad you\'re here! We\'re on a search for <strong>four items</strong> scattered throughout this strange space. If you find them all, bring them back here and I will be able to show you our greatest secret. Or return to [[the office->transmute]].'
}
 */
