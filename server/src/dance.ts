import { User } from './user'
import { Context } from '@azure/functions'

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
  'starts a lovely tarantella'
]

export function dance (user: User, messageId: string, context: Context) {
  context.bindings.signalRMessages = [
    {
      groupName: user.roomId,
      target: 'dance',
      arguments: [messageId, user.id, danceList[Math.floor(Math.random() * danceList.length)]]
    }
  ]
}
