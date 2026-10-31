import axios from 'axios'
import firebase from 'firebase/app'
import { Dispatch } from 'react'
import { v4 as uuid } from 'uuid'

import { Badge } from '../server/src/badges.js'
import { MESSAGE_MAX_LENGTH } from '../server/src/config.js'
import {
  RoomResponse,
  ServerSettings
} from '../server/src/types.js'
import { MinimalUser, User } from '../server/src/user.js'

import {
  Action,
  ChatMessageAction,
  CommandMessageAction,
  ConnectAction,
  DanceAction,
  DeleteMessageAction,
  EmoteAction,
  EquipBadgeAction,
  ErrorAction,
  HideModalAction,
  ModMessageAction,
  NoteAddAction,
  NoteRemoveAction,
  NoteUpdateLikesAction,
  NoteUpdateRoomAction,
  ObeliskNoteAddAction,
  ObeliskNoteRemoveAction,
  ObeliskNoteUpdateAction,
  ObeliskNoteUpdateLikesAction,
  PlayerBannedAction,
  PlayerConnectedAction,
  PlayerDisconnectedAction,
  PlayerEnteredAction,
  PlayerLeftAction,
  PlayerUnbannedAction,
  ReceivedMyProfileAction,
  ReceivedServerSettingsAction,
  SetUnlockedBadgesAction,
  ShoutAction,
  ShowModalAction,
  ShowProfileAction,
  SpaceOpenedOrClosedAction,
  UnlockBadgeAction,
  UpdatedCurrentRoomAction,
  UpdatedPresenceAction,
  UpdatedRoomDataAction,
  UpdateUnlockableBadgesAction,
  UserMapAction,
  WhisperAction
} from './Actions.js'
import Config from './config.js'
import { Modal } from './modals.js'
import { PresenceListMap, RoomDataMap, State, UserMap } from './reducer.js'
import { convertServerRoomData, Room } from './room.js'
import { ThunkDispatch } from './useReducerWithThunk.js'
import 'firebase/auth'

let myUserId: string
let myDispatch: ThunkDispatch<Action, State>

// "Safe" functions (HTTP result not used)
// Can immediately swap these out to use WebPubSub
// ---------------------------------------

export async function pickUpRandomItemFromList (listName: string): Promise<void> {
  await callAzureFunction('pickUpItem', { list: listName })
}

export async function pickUpItem (item: string): Promise<void> {
  await callAzureFunction('pickUpItem', { item })
}

export async function dropItem (): Promise<void> {
  await callAzureFunction('pickUpItem', { drop: true })
}

export async function displayMessage (message: string): Promise<void> {
  await callAzureFunction('displayMessage', { message: message })
}

export async function displayMessageFromList (listName: string): Promise<void> {
  await callAzureFunction('displayMessage', { list: listName })
}

export async function orderNewDrink (): Promise<void> {
  await callAzureFunction('orderNewDrink')
}

export async function updateProfileColor (userId: string, color: string): Promise<void> {
  await callAzureFunction('updateProfileColor', {
    userId: userId,
    color: color
  })
}

export async function updateFontReward (userId: string, font: string): Promise<void> {
  await callAzureFunction('updateFontReward', {
    userId: userId,
    font: font
  })
}

export async function disconnect (): Promise<void> {
  await callAzureFunction('disconnect')
}

export async function deleteRoomNote (noteId: string): Promise<void> {
  await callAzureFunction('deleteRoomNote', { noteId })
}

export async function deleteObeliskNote (noteId: string): Promise<void> {
  await callAzureFunction('deleteObeliskNote', { noteId })
}

export async function likeRoomNote (noteId: string): Promise<void> {
  await callAzureFunction('likeRoomNote', { noteId, like: true })
}

export async function unlikeRoomNote (noteId: string): Promise<void> {
  await callAzureFunction('likeRoomNote', { noteId, like: false })
}

export async function likeObeliskNote (noteId: string): Promise<void> {
  await callAzureFunction('likeObeliskNote', { noteId, like: true })
}

export async function unlikeObeliskNote (noteId: string): Promise<void> {
  await callAzureFunction('likeObeliskNote', { noteId, like: false })
}

