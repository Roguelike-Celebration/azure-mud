
import { unconference, cockatrice, dragon, naga, skeleton, tengu, yak } from './unconfRooms'
import { warrior, mage, rogue, tourist, theater } from './theater'
import { loungeDungeonRoomData } from './loungeDungeon'
import { sfHub, robots, timeMachine, vendingMachine } from './sfHub'
import { ASCII, Oracle, jelly, vault } from './oldHub'
import { exploreHub, transmute, lights, victuals, quest, steam } from './exploreHub'

export interface NoteWallData {
  roomWallDescription: string
  noteWallButton: string
  addNoteLinkText: string
  addNotePrompt: string
  noteWallDescription: string
}

export enum SpecialFeature {
  RainbowDoor = 'RAINBOW_DOOR',
  DullDoor = 'DULL_DOOR',
  FullRoomIndex = 'FULL_ROOM_INDEX',
  VendingMachine = 'VENDING_MACHINE'
}

export interface Room {
  // e.g. "kitchen"
  id: string

  // e.g. "GitHub HQ: Kitchen"
  displayName: string

  // e.g. "the kitchen"
  shortName: string

  description: string

  // If false, webRTC audio/video chat is blocked
  noMediaChat?: boolean

  // Indicates whether the room should let users place post-it notes
  // As we add more pieces of one-off functionality,
  // having a bunch of ad-hoc flags like this will probably get frustrating quickly.
  // We may want to eventually refactor to something resembling an ECS.
  hasNoteWall?: boolean
  noteWallData?: NoteWallData

  // If true, don't show the room in the side list
  hidden?: boolean

  specialFeatures?: SpecialFeature[]

  // The GUID for a corresponding ACS videochat room
  // This should hopefully eventually be auto-generated and mandatory
  // but hand-coding for testing purposes now
  chatGuid?: string
}

