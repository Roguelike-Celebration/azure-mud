import { User } from './user'
import { Context } from '@azure/functions'
import DB from './redis'
import { random } from 'lodash'

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
  'pulls off some stair dancing technique - good at evading monsters, but a little crass, don\'t you think?'
]

export function dance (user: User, messageId: string, context: Context) {
  context.bindings.signalRMessages = [
    {
      groupName: user.roomId,
      target: 'dance',
      arguments: [messageId, user.id, danceList[random(0, danceList.length - 1)]]
    }
  ]

/* context.res = {
    status: 200,=
    body: {}
  } */
}