export async function addNoteToWall (message: string): Promise<void> {
  if (message !== null && message.length > 0) {
    const id = uuid()
    await callAzureFunction('addRoomNote', { id, message })
  }
}

export async function addNoteToObelisk (message: string): Promise<void> {
  if (message !== null && message.length > 0) {
    const id = uuid()
    await callAzureFunction('addObeliskNote', { id, message })
  }
}

export async function openOrCloseSpace (spaceIsClosed: boolean): Promise<void> {
  await callAzureFunction('openOrCloseSpace', { spaceIsClosed })
}

export async function toggleUserBan (userId: string): Promise<void> {
  await callAzureFunction('banUser', { userId })
}

export async function toggleUserMod (userId: string): Promise<void> {
  await callAzureFunction('toggleModStatus', { userId })
}

export async function toggleUserSpeaker (userId: string, year: string): Promise<void> {
  await callAzureFunction('toggleSpeakerStatus', { userId, year })
}

export async function deleteMessage (messageId: string): Promise<void> {
  await callAzureFunction('deleteMessage', { messageId })
}

export async function deleteRoom (roomId: string): Promise<void> {
  await callAzureFunction('deleteRoom', { roomId })
}

export async function updateRoom (roomId: string, roomData: Room): Promise<void> {
  await callAzureFunction('updateRoom', { roomId, roomData })
}

// "Unsafe" functions using HTTP result.
// We can leave these as-is for now, but they will need refactoring
// in order to switch them over to 100% WebPubSub
// --------------------------------------------------------------

// HACK WARNING! this is used to resync the presence data after loading
// there's *still* a race condition in that if somebody joins/leaves while the HTTP call is transiting
// then they're invisible and it's not great
// and there's no system of recourse. but! that already existed!
export async function connectRoomData (dispatch: ThunkDispatch<Action, State>): Promise<void> {
  const result: RoomResponse = await callAzureFunction('connect')
  if (result.presenceData) {
    dispatch(UpdatedPresenceAction(result.presenceData))
  }
}

export async function connect (userId: string, dispatch: ThunkDispatch<Action, State>): Promise<void> {
  myUserId = userId
  myDispatch = dispatch

  // connectWebPubSub must be called before AFA connect/, because it auto-creates the WebPubSub
  // user that connect/ and other azureWrap-ed functions depend on.
  const eventMapping = generateEventMapping(userId, dispatch)
  await connectWebPubSub(eventMapping)
  const result: RoomResponse = await callAzureFunction('connect')

  console.log(`Called connect() AzFn for userId=${userId}. Result:`, result)
  dispatch(
    ConnectAction(
      result.roomId,
      convertServerRoomData(result.roomData),
      result.presenceData,
      result.roomNotes
    )
  )
  dispatch(UserMapAction(result.users))

  if (result.profile) {
    dispatch(ReceivedMyProfileAction(result.profile))
  }

  if (result.unlockableBadges) {
    dispatch(UpdateUnlockableBadgesAction(result.unlockableBadges))
  }

  // "serverSettings" is a handled SignalR action
  // So we should just automatically send this down on `connect`
  // (This used to be a separate call, but it's only made right after `connect`)
  const settings: ServerSettings = await callAzureFunctionGet('serverSettings')
  dispatch(ReceivedServerSettingsAction(settings))
}

export async function moveToRoom (roomId: string): Promise<void> {
  // We used to use the result, but we now use WebPubSub instead, receiving updatedCurrentRoom.
  // A lot of other stuff still uses HTTP results - ideally we'd just use WebPubSub.
  await callAzureFunction('moveRoom', { to: roomId })
}