const indexRoomData: { [name: string]: Room } = {
  entryway: {
    id: 'entryway',
    displayName: 'Registration Desk',
    shortName: 'the registration desk',
    description: 'A big banner before you reads \'Welcome to Roguelike Celebration 2021!\' Beyond the doorway you hear welcoming chatter and merriment. Once you\'ve got your bearings about you, you can move through to the [[Central Hall->hall]].',
    hidden: true
  },
  hall: {
    id: 'hall',
    displayName: 'Central Hall',
    shortName: 'the hall',
    description: `A magnificent hall stretches ahead of you, reminiscent of the grand terminal of a metropolis. Conversations echo on stone hewn walls, surrounding you in a warming background murmur of humanity. The vaulted ceiling feels impossibly high and depicts constellations of ASCII that look random at first but reveal hidden meaning the longer you stare.
    <br/><br/>
    In the center of the hall you see a circular booth overflowing with bits and bobs, labelled the [[Swag Table->swag]]. Further on, an ornate staircase leads up to the [[Bar->bar]], a carpeted hallway leads up to the [[library]], and blinking lights above a door advertise the [[Theater->theater]] entrance. 
    <br/><br/>
    To your right, a short hallway leads to the [[unconferencing rooms->unconference]]. To your left, a much longer hallway labelled [[Destinations->destinations]].`,
    hasNoteWall: true,
    noteWallData: {
      roomWallDescription: 'A big bulletin board sits in the middle of the hall, with a banner on top - "Social Space Feedback". An array of markers and sticky notes are nearby.',
      noteWallButton: 'Add feedback',
      addNoteLinkText: 'Add feedback',
      addNotePrompt: 'What feedback do you have about the social space itself?',
      noteWallDescription: 'Social Space Feedback'
    }
  },
  destinations: {
    id: 'destinations',
    displayName: 'Destinations',
    shortName: 'destinations',
    description: 'Lining both sides of this hall, huge doorways promise journeys to thrilling destinations. The majority of them are shut, with taped up [[paper signs->readClosedSign]] providing increasingly ludicrous reasons for their closure.<br/><br/>Only two halls are open, and while it\'s hard from here to tell where they\'ll go, one door shines with [[glass and chrome->sfHub]], and the other is [[crumbling and overgrown with plant life->exploreHub]].<br/><br/>You can also return to the [[Central Hall->hall]]'
  },
  swag: {
    id: 'swag',
    displayName: 'Swag Table',
    shortName: 'the swag table',
    description: `A circular booth seems entirely packed with mismatched swag, spilling over the edge and forming messy piles of goods. At the top of the pile, you see items such as [[Roguelike Celebration mousepads->item]], [[a +1 longbow->item]], [[an unidentified scroll->item]], and (surprisingly!) [[a tiny puppy->item]].
    <br/><br/>
    There's also a set of <a href="https://www.aatwebstore.com/rc2021/shop/home" target="_blank">beautiful physical shirts and mousepads you can buy in real life</a>, designed by <a href="https://marlowedobbe.com/" target="_blank">Marlowe Dobbe</a> and printed by Ann Arbor T-shirt Company.
    <br/><br/>
    A plaque set into the floor here shows a list of <a href="https://github.com/lazerwalker/azure-mud/graphs/contributors" target="_blank" rel="noreferrer">code contributors</a>.
    <br/><br/>
    From here, you can walk back to the rest of the [[hall]].`
  },
  bar: {
    id: 'bar',
    displayName: 'Bar',
    shortName: 'the bar',
    description: `The bustle of the hall fades away as you ascend the stairs, coming upon a beautiful long bar with hundreds of colourful bottles spanning up to the ceiling. A friendly bartender will happily make you whatever you want, sliding glasses over the table with ease. A laminated sign on the bartop advertises tonight's specials: [[Divine Nectar->item]] (a locally crafted mead, donated by intelligent philanthropic bees), [[the Fizzbuzz->item]] (a non-alcoholic flavored seltzer which alternates sour and sweet), and [[Yet Another Silly Drink->item]] (a colorful, layered drink with a toy cockatrice floating on top).
    <br/>A self-serve table nearby has two coolers packed to the brim with potions. One is loaded with [[colourful potions->drinkPolymorph]] of many shapes and hues, and the other with [[plain potions of clear liquid->drinkCancellation]]
    <br/><br/>
    Three booths provide opportunities to sit and enjoy conversation in smaller groups - by the [[railing->railing]], seated [[along the bar->stools]], and tucked away [[at the back->back]]. Stairs at the back lead directly to the [[theater]], or back to the [[Central Hall->hall]].`,
    hasNoteWall: true,
    noteWallData: {
      roomWallDescription: 'By the bathrooms there\'s a pile of pens and markers - it seems the bar decided if they can\'t stop graffitti, they might as well encourage patrons to use glitter pens instead of boring ballpoint.',
      noteWallButton: 'Add your mark',
      addNoteLinkText: 'Contribute',
      addNotePrompt: 'Contribute to the graffitti?',
      noteWallDescription: 'Someone has scratched ‘Rodney was here’ on an absurdly large unisex bathroom stall wall.'
    }
  },
  railing: {
    id: 'railing',
    displayName: 'Booth Along the Railing',
    shortName: 'the booth by the railing',
    description: `A cozy booth with a perfect view down to your fellow attendees coming and going from the main hall.</br></br>
      From here, you can see [[the seats at the bar->stools]] or [[at the back of the room->back]], and the [[rest of the bar->bar]].`
  },
  stools: {
    id: 'stools',
    displayName: 'Seats Along the Bar',
    shortName: 'the stools by the bar',
    description: `Seats let you comfortably squeeze in at the bar for fast service and casual conversation. Most importantly, they swivel. Whee!</br></br>
      From here, you can see tables [[by the railing->railing]] or [[at the back->back]], and the [[rest of the bar->bar]].`
  },
  back: {
    id: 'back',
    displayName: 'Booth at the Back',
    shortName: 'the booth at the back',
    description: `A secluded booth, tucked in a corner and quiet enough to speak without raising your voice. A brooding mysterious figure in a cloak stands awkwardly nearby, looking petulant at losing their preferred seat.<br/><br/>
      From here, you can see tables [[at the railing->railing]] or [[along the bar->stools]], and the [[rest of the bar->bar]]`
  },
  theater,
  warrior,
  mage,
  rogue,
  tourist,
  unconference,
  cockatrice,
  dragon,
  naga,
  skeleton,
  tengu,
  yak,
  sfHub,
  robots,
  timeMachine,
  vendingMachine,
  ASCII,
  Oracle,
  jelly,
  vault,
  exploreHub,
  transmute,
  lights,
  victuals,
  quest,
  steam,
  library: {
    id: 'library',
    displayName: 'The Library of Procedural Studies',
    shortName: 'the library',
    noMediaChat: false,
    description: 'A hush falls over you. Every possible space is filled with books and tomes - all the books in the entire space must be loans from here. A large sign over the circulation desk says "NO AUDIO - TEXT ONLY! ~ Management"<br/><br/>From here you can return to the [[hall]].'
  },

  /*  Not deleting this yet because I want to figure out what to do with the doorways / color minigame, but it *shouldn't* link anywhere.
    foyer: {
    id: 'foyer',
    displayName: 'Haunted Foyer',
    shortName: 'the haunted foyer',
    description: `A grand opulent foyer leading into the theater. A chill runs down your spine as you walk in; something just feels <em>off</em> about this place.<br/><br/>
    You can see a [[swag table->swag]] in the corner, and can also leave to the [[theater]] or the [[west showcase hall->westShowcaseHall]].`,
    specialFeatures: [SpecialFeature.RainbowDoor, SpecialFeature.DullDoor]
  }, */

  // I think right now you can't get here. It'd be nice to turn the items into something neat, though I'm not sure the full room index 'feature' was sufficiently compelling.
  hiddenPortalRoom: {
    id: 'hiddenPortalRoom',
    displayName: 'Portal Room',
    shortName: 'the portal room',
    description: `In the center of the room is a shimmering portal. Next to the portal is a pedestal with an open book. To your right is a table with a sign hung behind it, reading "Lending Table" in flowery wizard script. On the table you can see [[a wand of digging->item]], [[a Proof of Stremf->item]], [[a pair of seven league boots->item]], and [[Planepacked->item]], the legendary limestone statue.<br/><br/>
      Once you've finished here, you can [[leap into the shimmering portal->hall]]`,
    specialFeatures: [SpecialFeature.FullRoomIndex],
    hidden: true
  }
}

export const roomData: { [name: string]: Room } = {
  ...indexRoomData,
  ...loungeDungeonRoomData
}
