// To do: make whole section no-video

export const ASCII = {
  id: 'ASCII',
  displayName: 'The Hash Mark Dungeon',
  shortName: '# dungeon',
  description: 'The entire square tile you are standing on vibrates, and the world around you changes - you have entered an older time. The walls are made out of #, you can easily see the . at your feet, and your old powers of audio and video do not work here.</br></br>A row of twelve headstones stand in a line. They are all blank, except for the seventh, which is engraved with \'7 - A\'. Behind them stand three statues - a hobbit, a tree, and a crocodile. Each has a riddle engraved in its base.<\br><\br>A door behind you leads through the twisty passages, back to the [[Space Hanger->sfHub]].',
  hasNoteWall: true,
  hidden: true,
  noMediaChat: true,
  noteWallData: {
    roomWallDescription: 'Do you want your possessions identified?',
    noteWallButton: 'y/n/q',
    addNoteLinkText: 'Tell a story',
    addNotePrompt: 'Tell us of yet another sad/silly/surprising death you\'ve experienced in any roguelike.',
    noteWallDescription: 'Tales of sad, silly, and surprising deaths in roguelikes of all kinds!'
  },
  riddles: [
    'There once was a roguelike programmer,\nWhose game worked procedurally;\nThe output was same-y:\nThe play of the game-y,\nWas ten thousand bowls of me.',
    'Before I went a-questing,\nI was but a simple tree;\n\'Til once an artificer came,\nAnd cut myself from me;\nThe energies in me infused,\nI cannot understand;\nBut take my firmly in thy grip,\nAnd lightning you\'ll command.',
    'I don\'t quite belong here,\nThat much is clear;\nThe brochure understated,\nThe peril and fear;\nBut I set to make the best of it,\nAnd site-see what I can;\nI took lots of photos,\nOf the things from which I ran.'
  ]
}

// To do: major consultations?
export const Oracle = {
  id: 'Oracle',
  displayName: 'Oracle',
  shortName: 'oracle',
  hidden: true,
  noMediaChat: true,
  description: 'This peaceful space is decorated with burbling fountains, stately marble columns, and finely carved statues of centaurs in various poses. A small temple is the focal point. There is a bowl of fortune cookies labeled [["minor consultations"->getFortune]], or head back to the [[dungeon you came from->ASCII]].'
}

export const jelly = {
  id: 'jelly',
  displayName: 'Gelatinous Throne',
  shortName: 'jelly throne room',
  description: 'Get yourself a slime friend here! Or go [[back->ASCII]].',
  noMediaChat: true,
  hidden: true
}

// To do: swap these (these are the 2020 special items); make it harder to get here (more riddles, probably)
export const vault = {
  id: 'vault',
  displayName: 'Treasure Vault',
  shortName: 'the treasure vault',
  hidden: true,
  noMediaChat: true,
  description: 'On various altars you can see [[a wand of digging->item]], [[a Proof of Stremf->item]], [[a pair of seven league boots->item]], and [[Planepacked->item]], the legendary limestone statue. Or you can go [[back->ASCII]].'
}

export const wandRiddle = {
  id: 'wand',
  displayName: 'Wand',
  shortName: 'The Wand',
  hidden: true,
  noMediaChat: false,
  description: ''
}

export const identifyRiddle = {
  id: 'identify',
  displayName: 'Identify',
  shortName: 'Identify',
  hidden: true,
  noMediaChat: false,
  description: ''
}

export const losingRiddle = {
  id: 'losing',
  displayName: 'Losting',
  shortName: 'losing',
  hidden: true,
  noMediaChat: false,
  description: ''
}

export const dungeonRiddle = {
  id: 'dungeon',
  displayName: 'Dungeon',
  shortName: 'The Dungeon',
  hidden: true,
  noMediaChat: false,
  description: ''
}

export const hungerRiddle = {
  id: 'hunger',
  displayName: 'Hunger',
  shortName: 'Hunger',
  hidden: true,
  noMediaChat: false,
  description: ''
}

export const oatmealRiddle = {
  id: 'oatmeal',
  displayName: 'Oatmeal',
  shortName: 'Oatmeal',
  hidden: true,
  noMediaChat: false,
  description: ''
}

export const savescumRiddle = {
  id: 'savescum',
  displayName: 'Savescum',
  shortName: 'savescum',
  hidden: true,
  noMediaChat: false,
  description: ''
}

export const permadeathRiddle = {
  id: 'permadeath',
  displayName: 'Permadeath',
  shortName: 'permadeath',
  hidden: true,
  noMediaChat: false,
  description: ''
}

export const inventoryRiddle = {
  id: 'inventory',
  displayName: 'Inventory',
  shortName: 'inventory',
  hidden: true,
  noMediaChat: false,
  description: ''
}