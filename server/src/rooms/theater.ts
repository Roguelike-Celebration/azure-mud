/* eslint-disable no-useless-escape */
export default {
  id: 'theater',
  displayName: 'Theater',
  shortName: 'the theater',
  // kawa: fixed typo, changed src to Twitch per issue #89. Note 'parent' will need to be changed if we change domains, see issue #88. Twitch documentation about 'parent': https://discuss.dev.twitch.tv/t/twitch-embedded-player-updates-in-2020/23956
  description: `
        A stage, confusingly decorated with Halloween skulls and streamers. There are a few dozen flimsy metal chairs you can sit in, plus some comfy couches in the back. 
        You can leave to the [[kitchen]], the [[bar]], the [[foyer]], the [[@-sign statue->statue]], the [[unconferencing rooms->unconference]], or clamber into the [[shipping container->shippingContainer]].
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
