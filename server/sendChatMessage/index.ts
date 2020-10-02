import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { moveToRoom } from '../src/moveToRoom'
import { whisper } from '../src/whisper'
import { shout } from '../src/shout'
import { look } from '../src/look'
import authenticate from '../src/authenticate'
import { getUserIdForUsername } from '../src/user'
import { MAX_MESSAGE_LENGTH } from '../src/config'
import { dance } from '../src/dance'

const fortuneList = [
  'Always be aware of the phase of the moon!',
  'Amulets of Yendor are hard to make.  Even for a wand of wishing.',
  'Be careful!  The Wizard may plan an ambush!',
  'Digging up a grave could be a bad idea…',
  'Eat your carrots.  They\'re good for your eyes.',
  'Elbereth has quite a reputation around these parts.',
  'For a good time engrave "Elbereth"',
  'I smell a maze of twisty little passages.',
  'I\'m watching you.  -- The Wizard of Yendor',
  'Not all boots were made for walking.',
  'Someone once said that what goes up < might come down >.',
  'The magic marker is mightier than the sword.',
  'There is no harm in praising a large dog.',
  'They say that Vlad lives!!! ... in the Unconferencing Dungeon.',
  'They say that if you start at the bottom the only place to go is up.',
  'They say that you are what you eat.',
  'Two wrongs don\'t make a right, but three lefts do.',
  'Why do you suppose they call them MAGIC markers?',
  'You may discover a menagerie inside a potion bottle.',
  'The art of mimicry may be learned from the bartender, if you\'re clever.',
  'You\'re going into the morgue at midnight???',
  'What could be haunting the foyer?',
  'You might be a Proc Gen Wizard if you believe procedural generation is a set of rules to be studied and mastered.',
  'You might be a Proc Gen Sorcerer if you believe procedural generation is a medium to examine your intuitions.',
  'You might be a Proc Gen Bard if you believe in embracing the strangeness of procedurally generated content.',
  'You might be a Proc Gen Artificer if your passion is in building tools and interfaces for others to explore procedural generation.',
  'You might be a Proc Gen Cleric if rituals are a part of your procedural generation work.',
  'You might be a Proc Gen Warlock if you have argued with your procedural generator.',
  'You might be a Proc Gen Druid if you are proud of your procedural generator\'s growth.',
  'You might be a Proc Gen Ranger if you can guide others on their paths to procedural generation joy.',
  'You might be a Proc Gen Paladin if you are an activist for true understanding of the tools of procedural generation.',
  'They say that fortune cookies are food for thought.',
  'Impress your partners and friends! Bring them an orb!',
  'The real ascension is the friends you make along the way.',
  'Losing is ❗fun❗',
  'Never turn your back on an elephant.',
  'You found kitten! Good job, robot!'
]

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  await authenticate(context, req, true, async (user) => {
    if (user.isBanned) {
      context.res = {
        status: 403,
        body: { error: 'You are currently banned and cannot do this.' }
      }
      return
    }

    const message = req.body && req.body.text
    if (!message) {
      context.res = {
        status: 500,
        body: 'Include a user ID and a message!'
      }
      return
    } else if (message.length > MAX_MESSAGE_LENGTH) { // Matches MAX_MESSAGE_LENGTH from client's message.ts - unsure how to share
      context.res = {
        status: 400,
        body: 'Message length too long!'
      }
      return
    }

    const moveMatch = /^\/(go|move) (.+)/.exec(message)
    if (moveMatch) {
      return await moveToRoom(user, moveMatch[2], context)
    }

    const whisperMatch = /^\/(whisper) (.+?) (.+)/.exec(message)
    if (whisperMatch) {
      return await whisper(user, whisperMatch[2], whisperMatch[3], context)
    }

    const shoutMatch = /^\/(shout) (.+)/.exec(message)
    if (shoutMatch) {
      return await shout(user, req.body.id, shoutMatch[2], context)
    }

    const emoteMatch = /^\/(me|emote) (.+)/.exec(message)
    if (emoteMatch) {
      context.bindings.signalRMessages = [
        {
          groupName: user.roomId,
          target: 'emote',
          arguments: [req.body.id, user.id, emoteMatch[2]]
        }
      ]
      return
    }

    const danceMatch = /^\/(dance)(.*)/.exec(message)
    if (danceMatch) {
      dance(user, req.body.id, context);
      return;
    }

    const interactMatch = /^\/(interact|get) (.*)/.exec(message)
    // Todo, would be great if this could live in its own file, since it's just gonna get bigger
    // Todo, limit these to the right room
    if (interactMatch) {
      var inspectedObject = interactMatch[2]
      if (inspectedObject.includes('cookie') || inspectedObject.includes('fortune')) {
        // Inspecting a fortune cookie
        context.bindings.signalRMessages = [
          {
            groupName: user.roomId,
            target: 'emote',
            arguments: [req.body.id, user.id, ('opens a fortune cookie that reads: ' + fortuneList[Math.floor(Math.random() * fortuneList.length)])]
          }
        ]
        return
      }
      if (inspectedObject.includes('potion')) {
        // Inspecting a potion
        context.bindings.signalRMessages = [
          {
            groupName: user.roomId,
            target: 'emote',
            arguments: [req.body.id, user.id, 'quaffs a potion and grows horns!']
          }
        ]
        return
      }
      context.res = {
        status: 200,
        body: { error: 'Sorry, that isn\'t an inspectable object.' }
      }
      return
    }

    const modMatch = /^\/(mod|mods|moderator|moderators) (.+)/.exec(message)
    if (modMatch) {
      context.bindings.signalRMessages = [
        // Send to the mod-only group
        {
          groupName: 'mods',
          target: 'mods',
          arguments: [user.id, modMatch[2]]
        },
        // We also send it back to the user so it shows up in their chat window
        {
          userId: user.id,
          target: 'mods',
          arguments: [user.id, modMatch[2]]
        }
      ]
      return
    }

    const lookMatch = /^\/(look) (.+)/.exec(message)
    if (lookMatch) {
      const lookUserId = await getUserIdForUsername(lookMatch[2])
      if (!lookUserId) {
        context.res = {
          status: 400,
          body: { error: `Could not find the user ${lookMatch[2]}` }
        }
        return
      }
      return await look(lookUserId, context)
    }

    context.res = {
      status: 200,
      body: {}
    }

    context.log(`Sending to ${user.roomId}: ${message} from ${user.id}`)

    context.bindings.signalRMessages = [
      {
        groupName: user.roomId,
        target: 'chatMessage',
        arguments: [req.body.id, user.id, message]
      }
    ]
  })
}

export default httpTrigger
