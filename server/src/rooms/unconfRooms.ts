// Goal of 2021 conference room names:
// all 'monsters' that are clearly monstrous/not too humanoid, all start with different letters, come from different trad-roguelikes. But I'm not tied to these.

export const unconference = {
  id: 'unconference',
  displayName: 'Unconferencing Lobby',
  shortName: 'the unconferencing lobby',
  description: 'Winding corridors lead to a large dungeon-like room. Sticky notes and magic markers are piled up on tables along with assorted adventuring gear. White banners with blocky black text label several hallways leading to the unconferencing rooms - [[cockatrice]], [[dragon]], [[naga]], [[skeleton]], [[tengu]], and [[yak]]. You can also return back to the [[theater]].',
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
  displayName: 'Unconferencing: cockatrice',
  shortName: 'cockatrice',
  description: 'This is an unconferencing room. Careful not to get petrified!<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[dragon]], [[naga]], [[skeleton]], [[tengu]], and [[yak]]. Or you can climb the stairs back up to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true
}

export const dragon = {
  id: 'dragon',
  displayName: 'Unconferencing: dragon\'s lair',
  shortName: 'dragon\'s lair',
  description: 'This is an unconferencing room. Careful not to get lost in the horde!<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[cockatrice]], [[naga]], [[skeleton]], [[tengu]], and [[yak]]. Or you can climb the stairs back up to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true
}

export const naga = {
  id: 'naga',
  displayName: 'Unconferencing: naga',
  shortName: 'naga',
  description: 'This is an unconferencing room. Careful not to get constricted!<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[cockatrice]], [[dragon]], [[skeleton]], [[tengu]], and [[yak]]. Or you can climb the stairs back up to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true
}

export const skeleton = {
  id: 'skeleton',
  displayName: 'Unconferencing: skeleton',
  shortName: 'skeleton',
  description: 'This is an unconferencing room. bones bones bones<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[cockatrice]], [[dragon]], [[naga]], [[tengu]], and [[yak]]. Or you can climb the stairs back up to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true
}

export const tengu = {
  id: 'tengu',
  displayName: 'Unconferencing: tengu',
  shortName: 'tengu',
  description: 'This is an unconferencing room. Caw caw!<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[cockatrice]], [[dragon]], [[naga]], [[skeleton]], and [[yak]]. Or you can climb the stairs back up to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true
}


export const yak = {
  id: 'yak',
  displayName: 'Unconferencing: yak',
  shortName: 'yak',
  description: 'This is an unconferencing room. Please, no shaving!<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[cockatrice]], [[dragon]], [[naga]], [[skeleton]], and [[tengu]]. Or you can climb the stairs back up to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true
}
