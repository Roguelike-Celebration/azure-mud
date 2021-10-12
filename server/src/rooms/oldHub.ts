// To do: make whole section no-video

export const ASCII = {
  id: 'ASCII',
  displayName: 'the Hash Mark Dungeon',
  shortName: '# dungeon',
  description: 'The entire square tile you are standing on vibrates, and the world around you changes - you have entered an older time. The walls are made out of #, you can easily see the . at your feet, and your old powers of audio and video do not work here. You can visit the [[Oracle]], the [[Gelatinous Throne->jelly]], or the [[Treasure Vault->vault]]. Or head back to [[Spacehanger->sfHub]].',
  hasNoteWall: true,
  hidden: true,
  noteWallData: {
    roomWallDescription: 'Do you want your possessions identified?',
    noteWallButton: 'y/n/q',
    addNoteLinkText: 'Tell a story',
    addNotePrompt: 'Tell us of yet another sad/silly/surprising death you\'ve experienced in any roguelike.',
    noteWallDescription: 'Tales of sad, silly, and surprising deaths in roguelikes of all kinds!'
  }
}

// To do: major consultations?
export const Oracle = {
  id: 'Oracle',
  displayName: 'Oracle',
  shortName: 'oracle',
  hidden: true,
  description: 'This peaceful space is decorated with burbling fountains, stately marble columns, and finely carved statues of centaurs in various poses. A small temple is the focal point. There is a bowl of fortune cookies labeled [["minor consultations"->getFortune]], or head back to the [[dungeon you came from->ASCII]].'
}

export const jelly = {
  id: 'jelly',
  displayName: 'Gelatinous Throne',
  shortName: 'jelly throne room',
  description: 'Get yourself a slime friend here! Or go [[back->ASCII]].',
  hidden: true
}

// To do: swap these (these are the 2020 special items); make it harder to get here (more riddles, probably)
export const vault = {
  id: 'vault',
  displayName: 'Treasure vault',
  shortName: 'the treasure vault',
  hidden: true,
  description: 'On various altars you can see [[a wand of digging->item]], [[a Proof of Stremf->item]], [[a pair of seven league boots->item]], and [[Planepacked->item]], the legendary limestone statue. Or you can go [[back->ASCII]].'
}
