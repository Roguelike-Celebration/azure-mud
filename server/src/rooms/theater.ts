/* eslint-disable no-useless-escape */
export const theater = {
  id: 'theater',
  displayName: 'Theater',
  shortName: 'the theater',
  // kawa: fixed typo, changed src to Twitch per issue #89. Note 'parent' will need to be changed if we change domains, see issue #88. Twitch documentation about 'parent': https://discuss.dev.twitch.tv/t/twitch-embedded-player-updates-in-2020/23956
  description: `A stage, confusingly decorated with Halloween skulls and streamers. There are a few dozen flimsy metal chairs you can sit in, plus some comfy couches in the back. 
        You can return to the [[hall]]. Or if you'd like to speak to one of our speakers after their talk, you can head to breakout rooms: [[warrior]], [[mage]], [[rogue]], or [[tourist]].
        <br/><br/>
        <a href="stream.html" onClick="window.open(\'stream.html#\' + window.getComputedStyle(document.body).getPropertyValue(\'background-color\'), \'stream\', \'width=560,height=460\'); return false">Pop Out Stream</a><br/>
        `,
  noMediaChat: true,
  hasNoteWall: true,
  noteWallData: {
    roomWallDescription: 'There is a whiteboard set up to the side with "SPEAKER QUESTIONS" written at the top. "Questions for speakers not questions from speakers!" is hastily scrawled below it.',
    noteWallButton: 'Write a question',
    addNoteLinkText: 'add a question',
    addNotePrompt: 'What would you like to ask?',
    noteWallDescription: 'Questions for the current speaker, ranked by upvotes.'
  }
}

export const warrior = {
  id: 'warrior',
  displayName: 'Breakout room: Warrior\'s Training Grounds',
  shortName: 'Warrior Breakout',
  description: 'Stout training dummies, plenty of armour, a large variety of weapons - polearms with funny names, extremely sharp swords. A poster on the wall describes creatures that should not be attacked with blades - hydras, puddings. Or you can head back to the [[theater]].'
}

export const mage = {
  id: 'mage',
  displayName: 'Breakout room: Mage\'s Circle',
  shortName: 'Mage Breakout',
  description: 'Ever-changing sigils on the ground, pulsing with an eerie glow. A cauldrun bubbling in the corner, being stirred continuously by a capybara with a purple cape. Or you can head back to the [[theater]].'
}

export const rogue = {
  id: 'rogue',
  displayName: 'Breakout room: Rogue\'s Hideaway',
  shortName: 'Rogue Breakout',
  description: 'A mostly dark room; what you can see looks like scrolls in incomprehensible codes, and cloaks that flicker in and out of view. In another corner, targets, plus bows and crossbows and plenty of arrows and bolts. Or you can head back to the [[theater]].'
}

// Really not sure what the GNU Terry Pratchett should do here, but want to acknowledge it.
export const tourist = {
  id: 'tourist',
  displayName: 'Breakout room: Tourist\'s Gate',
  shortName: 'Tourist Breakout',
  description: 'Shockingly modern - the gate to an airport. Two very good dogs are manning the desk. One dog wants to give you a [[Platinum Yendorian Express Card->item]] the other has a dog tag labeled "GNU Terry Pratchett" and wants you to tell it about the clacks. Or you can head back to the [[theater]].'
}