export async function sendChatMessage (id: string, text: string, currentRoomId: string): Promise<void> {
  if (text.length > MESSAGE_MAX_LENGTH) {
    console.error(tooLongMsgLogMsg(text.length, MESSAGE_MAX_LENGTH, 'chat'))
    return
  }

  const result: RoomResponse | Error | any = await callAzureFunction(
    'sendChatMessage', { id: id, text: text }
  )
  console.log('Sent message. Result:', result)

  // If the user's expected roomId is not the roomId we get back from the server, that means the client is out of sync
  // and the server thinks you're in a different room than you are. This may be one of the reasons there are issues
  // with users being unable to hear messages while still being able to send messages. We force a move in those
  // situations, forcing the server to shift to this room.
  //
  // You can reproduce by having one user account logged in on two computers, adding a delay into the server, then
  // having it switch rooms & cutting the internet on one, so that only one gets the websockets move. After you go back
  // online type something. Until you do that, it won't be able to see any messages.
  if (result && result.roomId && !result.moved && result.roomId !== currentRoomId) {
    console.error(`Client/server room desync! Client roomId: ${currentRoomId} - Server roomId: ${result.roomId}.`)
    await moveToRoom(currentRoomId) // Sync the server
    window.location.reload() // Unless you do this, the client can't see chat - I'm not sure on the exact reason.
  }

  // Other non-message actions
  if (result && result.user) {
    myDispatch(ShowProfileAction(result.user))
  } else if (result && result.error) {
    myDispatch(ErrorAction(result.error))
  }
}

function tooLongMsgLogMsg (msgLen: number, maxLen: number, msgType: string): string {
  return `Sorry, can't send ${msgType} messages over ${maxLen} characters. Msg length: ${msgLen} chars.`
}

export async function fetchProfile (userId: string): Promise<void> {
  const result = await callAzureFunction('fetchProfile', { userId })
  if (result.error) {
    console.error('Could not fetch profile', result.error)
  } else {
    myDispatch(ShowProfileAction(result.user))
  }
}

export async function resetRoomData (isFromAdminPanel: boolean): Promise<void> {
  const response = await callAzureFunction('resetRoomData')
  if (response.roomData) {
    if (isFromAdminPanel) {
      // Admin panel doesn't have the same state tracking and you can't dispatch
      window.location.reload()
    } else {
      myDispatch(UpdatedRoomDataAction(convertServerRoomData(response.roomData)))
    }
  }
}

export async function moveAllUsersToEntryway (): Promise<void> {
  const result = await callAzureFunction('moveAllUsersToEntryway')

  if (result && result.error) {
    console.error('Error trying to move users to entryway', result.error)
  } else if (result) {
    console.log(`Moved users to the entryway: numUsers=${result.numUsers}, numMoved=${result.numMoved}, : seconds=${result.seconds}.`)
  }
}

export async function resetBadgeData (): Promise<void> {
  const response = await callAzureFunction('resetBadgeData')

  if (response.unlockedBadges) {
    myDispatch(SetUnlockedBadgesAction(response.unlockedBadges))
  }

  // This is janky, but this is debug funcitonality, so shrug
  if (response.equippedBadges && response.equippedBadges.length === 0) {
    myDispatch(EquipBadgeAction(undefined, 0))
    myDispatch(EquipBadgeAction(undefined, 1))
  }
}

export async function equipBadge (badge: Badge, index: number): Promise<void> {
  const result = await callAzureFunction('equipBadge', { badge, index })
  if (!result || !result.badges) {
    console.error('Server did not return badges from an equipBadge call')
    return
  }
  console.log('equipBadge result:', result.badges)
  for (let i = 0; i < result.badges.length; i++) {
    myDispatch(EquipBadgeAction(result.badges[i], i))
  }
}

// Fetch current obelisk notes, and subscribe to new ones for the sidebar
export async function startObservingObelisk (): Promise<void> {
  const result = await callAzureFunction('startObservingObelisk')
  if (!result || !result.notes) {
    console.error('Failed to fetch sidebar obelisk notes')
    return
  }

  console.log('startObservingObelisk result:', result.notes)
  myDispatch(ObeliskNoteUpdateAction(result.notes))
}

// Stop subscribing to sidebar obelisk note updates
export async function stopObservingObelisk (): Promise<void> {
  const result = await callAzureFunction('stopObservingObelisk')
  if (!result) {
    console.error('Failed to stop observing obelisk notes')
  }
}

export async function checkIsRegistered (): Promise<UserRegistrationStatus> {
  const result = await callAzureFunction('isRegistered')
  return {
    registeredUsername: result.registered,
    spaceIsClosed: result.spaceIsClosed,
    isMod: result.isMod,
    isBanned: result.isBanned
  }
}

interface UserRegistrationStatus {
  registeredUsername: string | false | undefined;
  spaceIsClosed: boolean;
  isMod: boolean;
  isBanned: boolean;
}

