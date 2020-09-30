import northShowcaseHall from './northShowcaseHall'
import southShowcaseHall from './southShowcaseHall'
import eastShowcaseHall from './eastShowcaseHall'
import westShowcaseHall from './westShowcaseHall'
import theater from './theater'

export interface NoteWallData {
  roomWallDescription: string
  noteWallButton: string
  addNoteLinkText: string
  addNotePrompt: string
  noteWallDescription: string
}

export enum SpecialFeature {
  RainbowDoor = 'RAINBOW_DOOR',
  DullDoor = 'DULL_DOOR'
}

export interface Room {
  // e.g. "kitchen"
  id: string

  // e.g. "GitHub HQ: Kitchen"
  displayName: string

  // e.g. "the kitchen"
  shortName: string

  description: string

  // If true, webRTC audio/video chat can happen
  allowsMedia?: boolean

  // Indicates whether the room should let users place post-it notes
  // As we add more pieces of one-off functionality,
  // having a bunch of ad-hoc flags like this will probably get frustrating quickly.
  // We may want to eventually refactor to something resembling an ECS.
  hasNoteWall?: boolean
  noteWallData?: NoteWallData

  // If true, don't show the room in the side list
  hidden?: boolean

  specialFeatures?: SpecialFeature[]
}

export const roomData: { [name: string]: Room } = {
  theater,
  northShowcaseHall,
  eastShowcaseHall,
  southShowcaseHall,
  westShowcaseHall,
  kitchen: {
    id: 'kitchen',
    displayName: 'Kitchen',
    shortName: 'the kitchen',
    description: `A series of long picnic tables made of rustic wood abut a stainless steel kitchen island. On the island are a few samovars of coffee — don't worry, there's plenty of decaf too — and hot water for tea, plus a few trays of pastries.
      There are three tables you can sit at, labelled [[A->kitchenTableA]], [[B->kitchenTableB]], and [[C->kitchenTableC]]. You can also walk over to the [[bar]] or grab a seat in the [[main theater area->theater]].`,
    allowsMedia: true,
    hasNoteWall: true
  },
  kitchenTableA: {
    id: 'kitchenTableA',
    displayName: 'Kitchen Table A',
    shortName: 'table A in the kitchen',
    description: `A rustic wooden picnic table in the kitchen.
      From here, you can see tables [[B->kitchenTableB]] or [[C->kitchenTableC]], and the [[general kitchen area->kitchen]]`,
    allowsMedia: true
  },
  kitchenTableB: {
    id: 'kitchenTableB',
    displayName: 'Kitchen Table B',
    shortName: 'table B in the kitchen',
    description: `A rustic wooden picnic table in the kitchen.
      From here, you can see tables [[A->kitchenTableA]] or [[C->kitchenTableC]], and the [[general kitchen area->kitchen]]`,
    allowsMedia: true
  },
  kitchenTableC: {
    id: 'kitchenTableC',
    displayName: 'Kitchen Table C',
    shortName: 'table A in the kitchen',
    description: `A rustic wooden picnic table in the kitchen.
      From here, you can see tables [[A->kitchenTableA]] or [[B->kitchenTableB]], and the [[general kitchen area->kitchen]]`,
    allowsMedia: true,
    specialFeatures: [SpecialFeature.RainbowDoor, SpecialFeature.DullDoor]
  },
  bar: {
    id: 'bar',
    displayName: 'Bar',
    shortName: 'the bar',
    description: 'A beautiful long bar with hundreds of bottles spanning up to the ceiling. A friendly bartender will happily make you whatever you want. A laminated sign on the bartop advertises tonight\'s specials: the Tourist (a non-alcoholic drink with lots of fruit and a fun umbrella), the Berlin Interpretation (a mojito made with some sort of hyper-caffeinated soda), and the Walls Are Shifting (a Long Island Iced Tea).<br/><br/>You\'re a stone\'s throw away from the [[kitchen]], the [[theater]], the [[dance floor->danceFloor]], and the [[lounge]]. You can also crawl into the [[shipping container->shippingContainer]].',
    allowsMedia: true
  },
  lounge: {
    id: 'lounge',
    displayName: 'Lounge',
    shortName: 'the lounge',
    description: 'A chill space to hang away from the hustle and bustle of the main space. Comfy chairs, TVs showing video footage of roguelikes, and a fridge full of La Croix. <br/><br/>From here, you can get to the [[dance floor->danceFloor]] or the [[kitchen]].',
    allowsMedia: true
  },
  statue: {
    id: 'statue',
    displayName: '@-sign Statue',
    shortName: 'the statue',
    description: 'A memorial to countless adventurers who have helped build this social space.<br/><br/>A plaque on the statue shows a list of <a href="https://github.com/lazerwalker/azure-mud/graphs/contributors" target="_blank" rel="noreferrer">code contributors</a>.<br/>There\'s also a suggestion wall for people to add comments about the social space.',
    hasNoteWall: true,
    allowsMedia: true
  },
  danceFloor: {
    id: 'danceFloor',
    displayName: 'Dance Floor',
    shortName: 'the dance floor',
    description: 'The ping-pong table has been pushed to the side for a makeshift dance floor. A DJ booth is set up where chiptunes are playing.<br/><br/>From here, you can reach [[the kitchen]] or [[the bar]].'
  },
  shippingContainer: {
    id: 'shippingContainer',
    displayName: 'Shipping Container',
    shortName: 'the shipping container',
    description: `
      It's not quite clear why there's a shipping container in the middle of the space. Seems pretty chill, though? Somebody's set up a makeshift bench.<br/><br/>
      After you climb out, you can get back to the [[bar]], the [[theater]], the [[kitchen]], or the [[lounge]].`,
    allowsMedia: true
  },
  entryway: {
    id: 'entryway',
    displayName: 'Registration Desk',
    shortName: 'the registration desk',
    description: 'A big banner reads \'Welcome to Roguelike Celebration 2020!\' Once you\'ve got your bearings about you, you can move to the [[foyer]].',
    hidden: true
  },
  foyer: {
    id: 'foyer',
    displayName: 'Haunted Foyer',
    shortName: 'the haunted foyer',
    description: `A grand opulent foyer leading into the theatre. A chill runs down your spine as you walk in; something just feels ~off~ about this place.<br/><br/>
    You can see a [[swag table->swag]] in the corner, and can also leave to the [[theater]] or the [[west showcase hall->westShowcaseHall]]`
  },
  atelier: {
    id: 'atelier',
    displayName: 'Artists\' Atelier',
    shortName: 'the artists\' atelier',
    description: `A bright sun-lit space for an artist to work. In the corner of the room are crates full of fresh pixels of all colors, waiting to be placed on a canvas. In the middle of the room is a giant contraption made of various pieces of scrap metal; you can't honestly tell whether it's intended to be art or just leftover scrap.<br/><br/>
    From here, you can get to the [[west showcase hall->westShowcaseHall]], the [[engineer's work room->workbench]], or the [[proc-gen study->study]].`
  },
  study: {
    id: 'study',
    displayName: 'Procedural Generation Study',
    shortName: 'the proc-gen study',
    description: `A comfy and cozy library that is curiously shaped like a hexagon. One side of the room has a couple of well-worn leather armchairs, while the other four walls are filled top-to-bottom with books. The majority of them are apparent gibberish, but many of them contain insightful writings about the art of procedural content generation.<br/><br/>
    From here, you can get to the the [[engineer's workbench->workbench]] or the [[artists\' atelier->atelier]].`
  },
  workbench: {
    id: 'workbench',
    displayName: 'Engineer\'s Workbench',
    shortName: 'the engineer\'s workbench',
    description: `A cluttered workspace that clearly belongs to someone who loves to tinker. A dim hum fills the room from server racks sitting in the corner, and there are blinking lights coming from every crevice. A blueprint sitting on the workbench outlines intricate plans for something called an 'entity-component system'.<br/><br/>
    From here, you can get to the [[proc-gen study->study]] or the [[artists\' atelier->atelier]].`
  },
  unconference: {
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
  },
 minetown: {
    id: 'minetown',
    displayName: 'Unconferencing: Minetown',
    shortName: 'minetown',
    description: 'The clink of picks and sound of distant crashing rock forms a percussive backbeat to this underground town square. Dozens of candles are set into the walls, casting the space in a warm glow. A fountain stands in the center of the square, along with a large sign reading "NO SPLASHING"<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[Oracle]], [[Castle]], [[Vlad\'s Tower->tower]], [[Sokoban]], and [[Astral Plane]]. Or you can climb the stairs back up to the [[unconferencing lobby->unconference]].',
    hasNoteWall: true,
    hidden: true
  },
  oracle: {
    id: 'oracle',
    displayName: 'Unconferencing: Oracle',
    shortName: 'oracle',
    description: 'This peaceful space is decorated with burbling fountains, stately marble columns, and finely carved statues of centaurs in various poses. A small temple is the focal point, but the doors are currently closed and barred, with a stern note on the door reading "The oracle is in no mood for consultations." A smaller, more hastily written sign underneath, reads "Tea time @ Vlad\'s, be back soon!"<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[Minetown]], [[Castle]], [[Vlad\'s Tower->tower]], [[Sokoban]], and [[Astral Plane]]. Or you can go back to the [[unconferencing lobby->unconference]].',
    hasNoteWall: true,
    hidden: true
  },
  tower: {
    id: 'tower',
    displayName: 'Unconferencing: Vlad\'s Tower',
    shortName: 'Vlad\'s Tower',
    description: 'Squeaking bats and howling wolves give a festive October ambiance to this gothic tower, as you stand in the center courtyard. Small niches holding antique weaponry or suits of armour surround the yard, which can function as uncomfortably crowded break out rooms in a pinch. From far above you can hear two voices laughing, one Greek and one Transylvanian - but the reclining dragon by the stairs opens a warning eye if you venture too close.<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[Minetown]], [[Oracle]], [[Castle]], [[Sokoban]], and [[Astral Plane]]. Or you can go back down to the [[unconferencing lobby->unconference]].',
    hasNoteWall: true,
    hidden: true
  },
  castle: {
    id: 'castle',
    displayName: 'Unconferencing: Castle',
    shortName: 'castle',
    description: 'A foreboding castle stands before you, surrounded by a moat that ripples with unseen shapes swimming beneath the surface. The front of the castle is taken up by a large drawbridge that is currently raised, preventing you from venturing inside. Strangely, a pile of discarded musical instruments is piled on shore by where the bridge would presumably open - and the area directly beneath the bridge\'s landing zone is smeared with what you hope is ketchup.<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[Minetown]], [[Oracle]], [[Vlad\'s Tower->tower]], [[Sokoban]], and [[Astral Plane]]. Or you can go back to the [[unconferencing lobby->unconference]].',
    hasNoteWall: true,
    hidden: true
  },
  sokoban: {
    id: 'sokoban',
    displayName: 'Unconferencing: Sokoban',
    shortName: 'sokoban',
    description: 'This strange room is made up of blue walls with large circular pits dotting the floor, accompanied by many boulders of matching size. The boulders are strangely easy to roll from place to place - and even stranger is how often moving a boulder reveals a flattened snack underneath. Something about being in this room fills you with a subtle feeling of frustration.<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[Minetown]], [[Oracle]], [[Castle]], [[Vlad\'s Tower->tower]], and [[Astral Plane]]. Or you can go back to the [[unconferencing lobby->unconference]].',
    hasNoteWall: true,
    hidden: true
  },
  astralPlane: {
    id: 'astralPlane',
    displayName: 'Unconferencing: Astral Plane',
    shortName: 'astral plane',
    description: 'Your steps feel lighter in this glowing realm among the clouds. The majestic rays of golden light and pure sweet air would make it almost heavenly - if not for the awkward company of several strange and intimidating characters further inside by the three great temples. The way they keep shooting you suspicious glances and murmering to themselves gives you the distinct feeling they don\'t think you should be here.<br/><br/>This is a room for unconferencing! The other unconferencing rooms are [[Minetown]], [[Oracle]], [[Castle]], [[Vlad\'s Tower->tower]], and [[Sokoban]]. Or you can float back down to the [[unconferencing lobby->unconference]].',
    hasNoteWall: true,
    hidden: true
  }
}
