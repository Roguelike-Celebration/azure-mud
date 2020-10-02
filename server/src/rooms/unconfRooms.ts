export const unconference = {
  id: 'unconference',
  displayName: 'Unconferencing Room',
  shortName: 'the unconferencing room',
  description: 'Winding corridors lead to a large dungeon-like room. Sticky notes and magic markers are piled up on tables along with assorted adventuring gear. White banners with blocky black text label several hallways leading to the unconferencing rooms - [[Minetown]], [[Oracle]], [[Sokoban]], [[Castle]], [[Vlad\'s Tower->tower]], and [[Astral Plane]]. You can also return back to the [[lounge]].',
  allowsMedia: true,
  hasNoteWall: true,
  noteWallData: {
    roomWallDescription: 'One wall of this room is taken up by a large whiteboard titled "UNCONFERENCE TOPIC SUGGESTIONS!" Smaller font clarifies "Write what you want to chat with others about, and upvote topics you find interesting. Moderators will assign the top six topics rooms, 5 minutes into each unconference block. Have fun!"',
    noteWallButton: 'Inspect the topics',
    addNoteLinkText: 'suggest a topic',
    addNotePrompt: 'What would you like to suggest?',
    noteWallDescription: 'Topics for unconferencing discussion, ranked by upvotes.'
  }
}

export const minetown = {
  id: 'minetown',
  displayName: 'Unconferencing: Minetown',
  shortName: 'minetown',
  description: 'The clink of picks and sound of distant crashing rock forms a percussive backbeat to this underground town square. Dozens of candles are set into the walls, casting the space in a warm glow. A fountain stands in the center of the square, along with a large sign reading "NO SPLASHING"<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[Oracle]], [[Castle]], [[Vlad\'s Tower->tower]], [[Sokoban]], and [[Astral Plane]]. Or you can climb the stairs back up to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true
}

export const oracle = {
  id: 'oracle',
  displayName: 'Unconferencing: Oracle',
  shortName: 'oracle',
  description: 'This peaceful space is decorated with burbling fountains, stately marble columns, and finely carved statues of centaurs in various poses. A small temple is the focal point, but the doors are currently closed and barred, with a stern note on the door reading "The oracle is in no mood for consultations." A smaller, more hastily written sign underneath, reads "Tea time @ Vlad\'s, be back soon!"<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[Minetown]], [[Castle]], [[Vlad\'s Tower->tower]], [[Sokoban]], and [[Astral Plane]]. Or you can go back to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true
}

export const tower = {
  id: 'tower',
  displayName: 'Unconferencing: Vlad\'s Tower',
  shortName: 'Vlad\'s Tower',
  description: 'Squeaking bats and howling wolves give a festive October ambiance to this gothic tower, as you stand in the center courtyard. Small niches holding antique weaponry or suits of armour surround the yard, which can function as uncomfortably crowded break out rooms in a pinch. From far above you can hear two voices laughing, one Greek and one Transylvanian - but the reclining dragon by the stairs opens a warning eye if you venture too close.<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[Minetown]], [[Oracle]], [[Castle]], [[Sokoban]], and [[Astral Plane]]. Or you can go back down to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true
}

export const castle = {
  id: 'castle',
  displayName: 'Unconferencing: Castle',
  shortName: 'castle',
  description: 'A foreboding castle stands before you, surrounded by a moat that ripples with unseen shapes swimming beneath the surface. The front of the castle is taken up by a large drawbridge that is currently raised, preventing you from venturing inside. Strangely, a pile of discarded musical instruments is piled on shore by where the bridge would presumably open - and the area directly beneath the bridge\'s landing zone is smeared with what you hope is ketchup.<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[Minetown]], [[Oracle]], [[Vlad\'s Tower->tower]], [[Sokoban]], and [[Astral Plane]]. Or you can go back to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true,
  hidden: true
}

export const sokoban = {
  id: 'sokoban',
  displayName: 'Unconferencing: Sokoban',
  shortName: 'sokoban',
  description: 'This strange room is made up of blue walls with large circular pits dotting the floor, accompanied by many boulders of matching size. The boulders are strangely easy to roll from place to place - and even stranger is how often moving a boulder reveals a flattened snack underneath. Something about being in this room fills you with a subtle feeling of frustration.<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[Minetown]], [[Oracle]], [[Castle]], [[Vlad\'s Tower->tower]], and [[Astral Plane]]. Or you can go back to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true
}

export const astralPlane = {
  id: 'astralPlane',
  displayName: 'Unconferencing: Astral Plane',
  shortName: 'astral plane',
  description: 'Your steps feel lighter in this glowing realm among the clouds. The majestic rays of golden light and pure sweet air would make it almost heavenly - if not for the awkward company of several strange and intimidating characters further inside by the three great temples. The way they keep shooting you suspicious glances and murmering to themselves gives you the distinct feeling they don\'t think you should be here.<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[Minetown]], [[Oracle]], [[Castle]], [[Vlad\'s Tower->tower]], and [[Sokoban]]. Or you can float back down to the [[unconferencing lobby->unconference]].',
  hasNoteWall: true
}
