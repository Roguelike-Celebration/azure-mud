// Goal of 2021 conference room names:
// all 'monsters' that are clearly monstrous/not too humanoid, all start with different letters, come from different trad-roguelikes. But I'm not tied to these.

export const unconference = {
  id: 'unconference',
  displayName: 'Unconferencing Lobby',
  shortName: 'the unconferencing lobby',
  description: 'Winding corridors lead to a large dungeon-like room. Sticky notes and magic markers are piled up on tables along with assorted adventuring gear. White banners with blocky black text label several hallways leading to the unconferencing rooms - [[cockatrice]], [[dragon]], [[naga]], [[skeleton]], [[tengu]], and [[yak]]. You can also return back to the [[hall]].',
  hasNoteWall: true,
  noteWallData: {
    roomWallDescription: 'One wall of this room is taken up by a large whiteboard titled "UNCONFERENCE TOPIC SUGGESTIONS!" Smaller font clarifies "Write what you want to chat with others about, and upvote topics you find interesting. Moderators will assign the top six topics rooms, 5 minutes into each unconference block. Have fun!"',
    noteWallButton: 'Inspect the topics',
    addNoteLinkText: 'suggest a topic',
    addNotePrompt: 'What would you like to suggest?',
    noteWallDescription: 'Topics for unconferencing discussion, ranked by upvotes.'
  }
}

export const cockatrice = {
  id: 'cockatrice',
  displayName: 'Unconferencing: Cockatrice Containment',
  shortName: 'Unconferencing: Cockatrice',
  description: 'This is an unconferencing room. A table labelled "NECESSARY PRECAUTIONS" in huge block letters has buckets for gloves, earplugs, and lizards... but troublingly all are empty. It\'s probably fine. There\'s a statue of a hapless adventurer, cunningly carved in granite that captures their likeness midway through an apparent tumble down a flight of steps. The statue is labeled "Newb Descending a Staircase #5."<br/><br/>We encourage you to use this space to talk "face-to-face" using <a href="https://us02web.zoom.us/j/87385558857?pwd=UHREZEgyRjQ1L2dta1N1amdWMmF6dz09" target="_blank">the Zoom meeting for this room</a>, which you can access at any time during the conference. (Passcode 270805)<br/><br/>The other unconferencing rooms are [[dragon]], [[naga]], [[skeleton]], [[tengu]], and [[yak]]. Or you can climb the stairs back up to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true
}

export const dragon = {
  id: 'dragon',
  displayName: 'Unconferencing: Dragon\'s Lair',
  shortName: 'Unconferencing: Dragon',
  description: 'This is an unconferencing room. It\'s a bit difficult to move around as the floor is stacked with piles of coins, gems, and scales. Passive aggressive post-its outline an outstanding series of arguments about which colour is superior and therefore deserves the most floor space. Best not to get involved.<br/><br/>We encourage you to use this space to talk "face-to-face" using <a href="https://us02web.zoom.us/j/84647465158?pwd=Z1dsQ2lvK0Fta3I0RzR4bXNMaEU3UT09" target="_blank">the Zoom meeting for this room</a>, which you can access at any time during the conference. (Passcode 299447)<br/><br/>The other unconferencing rooms are [[cockatrice]], [[naga]], [[skeleton]], [[tengu]], and [[yak]]. Or you can climb the stairs back up to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true
}

export const naga = {
  id: 'naga',
  displayName: 'Unconferencing: Naga Den',
  shortName: 'Unconferencing: Naga',
  description: 'This is an unconferencing room. The door swings open with a push, not requiring you to use your hands. The floor is sandy and warm to the touch. Piled in a corner are Roguelike Celebration socks from various years, looking entirely unused for some reason.<br/><br/>We encourage you to use this space to talk "face-to-face" using <a href="https://us02web.zoom.us/j/84946016673?pwd=OTNRWjZKdmx0RGthWVVueHlqUm84Zz09" target="_blank">the Zoom meeting for this room</a>, which you can access at any time during the conference. (Passcode 046256)<br/><br/>The other unconferencing rooms are [[cockatrice]], [[dragon]], [[skeleton]], [[tengu]], and [[yak]]. Or you can climb the stairs back up to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true
}

export const skeleton = {
  id: 'skeleton',
  displayName: 'Unconferencing: Skeleton Clubhouse',
  shortName: 'Unconferencing: Skeleton',
  description: 'This is an unconferencing room. The walls are plastered with unconventional [[motivational posters->readPoster]]. A mini-fridge hums in the corner, but when you pop it open is stocked only with jugs of milk.<br/><br/>We encourage you to use this space to talk "face-to-face" using <a href="https://us02web.zoom.us/j/87320810860?pwd=WmhISXBza1hPZ1k3MFhDdDZwVEtPQT09" target="_blank">the Zoom meeting for this room</a>, which you can access at any time during the conference. (Passcode 799782)<br/><br/>The other unconferencing rooms are [[cockatrice]], [[dragon]], [[naga]], [[tengu]], and [[yak]]. Or you can climb the stairs back up to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true
}

export const tengu = {
  id: 'tengu',
  displayName: 'Unconferencing: Tengu Workshop',
  shortName: 'Unconferencing: Tengu',
  description: 'This is an unconferencing room. Feathers of all sizes and hues are scattered through the room, and the seating options include traditional chairs as well as perches. Do take care sitting down - whoopie cushions, wet paint, and similar mischief is to be expected here.<br/><br/>We encourage you to use this space to talk "face-to-face" using <a href="https://us02web.zoom.us/j/82349098446?pwd=QjA5Q2pYV1pjMUxkQjNwMmFUTmMrQT09" target="_blank">the Zoom meeting for this room</a>, which you can access at any time during the conference. (Passcode 809263)<br/><br/>The other unconferencing rooms are [[cockatrice]], [[dragon]], [[naga]], [[skeleton]], and [[yak]]. Or you can climb the stairs back up to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true
}

export const yak = {
  id: 'yak',
  displayName: 'Unconferencing: Yak Pen',
  shortName: 'Unconferencing: Yak',
  description: 'This is an unconferencing room. The smell in here is... a lot. A sign at the entrance pleads "Please, no shaving!" A table is set up as if to offer refreshments but atop it are just blocks of solid salt, carved into abstract shapes by the licking of very large tongues.<br/><br/>We encourage you to use this space to talk "face-to-face" using <a href="https://us02web.zoom.us/j/82669162828?pwd=L3kxdkhHUjRqQWdFbU11Y0tocGlBdz09" target="_blank">the Zoom meeting for this room</a>, which you can access at any time during the conference. (Passcode 379872)<br/><br/>The other unconferencing rooms are [[cockatrice]], [[dragon]], [[naga]], [[skeleton]], and [[tengu]]. Or you can climb the stairs back up to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true
}
