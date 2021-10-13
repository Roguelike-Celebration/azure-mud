import { User } from './user'
import { Result } from './endpoint'

const danceList = [
  'drops to the floor to do the Purple Worm',
  'busts out the Green Slime, undulating wildly',
  'channels their inner jackal and howls at the moon',
  'starts doing the Yak dance (it’s real, look it up!)',
  'moves their arms in a demonstration of ‘Big Fish, Little Fish, Cardboard Box’',
  'stomps their feet in some sort of jacked-up footwork… Ubi folk dancing?',
  'pulls a leek out of *somewhere* and starts spinning it around',
  'finds a couple glowsticks and starts waving them to the beat',
  'nods their head to the beat. Feels good.',
  'pulls off some stair dancing technique - good at evading monsters, but a little crass, don\'t you think?',
  'does the Gritterbug - cardinal directions only!',
  'does some sharp moves - learned from Tukima, perhaps?',
  'waltzes with a nearby pillar',
  'does the hack and back - intense!',
  'does the shoot and scoot - radical!',
  'gets a conga line going in a narrow corridor',
  'is temporarily cursed with choreomania! Can\'t. Stop. Dancing.',
  'starts a lovely tarantella',
  'begins a scottish sword dance - wait, where\'d you get the sword?',
  'does a bit of an irish jig - it\'s weird to watch someone bob around and not move their arms.',
  'does the Bowl of Oatmeal dance. It\'s technically distinct from any other performance of the Bowl of Oatmeal, but still hard to tell apart.',
  'does a fine traditional Dwarven dance. The dance relates to the the time seventeen warriors were eaten by a carp. In the rain.',
  'does the Savescum. No, wait, missed a step. They go back to right before it and try it again.',
  'dances procedurally.',
  'does the Ragbody and collapses into a pile on the floor.',
  'generates a dance using a graph grammar.',
  'does a Wave Function Co-Lapdance; it\'s sort of all over the place but comes together at the end.',
  'does the Bump Attack, which involves a lot of hip action.',
  'dances, dances, and revolves.',
  'does the Monster Zoo which is like the Monster Mash but legally distinct.',
  'does the Vi Key dance which, no I swear once you get used to it, it\'s very intuitive.',
  'gets into a semantic debate about whether or not their action is "like" dancing or just "lite" it.',
  'opts to code a new dancing engine from scratch.',
  'does the ProcGen Practitioner.',
  'does the YASD- Yet Another Silly Dance.',
  'rocks out to some Switched-On Bach.',
  'observes that dancing is a roguelike.',
  'does the 7DRL and just barely finishes.',
  'does a realtime dance with roguelike elements.',
  'does the Z Level.',
  'does starts to do the Line of Sight but then falls into a rabbit hole about which implementation to dance.',
  'does the Flood Fill.',
  'started doing a simple Roguelike Developer dance but somehow now they\'re trying to to wrap their mind around the Computational Graph Theory dance?',
  'does the Auto-Explore.',
  'starts dancing but takes a break to get a cup of tea before considering their next step.',
  'does the too-many-Chrome-tabs dance. It\'s not especially roguelike specific, but you can relate.',
  'does a pre-game Interdimensional Dance.',
  'does Jazz Hands, Breckenridge style!',
  'does the Charleston (and grabs someone else\'s shoes).',
  'trips out a Tango of Maj\'Eyal.',
  'performs a Net-haka.',
  'does the Ancient Dance of Mystery.',
  'executes a competent Angbarndance.',
  'speedruns through a dance- wow!',
  'absolutely nails a flawlessly executed Ascension Kit. Great form!'
]

export function dance (user: User, messageId: string): Result {
  return {
    messages: [
      {
        groupId: user.roomId,
        target: 'dance',
        arguments: [messageId, user.id, danceList[Math.floor(Math.random() * danceList.length)]]
      }
    ]
  }
}
