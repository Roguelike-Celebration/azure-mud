export const sfHub = {
  id: 'sfHub',
  displayName: 'Space Hangar Observation Lounge',
  shortName: 'the Space Lounge',
  description: 'An impossibly fast elevator whisks you up to a bright lounge of steel, chrome, and futuristic plastics. Spacecraft of all shapes and sizes constantly come and go in view of the giant observation window. Constrasting the vast depths of space, the lounge itself is strangely cozy. Floor-to-ceiling hexagonal bookshelves provide all the reading material you could ask for, with oddly shaped but fluffy ottoman-like chairs to settle into. A [[vending machine->vendingMachine]] offers refreshment, along with an extensive bar serving Cosmic Cryo-Brewed Coffee, Terrific Techno-Tea, and apple juice.</br></br>A little robot, sensing you might need a place to relax quietly, beckons you to the [[Robot Fabrication Lab->robots]]. In the corner, a [[dusty machine->timeMachine]] blinks invitingly. You can also go back to the central [[hall]].',
  hasNoteWall: true,
  noteWallData: {
    roomWallDescription: 'Among the seemingly infinite bookshelves, one has been emptied out and contains only a small pile of notebooks. A sign next to it reads "BOOKMARKS - PLEASE HELP US SIFT THE GOOD STUFF!"',
    noteWallButton: 'Add a link',
    addNoteLinkText: 'add a link',
    addNotePrompt: 'What would you like to link to?',
    noteWallDescription: 'Contributions of links to slides, videos, and articles of interest.'
  }
}

export const robots = {
  id: 'robots',
  displayName: 'Robot Fabrication Lab',
  shortName: 'the robot lab',
  noMediaChat: true,
  description: 'This room is dominated by the quiet hum of machinery doing what it was designed to with minimal fuss and expertly crafted efficiency. Sprockets are being socketed in in one device. A robot arm picks up the socketed sprocket and passes it to a CNC spot welder, which welds it closed. The locked socketed sprockets are conveyed into an opening on the biggest machine, just one of many components for [[the robots->watchRobot]] produced at this fab lab. The entire dance is carried out with a ballet-like elegance, not a movement wasted. It\'s aggressively, profoundly satisfying. When you feel ready, you can go back to the [[Space Hangar->sfHub]].'
}

export const timeMachine = {
  id: 'timeMachine',
  displayName: 'Space Hangar - Strange Device',
  shortName: 'a strange item at the Space Hangar',
  hidden: true,
  riddles: ['A grid of glyphs in rows arrayed,\nIs how I\'ll tell your tale;\nFrom decades past to present day,\nMy codepage has prevailed;\nTiles are fine if you have have time,\nBut I shall never stale;\nNow speak my name as if you\'d /go,\nAnd I shall fill your sail.'],
  description: 'You can\'t get the machine to do anything but blink, no matter what you do, plug in or unplug. However, there is an inscription on it, that examined closely appears to be a riddle...</br></br>Go back to the [[Space Hangar->sfHub]].'
}

export const vendingMachine = {
  id: 'vendingMachine',
  displayName: 'Space Hangar - Vending Machine',
  shortName: 'the vending machine',
  description: 'Set into the wall is a curious-looking vending machine labelled "Munxip\'s Magnifient Munchies". A touch screen flashes "[[Get Random Food!->generateFood]]" in cycling colours.</br></br>Go back to the [[Space Hangar->sfHub]].'
}
