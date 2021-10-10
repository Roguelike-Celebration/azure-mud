export enum SpecialFeature {
  RainbowDoor = 'RAINBOW_DOOR',
  DullDoor = 'DULL_DOOR',
}

// Context for this one's note wall: https://twitter.com/roguelike_con/status/1205287310037700609
export const exploreHub = {
  id: 'exploreHub',
  displayName: 'Adventurer\'s Guild Hall',
  shortName: 'the Guild',
  description: 'Something about digging into a lush world. Avoid feeling like you\'re colonizing it, though. You can go back to the central [[hall]], or into the [[temple]].',
  hasNoteWall: true,
  noteWallData: {
    roomWallDescription: 'A mage\'s tome rests on a pillar, labeled "True Facts about Roguelikes 2021".',
    noteWallLinkText: 'placeholder',
    addNoteLinkText: 'placeholder',
    addNotePrompt: 'placeholder',
    noteWallDescription: 'placeholder',
    noteWallButton: 'placeholder'
  }
}

export const temple = {
  id: 'temple',
  displayName: 'Temple of Transmutations',
  shortName: 'the temple',
  description: 'Most of the priests of the temple are busy crafting potions - you recognize the crates they\'re filling as matching the ones from the bar. There are three areas available though: [[Light]], [[Libations]], and [[Quest]].'
}
// Right now I am *fairly* sure this leads into *exactly* the modals of 2020's 'rainbow door' and 'dull door', the text of which is way over in /src/components/feature. TO DO: update that text.

export const lights = {
  id: 'lights',
  displayName: 'Hall of Lights',
  shortName: 'the lights',
  description: 'Two platforms, one with a column of ever-shifting sparkles, one seemingly perpetually in shadow. Or return to [[temple]].',
  specialFeatures: [SpecialFeature.RainbowDoor, SpecialFeature.DullDoor]
}

// all of the below is blocked by being able to tag the source of the item you're holding, and read that, and do different things based on what it is.

// idea i have no idea how to implement: give up your artefact (in the Old-School treasure vault, after the mini-game in the sci-fi area), and control what color you get.

// the idea here is that giving up food (Munxip's, in the Hub) or drinks (in the bar) will give you partial control of your emoji.

export const libations = {
  id: 'libations',
  displayName: 'Libation Fountain',
  shortName: 'the fountain',
  description: 'Offer your food and drink here, and recieve wisdom. Or return to [[temple]].'
}

// the idea here is to make other rooms with special items, and if you have *all* of them, bring them here for full emoji control, including a couple of exclusive ones.

export const quest = {
  id: 'quest',
  displayName: 'Quest for the Whatevers',
  shortName: 'the quest giver',
  description: 'Oh, I\'m so glad you\'re here! We\'re on a search for <strong>four items</strong> scattered throughout this strange space. If you find them all, bring them back here and I will be able to show you our greatest secret. Or return to [[temple]].'
}