// These 3 functions are only used by admin.
export async function getRoomIds (): Promise<string[] | undefined> {
  const result = await callAzureFunction('getRoomIds')
  return result.roomIds
}

export async function getRoom (roomId: string): Promise<Room | undefined> {
  const result = await callAzureFunction('getRoom', { roomId })
  return result.room
}

export async function getAllRooms (): Promise<RoomDataMap | undefined> {
  const result = await callAzureFunction('getAllRooms')
  return result.roomData
}

// "Real" HTTP Functions
// used just as an HTTP request, do not refactor to WS
// ---------------------------------------------------------------

// If isNewUser is true, a successful update will refresh the entire page instead of dismissing a modal
export async function updateProfile (user: Partial<User>, isNew: boolean): Promise<void> {
  const result = await callAzureFunction('updateProfile', { user, isNew })
  if (result.valid) {
    if (isNew) {
      window.location.reload()
    } else {
      myDispatch(ReceivedMyProfileAction(result.user))
      myDispatch(HideModalAction())
    }
  } else if (result.error) {
    alert(result.error)
  }
}

// These are only for admins
export async function updateServerSettings (serverSettings: ServerSettings): Promise<void> {
  const result = await callAzureFunction('serverSettings', serverSettings)
  if (result) {
    myDispatch(HideModalAction())
  }
}

// Setup

function generateEventMapping (userId: string, dispatch: Dispatch<Action>) {
  return {
    playerConnected: (user: MinimalUser) => {
      console.log('Player joined!', user)
      dispatch(PlayerConnectedAction(user))
    },
    playerDisconnected: (otherId: string) => {
      console.log('Player left!', otherId)
      dispatch(PlayerDisconnectedAction(otherId))
    },
    updatedCurrentRoom: (data: RoomResponse) => {
      myDispatch(
        UpdatedCurrentRoomAction(
          data.roomId,
          convertServerRoomData(data.roomData)
        )
      )
      if (data.roomNotes) {
        myDispatch(NoteUpdateRoomAction(data.roomId, data.roomNotes))
      }
    },
    presenceData: (data: PresenceListMap) => {
      dispatch(UpdatedPresenceAction(data))
    },
    chatMessage: (messageId: string, otherId: string, message: string) => {
      // We use otherId/name basically interchangably here.
      console.log('Received chat', userId, otherId, message, messageId)
      if (otherId === userId) return

      dispatch(ChatMessageAction(messageId, otherId, message))
    },
    mods: (otherId: string, message: string) => {
      dispatch(ModMessageAction(otherId, message))
    },
    deleteMessage: (modId: string, targetMessageId: string) => {
      dispatch(DeleteMessageAction(modId, targetMessageId))
    },
    playerEntered: (name: string, fromId: string, fromName: string) => {
      if (name === userId) return
      dispatch(PlayerEnteredAction(name, fromId, fromName))
    },
    myProfile: (profile: User) => {
      dispatch(ReceivedMyProfileAction(profile))
    },
    serverSettings: (serverSettings: ServerSettings) => {
      dispatch(ReceivedServerSettingsAction(serverSettings))
    },
    whisper: (otherId: string, message: string) => {
      dispatch(WhisperAction(otherId, message))
    },
    privateCommand: (message: string) => {
      dispatch(CommandMessageAction(message))
    },
    privateItemPickup: (message: string) => {
      dispatch(CommandMessageAction(message))
    },
    playerLeft: (name: string, toId: string, toName: string) => {
      if (name === userId) return
      dispatch(PlayerLeftAction(name, toId, toName))
    },
    usernameMap: (map: UserMap) => {
      console.log('Received UserMap', map)
      dispatch(UserMapAction(map))
    },
    playerBanned: (user: MinimalUser) => {
      dispatch(PlayerBannedAction(user))
    },
    playerUnbanned: (user: MinimalUser) => {
      dispatch(PlayerUnbannedAction(user))
    },
    clientDeployed: () => {
      dispatch(ShowModalAction(Modal.ClientDeployed))
    },
    shout: (messageId: string, name: string, message: string) => {
      // We don't gate on your own userId here.
      // Because shouting can fail at the server level, we don't show it preemptively.
      dispatch(ShoutAction(messageId, name, message))
    },
    emote: (messageId: string, name: string, message: string) => {
      dispatch(EmoteAction(messageId, name, message))
    },
    dance: (messageId: string, name: string, message: string) => {
      dispatch(DanceAction(messageId, name, message))
    },
    noteAdded: (roomId: string, noteId: string, message: string, authorId: string) => {
      // Post-It Note Wall
      dispatch(NoteAddAction(roomId, { id: noteId, message, authorId }))
    },
    noteRemoved: (roomId: string, noteId: string) => {
      dispatch(NoteRemoveAction(roomId, noteId))
    },
    noteLikesUpdated: (roomId: string, noteId: string, likes: string[]) => {
      dispatch(NoteUpdateLikesAction(roomId, noteId, likes))
    },
    obeliskNoteAdded: (noteId: string, message: string, authorId: string) => {
      dispatch(ObeliskNoteAddAction({ id: noteId, message, authorId }))
    },
    obeliskNoteRemoved: (noteId: string) => {
      dispatch(ObeliskNoteRemoveAction(noteId))
    },
    obeliskNoteLikesUpdated: (noteId: string, likes: string[]) => {
      dispatch(ObeliskNoteUpdateLikesAction(noteId, likes))
    },
    spaceOpenedOrClosed: (status: boolean) => {
      dispatch(SpaceOpenedOrClosedAction(status))
    },
    ping: () => {
      callAzureFunction('pong')
    },
    unlockBadge: (badge: Badge[]) => {
      if (badge.length > 1) {
        console.error('unlockBadge: Expected one badge to unlock, got multiple ' +
          `(${badge.length}). Only unlocking first one. Badges:`, badge)
      } else if (badge.length === 0) {
        console.error('unlockBadge: Got a list of zero badges to unlock.')
        return
      }
      dispatch(UnlockBadgeAction(badge[0]))
    }
  }
}

