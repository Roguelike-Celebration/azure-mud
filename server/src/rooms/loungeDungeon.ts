import { SpecialFeature } from '.'

export const loungeDungeonRoomData = {
  loungeDungeonDrawingRoom: {
    id: 'loungeDungeonDrawingRoom',
    displayName: 'Drawing Room',
    shortName: 'the drawing room',
    description: `A smaller, private room with a vintage wooden table in the center and eight antique chairs arranged around it. The floor is covered in thick, intricate carpets, and the walls feature ancient oak wainscoting. Sunlight pours in through four large windows, and through them you can grass over rolling green hills.<br/><br/>
    You can return to the [[lounge]], or you can continue on into the [[bedroom->loungeDungeonBedroom]].`,
    hidden: true
  },
  loungeDungeonBedroom: {
    id: 'loungeDungeonBedroom',
    displayName: 'Bedroom',
    shortName: 'the bedroom',
    description: `A cosy room featuring an unreasonably wide bed, sporting an ornate canopy. To its left is an oak drawer, with a perfectly polished mirror above it, and to its right is a door with a note on it. Written in a shaky hand, the note reads "I am done organizing your closet, it is a futile, time-wasting endeavor!"<br/><br/>
      You can return to the [[drawing room->loungeDungeonDrawingRoom]], or you can enter the [[closet->loungeDungeonClosetEntryway]].`,
    hidden: true
  },
  loungeDungeonClosetEntryway: {
    id: 'loungeDungeonClosetEntryway',
    displayName: 'Unreasonably Large Walk-In Closet',
    shortName: 'the unreasonably large walk-in closet',
    description: `There are pith helmets strewn across dresses, piles of mismatched shoes, a dozen spotless white wedding dresses, ancient steel helmets and a pile of trousers six feet high. The massive piles of shoes, garments, accessories and other sundry items in front of you make it impossible to tell how large the room is.<br/><br/>
      You can return to the [[bedroom->loungeDungeonBedroom]] or you can start [[pushing forward->loungeDungeonClosetPath]].`,
    hidden: true
  },
  loungeDungeonClosetPath: {
    id: 'loungeDungeonClosetPath',
    displayName: 'Somewhere In The Unreasonably Large Walk-In Closet',
    shortName: 'somewhere in the unreasonably large walk-in closet',
    description: `You pass a hundred umbrellas, standing upright in a gigantic bucket. You wade through a swamp of what look like napoleonic uniforms. You flee a collapsing tower of tall, fuzzy hats. A moat of very spiky armor bits threatens to stop your progress, but you shovel undershirts and chemises into it until you can cross.<br/><br/>
      You can [[go back->loungeDungeonClosetEntryway]], or head towards the distant [[tower of shoes->loungeDungeonClosetShoePath]].`,
    hidden: true
  },
  loungeDungeonClosetShoePath: {
    id: 'loungeDungeonClosetShoePath',
    displayName: 'Somewhere In The Unreasonably Large Walk-In Closet',
    shortName: 'somewhere in the unreasonably large walk-in closet',
    description: `You pass through a forest of bare mannequins that watch you as you pass. You pull a sturdy walking stick from a copse of parasols. You tunnel through a hill of belts and ties, fending off the shoelaces that swarm to impede your path. Soon after you realize that you can't see the tower of shoes you were heading towards.<br/><br/>
      You can [[go back->loungeDungeonClosetPath]] or [[venture onwards->loungeDungeonClosetShoePathEnd]].`,
    hidden: true
  },
  loungeDungeonClosetShoePathEnd: {
    id: 'loungeDungeonClosetShoePathEnd',
    displayName: 'Somewhere In The Unreasonably Large Walk-In Closet',
    shortName: 'somewhere in the unreasonably large walk-in closet',
    description: `You push blindly onwards. You can hear the shrieks of the bowties, now. They started about ten minutes ago, and their high-pitched calls have been growing in intensity. Your walking stick is sturdy, and you're a lot bigger than a bowtie, but you're on their home ground.<br/><br/>
      You can [[go back->loungeDungeonClosetShoePath]], [[prepare for the bowties->loungeDungeonClosetBowtiePrep]], or [[venture onwards->loungeDungeonClosetMannequinAmbush]].`,
    hidden: true
  },
  loungeDungeonClosetBowtiePrep: {
    id: 'loungeDungeonClosetBowtiePrep',
    displayName: 'Somewhere In The Unreasonably Large Walk-In Closet',
    shortName: 'somewhere in the unreasonably large walk-in closet',
    description: `You've never fought bowties before. You didn't know they could make sounds, or move, or fly. You wonder if they'll really attack you. Maybe they're like mountain lions? Will looking very big deter them? Or will you need to find a weapon?<br/><br/>
      You can [[find a scary coat->loungeDungeonClosetBowtieCoat]], [[find a weapon->loungeDungeonClosetBowtieWeapon]], or [[venture onwards->loungeDungeonClosetMannequinAmbush]].`,
    hidden: true
  },
  loungeDungeonClosetBowtieWeapon: {
    id: 'loungeDungeonClosetBowtieWeapon',
    displayName: 'Somewhere In The Unreasonably Large Walk-In Closet',
    shortName: 'somewhere in the unreasonably large walk-in closet',
    description: `You have no idea where you'd find a weapon. You already have a walking stick, and you're not sure anything else you've seen so far would be better. On reflection, you're not even sure if hitting a bowtie with a walking stick would kill it. Or if the bowties are even alive.<br/><br/>
      You can [[fight the bowties->loungeDungeonClosetMannequinAmbush]] or [[venture onwards->loungeDungeonClosetMannequinAmbush]].`,
    hidden: true
  },
  loungeDungeonClosetBowtieCoat: {
    id: 'loungeDungeonClosetBowtieCoat',
    displayName: 'Somewhere In The Unreasonably Large Walk-In Closet',
    shortName: 'somewhere in the unreasonably large walk-in closet',
    description: `You backtrack a couple of minutes, to the base of a cliff of coats. You try to rip out an armful, but they're too tightly packed, so you're forced to pick from among the coats that have blown off the top.<br/><br/>
      You can choose from an [[antiquated formal coat->loungeDungeonClosetBowtieCoatFight]], a [[worn trench coat->loungeDungeonClosetBowtieCoatFight]], a [[swanky suede coat->loungeDungeonClosetBowtieCoatFight]], a [[comfy-looking parka->loungeDungeonClosetBowtieCoatFight]], or an [[abandoned duster->loungeDungeonClosetBowtieCoatFight]].`,
    hidden: true
  },
  loungeDungeonClosetBowtieCoatFight: {
    id: 'loungeDungeonClosetBowtieCoatFight',
    displayName: 'Somewhere In The Unreasonably Large Walk-In Closet',
    shortName: 'somewhere in the unreasonably large walk-in closet',
    description: `You quickly don your coat and turn away from the cliff. You can see the swarm of bowties circling. You stare at them as you open your coat and spread your arms, waving them slowly. You call out, firmly. The swarm circles another couple of times, but eventually the cries stop and it seems to move on.<br/><br/>
      You realize that you can see the path to the tower of shoes you were aiming for from here.
      You can [[escape the closet->loungeDungeonBedroom]] or continue to the [[tower of shoes->loungeDungeonClosetTowerOfShoesDoor]].`,
    hidden: true
  },
  loungeDungeonClosetMannequinAmbush: {
    id: 'loungeDungeonClosetMannequinAmbush',
    displayName: 'Somewhere In The Unreasonably Large Walk-In Closet',
    shortName: 'somewhere in the unreasonably large walk-in closet',
    description: `The bowties set up a cry, hundreds at once, and then rush you! You slap them from the sky, grabbing and ripping, leaving a path of silk guts and cotton wings strewn all around the glade. Eventually, the swarm flees, silently flowing back into the forest. You stand, trumphant, amid dozens of torn bowties.<br/><br/>
      Then something kicks your legs out from under you, and you fall to the ground. Before you can react, everything goes black.<br/><br/>
      [[Wake up.->lounge]].`,
    hidden: true
  },
  loungeDungeonClosetTowerOfShoesDoor: {
    id: 'loungeDungeonClosetTowerOfShoesDoor',
    displayName: 'Somewhere In The Unreasonably Large Walk-In Closet',
    shortName: 'somewhere in the unreasonably large walk-in closet',
    description: `You reach the tower of shoes. It's gigantic, six hundred feet high at least, but only some thirty feet wide. There's a door set into its base.<br/><br/>
      You can [[escape the closet->loungeDungeonBedroom]] or enter the [[tower of shoes->hiddenPortalRoom]].`,
    hidden: true
  }
}
