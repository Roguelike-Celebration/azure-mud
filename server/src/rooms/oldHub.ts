export const oldHub = {
  id: 'oldHub',
  displayName: 'the Hash Mark Dungeon',
  shortName: '/# dungeon',
  description: `Oh my god, it's made out of /#! You feel like you've entered an older time. You can visit the [[Oracle]], the [[Gelatinous Throne->jelly]], or the [[Treasure Vault->vault]]. Or head back to [[Spacehanger->sfHub]].`,
  hasNoteWall: true,
  noteWallData: {
    roomWallDescription: 'Do you want your possessions identified?',
    noteWallButton: 'y/n/q',
    addNoteLinkText: 'Tell a story',
    addNotePrompt: `Tell us of yet another sad/silly/surprising death you've experienced.`,
    noteWallDescription: '??'
  }
}

// To do: major consultations?
export const Oracle = {
  id: 'Oracle',
  displayName: 'Oracle',
  shortName: 'oracle',
  description: 'This peaceful space is decorated with burbling fountains, stately marble columns, and finely carved statues of centaurs in various poses. A small temple is the focal point. There is a bowl of fortune cookies labeled [["minor consultations"->getFortune]], or head back to the [[dungeon you came from->oldHub]].',
}

export const jelly = {
  id: 'jelly',
  displayName: 'Gelatinous Throne',
  shortName: 'jelly throne room',
  description: `Get yourself a slime friend here! Or go [[back->oldHub]].`
}

// To do: swap these (these are the 2020 special items)
export const vault = {
  id: 'vault',
  displayName: 'Treasure vault',
  shortName: 'the treasure vault',
  description: `On various altars you can see [[a wand of digging->item]], [[a Proof of Stremf->item]], [[a pair of seven league boots->item]], and [[Planepacked->item]], the legendary limestone statue. Or you can go [[back->oldHub]].`
}