// Can't do narrower than `any[]` here, bc the args come from JSON.parse(), so it's the
// only rest type every handler matches.
type WebPubSubEventHandler = (...args: any[]) => void
type WebPubSubEventMapping = { [event: string]: WebPubSubEventHandler }

export async function connectWebPubSub (eventMapping: WebPubSubEventMapping): Promise<void> {
  /*
  const firebaseToken = await firebase.auth().currentUser.getIdToken(false)
      request.headers = {
        ...request.headers,
        userid: firebase.auth().currentUser.uid
      }

              Authorization: `Bearer ${firebaseToken}`,
        userId: myUserId,

  */
  // negotiate
  const result = await callAzureFunctionGet('negotiatePubSub')
  console.log('Connected WebPubSub', result)
  if (!result.url) {
    console.error('Did not get URL from WebPubSub connection result', result)
    return
  }

  // connect
  const ws = new WebSocket(result.url)
  // TODO: Handle error and close
  ws.addEventListener('open', () => {
    console.log('Opened websocket connection to WebPubSub Service')
    // Note status
  })
  ws.addEventListener('message', (event) => {
    const { type, value } = JSON.parse(event.data)
    eventMapping[type](...value)
  })
  // ws.send(message);

  window.addEventListener('beforeunload', (e) => {
    callAzureFunction('disconnect')
  })
}

/** Call an Azure Function using a GET instead of the usual POST. */
async function callAzureFunctionGet (endpoint: string): Promise<any> {
  try {
    const firebaseToken = await firebase.auth().currentUser.getIdToken(false)
    const r = await axios.get(`${Config.SERVER_HOSTNAME}/api/${endpoint}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
        userId: myUserId
      }
    })
    return r.data
  } catch (e) {
    console.error(`Failed calling AzFn ${endpoint} (with HTTP GET)`, e)
    return undefined
  }
}

/** Call an Azure Function using a POST. */
async function callAzureFunction (endpoint: string, body?: any): Promise<any> {
  try {
    const firebaseToken = await firebase.auth().currentUser.getIdToken(false)
    const r = await axios.post(
      `${Config.SERVER_HOSTNAME}/api/${endpoint}`,
      body,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${firebaseToken}`
        }
      }
    )
    return r.data
  } catch (e) {
    console.error(`Failed calling AzFn ${endpoint}`, e)
    return undefined
  }
}
