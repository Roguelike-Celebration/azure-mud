export const sfHub = {
  id: 'sfHub',
  displayName: 'Chrome Hallways',
  shortName: 'Shiny Hub',
  description: `Something about the future, probably. You can go back to the central [[hall]], or forge ahead to the [[Robot Fabrication Lab->robots]].<br><br>There's also an unusual [[device->timeMachine]] you can poke at.`,
  hasNoteWall: true,
  noteWallData: {
    roomWallDescription: 'There is an ever-shifting tablet-style board that says "BOOKMARKS" on the top.',
    noteWallButton: 'Add a link',
    addNoteLinkText: 'add a link',
    addNotePrompt: 'What would you like to link to?',
    noteWallDescription: 'Links to slides, videos, files, and articles of interest.'
  }
}

export const robots = {
  id: 'robots',
  displayName: 'Robot Fabrication Lab',
  shortName: 'robot lab',
  description: 'Something witty about making a robot friend. Go back to the [[hallway->sfHub]].'
}

export const timeMachine = {
  id: 'timeMachine',
  displayName: 'strange item',
  shortName: 'strange item',
  description: `make a minigame that eventually leads to the old school hub. Go back to the [[hallway->sfHub]].`
}