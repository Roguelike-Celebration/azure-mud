// To do: make whole section no-video

export const oldHubRoomData = {
  ASCII: {
    id: 'ASCII',
    displayName: 'The Hash Mark Dungeon',
    shortName: '# dungeon',
    description: 'The entire square tile you are standing on vibrates, and the world around you changes - you have entered an older time. The walls are made out of #, you can easily see the . at your feet, and your old powers of audio and video do not work here.</br></br>A row of twelve headstones stand in a line. They are all blank, except for the seventh, which is engraved with \'7 - A\'. Behind them stand three statues - a hobbit, a tree, and a crocodile. Each has a riddle engraved in its base.</br></br>A door behind you leads through the twisty passages, back to the [[Space Hanger->sfHub]].',
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
  },
  Oracle: {
    id: 'Oracle',
    displayName: 'Oracle',
    shortName: 'oracle',
    hidden: true,
    noMediaChat: true,
    description: 'This peaceful space is decorated with burbling fountains, stately marble columns, and finely carved statues of centaurs in various poses. A small temple is the focal point. There is a bowl of fortune cookies labeled [["minor consultations"->getFortune]], or head back to the [[dungeon you came from->ASCII]].'
  },
  jelly: {
    id: 'jelly',
    displayName: 'Gelatinous Throne',
    shortName: 'jelly throne room',
    description: 'Get yourself a slime friend here! Or go [[back->ASCII]].',
    noMediaChat: true,
    hidden: true
  },
  wildchaospit: {
    id: 'wildchaospit',
    displayName: 'The Wild Chaos Pit',
    shortName: 'wild chaos pit',
    hidden: true,
    noMediaChat: true,
    description: `You invoke the spell you've discovered and the world melts around you. You had been standing in the conference hall; now you're floating in an endless abyss. No, that's not right: you're *falling through* it, from the material plane to a realm of pure, elemental chaos. Wild, fantastical shapes emerge from swirling mists as you descend, nightmares made real that advance upon you only to be torn apart and dissolve back into mist. Eventually your hellish journey ends and you land, with essentially no fanfare, at the very center of the Wild Chaos Pit.
    </br></br>You're in a small room with off-white walls and no exits. There's a desk with some kind of demon in a poorly fitted suit, typing away on a computer terminal. It spares you a glance as you enter and greets you in a droning monotone. ""Oh, hello. Welcome to the Wild Chaos Pit. Cower in fear at our terrifying splendor."" The demon gestures to an inspiration poster of a skeleton hanging from a telephone wire as evidence of this. ""We would like to take this opportunity to thank you for your assistance in our mission. The forces of Chaos have had a great quarter, and we could not have succeeded in meeting our operational goals without the dedication and support of you, the player. Please avail yourself of our fabulous facilities before returning to your realm."" The demon, their speech finished, turns their attention back to the computer. Without looking up, they drone: ""Oh, my apologies. Before returning to your realm, *mortal*.""
    </br></br>Apart from the desk and skeleton poster, the room is minimally furnished. Beneath a banner that says ""Division Leaders 3Q21! Grab your Swag!"" there's a large pile of what appear to be Orbs of Zot. Another, even bigger pile contains what must be thousands of Amulets of Yendor, and the third ""pile"" is a single, already-opened box of 8 crayons.</br></br>""Exit through the gift shop,"" says the demon. ""Emphasis on exit."" They nod at the other end of the room, where four pentagrams are etched into the floor.
    </br></br>One pentagram looks very [[high tech->pentagramHighTech]]. Another is more [[minimalist and austere->pentagramMinimalist]]. A third is [[wavey and almost comical->pentagramComical]]. The last pentagram seems somehow [[extremely normal->pentagramNormal]].`
  },
  wandRiddle: {
    id: 'wand',
    displayName: 'Wand',
    shortName: 'The Wand',
    hidden: true,
    noMediaChat: false,
    description: ''
  },
  identifyRiddle: {
    id: 'identify',
    displayName: 'Identify',
    shortName: 'Identify',
    hidden: true,
    noMediaChat: false,
    description: ''
  },
  losingRiddle: {
    id: 'losing',
    displayName: 'Losting',
    shortName: 'losing',
    hidden: true,
    noMediaChat: false,
    description: ''
  },
  dungeonRiddle: {
    id: 'dungeon',
    displayName: 'Dungeon',
    shortName: 'The Dungeon',
    hidden: true,
    noMediaChat: false,
    description: ''
  },
  hungerRiddle: {
    id: 'hunger',
    displayName: 'Hunger',
    shortName: 'Hunger',
    hidden: true,
    noMediaChat: false,
    description: ''
  },
  oatmealRiddle: {
    id: 'oatmeal',
    displayName: 'Oatmeal',
    shortName: 'Oatmeal',
    hidden: true,
    noMediaChat: false,
    description: ''
  },
  savescumRiddle: {
    id: 'savescum',
    displayName: 'Savescum',
    shortName: 'savescum',
    hidden: true,
    noMediaChat: false,
    description: ''
  },
  permadeathRiddle: {
    id: 'permadeath',
    displayName: 'Permadeath',
    shortName: 'permadeath',
    hidden: true,
    noMediaChat: false,
    description: ''
  },
  inventoryRiddle: {
    id: 'inventory',
    displayName: 'Inventory',
    shortName: 'inventory',
    hidden: true,
    noMediaChat: false,
    description: ''
  }
}
