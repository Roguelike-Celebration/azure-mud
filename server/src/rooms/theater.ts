/* eslint-disable no-useless-escape */
export default {
  id: 'theater',
  displayName: 'Theater',
  shortName: 'the theater',
  // kawa: fixed typo, changed src to Twitch per issue #89. Note 'parent' will need to be changed if we change domains, see issue #88. Twitch documentation about 'parent': https://discuss.dev.twitch.tv/t/twitch-embedded-player-updates-in-2020/23956
  description: `
        A stage, confusingly decorated with Halloween skulls and streamers. There are a few dozen flimsy metal chairs you can sit in, plus some comfy couches in the back. 
        You can return to the [[hall]]. Or if you'd like to speak to one of our speakers after their talk, you can head to breakout rooms [[one->breakout1]] or [[two->breakout2]].
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

export const breakout1 = {
  id: 'breakout1',
  displayName: 'first breakout room',
  shortName: 'first breakout room',
  description: 'Something witty of the first kind here. Or you can head back to the [[theater]].'
}


export const  breakout2 = {
  id: 'breakout2',
  displayName: 'second breakout room',
  shortName: 'second breakout room',
  description: 'Something witty of the second kind here. Or you can head back to the [[theater]].'
}


export const  breakout3 = {
  id: 'breakout3',
  displayName: 'third breakout room',
  shortName: 'third breakout room',
  description: 'Something witty of the third kind here. Or you can head back to the [[theater]].'
}

export const  breakout4 = {
  id: 'breakout4',
  displayName: 'last breakout room',
  shortName: 'last breakout room',
  description: 'Something witty of the final kind here. Or you can head back to the [[theater]].'
}