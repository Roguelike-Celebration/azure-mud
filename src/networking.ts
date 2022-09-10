import * as SignalR from '@aspnet/signalr'
import { v4 as uuid } from 'uuid'

import { RoomResponse, ErrorResponse, ServerSettings } from '../server/src/types'
import { Dispatch } from 'react'
import {
  Action,
  ErrorAction,
  PlayerConnectedAction,
  PlayerDisconnectedAction,
  ChatMessageAction,
  PlayerEnteredAction,
  WhisperAction,
  PlayerLeftAction,
  ShoutAction,
  EmoteAction,
  DanceAction,
  ShowProfileAction,
  UserMapAction,
  ModMessageAction,
  UpdatedCurrentRoomAction,
  UpdatedRoomDataAction,
  UpdatedPresenceAction,
  ReceivedMyProfileAction,
  DeleteMessageAction,
  NoteAddAction,
  NoteRemoveAction,
  NoteUpdateRoomAction,
  NoteUpdateLikesAction,
  HideModalAction,
  SpaceOpenedOrClosedAction,
  PlayerBannedAction,
  PlayerUnbannedAction,
  ReceivedServerSettingsAction,
  ShowModalAction, CommandMessageAction, CaptionMessageAction, EquipBadgeAction, UpdateUnlockableBadgesAction, UnlockBadgeAction, SetUnlockedBadgesAction
} from './Actions'
import { User } from '../server/src/user'
import { convertServerRoomData, Room } from './room'
import { MESSAGE_MAX_LENGTH } from '../server/src/config'
import { Modal } from './modals'
import Config from './config'
import firebase from 'firebase/app'
import 'firebase/auth'
import axios from 'axios'
import { Badge } from '../server/src/badges'

let myUserId: string
let myDispatch: Dispatch<Action>

const inMediaChat: boolean = false

export async function connect (userId: string, dispatch: Dispatch<Action>) {
  myUserId = userId
  myDispatch = dispatch

  const result: RoomResponse = await callAzureFunction('connect')

  console.log(result)
  dispatch(UpdatedCurrentRoomAction(result.roomId, convertServerRoomData(result.roomData)))
  dispatch(UserMapAction(result.users))

  if (result.profile) {
    dispatch(ReceivedMyProfileAction(result.profile))
  }

  if (result.roomNotes) {
    dispatch(NoteUpdateRoomAction(result.roomId, result.roomNotes))
  }

  if (result.unlockableBadges) {
    dispatch(UpdateUnlockableBadgesAction(result.unlockableBadges))
  }

  dispatch(UpdatedPresenceAction(result.presenceData))

  connectSignalR(userId, dispatch)
}

export async function disconnect (userId: string) {
  const result = await callAzureFunction('disconnect')
}

export async function getServerSettings (dispatch: Dispatch<Action>) {
  const result: ServerSettings = await callAzureFunctionGet('serverSettings')
  dispatch(ReceivedServerSettingsAction(result))
}

export async function updateServerSettings (serverSettings: ServerSettings) {
  const result = await callAzureFunction('serverSettings', serverSettings)
  if (result) {
    myDispatch(HideModalAction())
  }
}

export async function resetRoomData () {
  const response = await callAzureFunction('resetRoomData')
  if (response.roomData) {
    myDispatch(UpdatedRoomDataAction(convertServerRoomData(response.roomData)))
  }
}

export async function resetBadgeData () {
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

// If isNewUser is true, a successful update will refresh the entire page instead of dismissing a modal
export async function updateProfile (user: Partial<User>, isNew: boolean) {
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

export async function updateProfileColor (userId: string, color: string) {
  const result = await callAzureFunction('updateProfileColor', { userId: userId, color: color })
}

export async function updateFontReward (userId: string, font: string) {
  const result = await callAzureFunction('updateFontReward', { userId: userId, font: font })
}
export async function equipBadge (badge: Badge, index: number) {
  const result = await callAzureFunction('equipBadge', { badge, index })
  if (!result || !result.badges) {
    console.log('ERROR: Server did not return badges from an equipBadge call')
    return
  }
  console.log(result.badges)
  for (let i = 0; i < result.badges.length; i++) {
    myDispatch(EquipBadgeAction(result.badges[i], i))
  }
}

export async function checkIsRegistered (): Promise<{registeredUsername: string, spaceIsClosed: boolean, isMod: string, isBanned: boolean}> {
  const result = await callAzureFunction('isRegistered')
  return { registeredUsername: result.registered, spaceIsClosed: result.spaceIsClosed, isMod: result.isMod, isBanned: result.isBanned }
}

export async function pickUpRandomItemFromList (listName: string) {
  await callAzureFunction('pickUpItem', { list: listName })
}

export async function pickUpItem (item: string) {
  await callAzureFunction('pickUpItem', { item })
}

export async function dropItem () {
  await callAzureFunction('pickUpItem', { drop: true })
}

export async function displayMessage (message: string) {
  await callAzureFunction('displayMessage', { message: message })
}

export async function displayMessageFromList (listName: string) {
  await callAzureFunction('displayMessage', { list: listName })
}

export async function orderNewDrink () {
  await callAzureFunction('orderNewDrink')
}

export async function fetchTwilioToken () {
  return await callAzureFunction('twilioToken')
}

export async function fetchCognitiveServicesKey () {
  return await callAzureFunction('cognitiveServicesKey')
}

// Post-it notes

export async function addNoteToWall (message: string) {
  if (message !== null && message.length > 0) {
    const id = uuid()
    await callAzureFunction('addRoomNote', { id, message })
  }
}

export async function deleteRoomNote (noteId: string) {
  await callAzureFunction('deleteRoomNote', { noteId })
}

export async function likeRoomNote (noteId: string) {
  await callAzureFunction('likeRoomNote', { noteId, like: true })
}

export async function unlikeRoomNote (noteId: string) {
  await callAzureFunction('likeRoomNote', { noteId, like: false })
}

//

export async function openOrCloseSpace (spaceIsClosed) {
  await callAzureFunction('openOrCloseSpace', { spaceIsClosed })
}

//

export async function moveToRoom (roomId: string) {
  const result: RoomResponse | ErrorResponse | any = await callAzureFunction(
    'moveRoom',
    {
      to: roomId
    }
  )

  console.log(result)

  if (result) {
    myDispatch(UpdatedCurrentRoomAction(result.roomId, convertServerRoomData(result.roomData)))

    if (result.roomNotes) {
      myDispatch(NoteUpdateRoomAction(result.roomId, result.roomNotes))
    }
  }
}

export async function sendChatMessage (id: string, text: string) {
  // If it's over the character limit
  if (text.length > MESSAGE_MAX_LENGTH) {
    console.log(`Sorry, can't send messages over ${MESSAGE_MAX_LENGTH} characters!`)
    return
  }

  const result: RoomResponse | Error | any = await callAzureFunction(
    'sendChatMessage',
    {
      id: id,
      text: text
    }
  )

  console.log(result)

  // If it's a /move command
  if (result && result.roomId) {
    myDispatch(UpdatedCurrentRoomAction(result.roomId, convertServerRoomData(result.roomData)))
  } else if (result && result.user) {
    myDispatch(ShowProfileAction(result.user))
  } else if (result && result.error) {
    myDispatch(ErrorAction(result.error))
  }
}

export async function sendCaption (id: string, text: string) {
  // TODO: This may or may not be problematic
  if (text.length > MESSAGE_MAX_LENGTH) {
    console.log(`Sorry, can't send messages over ${MESSAGE_MAX_LENGTH} characters!`)
    return
  }

  const result: RoomResponse | Error | any = await callAzureFunction(
    'sendCaption',
    {
      id: id,
      text: text
    }
  )

  console.log(result)

  if (result && result.error) {
    myDispatch(ErrorAction(result.error))
  }
}

export async function fetchProfile (userId: string) {
  const result = await callAzureFunction('fetchProfile', { userId })
  if (result.error) {
    console.log('Could not fetch profile', result.erroc)
  } else {
    myDispatch(ShowProfileAction(result.user))
  }
}

export async function toggleUserBan (userId: string) {
  const result = await callAzureFunction('banUser', { userId })
}

export async function toggleUserMod (userId: string) {
  const result = await callAzureFunction('toggleModStatus', { userId })
}

export async function toggleUserSpeaker (userId: string) {
  const result = await callAzureFunction('toggleSpeakerStatus', { userId })
}

export async function deleteMessage (messageId: string) {
  const result = await callAzureFunction('deleteMessage', { messageId })
}

export async function getRoomIds (): Promise<string[]> {
  const result = await callAzureFunction('getRoomIds')
  if (result.roomIds) {
    return result.roomIds
  }
}

export async function getRoom (roomId: string): Promise<Room> {
  const result = await callAzureFunction('getRoom', { roomId })
  if (result.room) {
    return result.room
  }
}

export async function getAllRooms (): Promise<{[roomId: string]: Room}> {
  const result = await callAzureFunction('getAllRooms')
  if (result.roomData) {
    return result.roomData
  }
}

export async function deleteRoom (roomId: string): Promise<any> {
  return await callAzureFunction('deleteRoom', { roomId })
}

export async function updateRoom (roomId: string, roomData: Room): Promise<any> {
  return await callAzureFunction('updateRoom', { roomId, roomData })
}

// Setup

async function connectSignalR (userId: string, dispatch: Dispatch<Action>) {
  class CustomHttpClient extends SignalR.DefaultHttpClient {
    public async send (request: SignalR.HttpRequest): Promise<SignalR.HttpResponse> {
      const firebaseToken = await firebase.auth().currentUser.getIdToken(false)
      request.headers = {
        ...request.headers,
        userid: firebase.auth().currentUser.uid
      }
      return super.send(request)
    }
  }

  const connection = new SignalR.HubConnectionBuilder()
    .withUrl(`${Config.SERVER_HOSTNAME}/api`, {
      httpClient: new CustomHttpClient(console)
    })
    .configureLogging(SignalR.LogLevel.Debug)
    .build()

  connection.on('playerConnected', (user) => {
    console.log('Player joined!', user)

    dispatch(PlayerConnectedAction(user))
  })

  connection.on('playerDisconnected', (otherId) => {
    console.log('Player left!', otherId)
    dispatch(PlayerDisconnectedAction(otherId))
  })

  connection.on('presenceData', (data) => {
    dispatch(UpdatedPresenceAction(data))
  })

  // We use otherId/name basically interchangably here.
  connection.on('chatMessage', (messageId, otherId, message) => {
    console.log('Received chat', otherId, message)
    console.log(otherId, message, userId)
    if (otherId === userId) return

    dispatch(ChatMessageAction(messageId, otherId, message))
  })

  connection.on('caption', (messageId, otherId, message) => {
    console.log('Received caption', otherId, message)
    console.log(otherId, message, userId)
    if (otherId === userId) return

    dispatch(CaptionMessageAction(messageId, otherId, message))
  })

  connection.on('mods', (otherId, message) => {
    dispatch(ModMessageAction(otherId, message))
  })

  connection.on('deleteMessage', (modId, targetMessageId) => {
    dispatch(DeleteMessageAction(modId, targetMessageId))
  })

  connection.on('playerEntered', (name, fromId, fromName) => {
    if (name === userId) return
    dispatch(PlayerEnteredAction(name, fromId, fromName))
  })

  connection.on('myProfile', (profile) => {
    dispatch(ReceivedMyProfileAction(profile))
  })

  connection.on('serverSettings', (serverSettings) => {
    dispatch(ReceivedServerSettingsAction(serverSettings))
  })

  connection.on('whisper', (otherId, message) => {
    dispatch(WhisperAction(otherId, message))
  })

  connection.on('privateCommand', (message) => {
    dispatch(CommandMessageAction(message))
  })

  connection.on('privateItemPickup', (message) => {
    dispatch(CommandMessageAction(message))
  })

  connection.on('playerLeft', (name, toId, toName) => {
    if (name === userId) return
    dispatch(PlayerLeftAction(name, toId, toName))
  })

  connection.on('usernameMap', (map) => {
    console.log('Received map', map)
    dispatch(UserMapAction(map))
  })

  connection.on('playerBanned', (user) => {
    dispatch(PlayerBannedAction(user))
  })

  connection.on('playerUnbanned', (user) => {
    dispatch(PlayerUnbannedAction(user))
  })

  connection.on('clientDeployed', () => {
    dispatch(ShowModalAction(Modal.ClientDeployed))
  })

  connection.on('shout', (messageId, name, message) => {
    // We don't gate on your own userId here.
    // Because shouting can fail at the server level, we don't show it preemptively.
    dispatch(ShoutAction(messageId, name, message))
  })

  connection.on('emote', (messageId, name, message) => {
    dispatch(EmoteAction(messageId, name, message))
  })

  connection.on('dance', (messageId, name, message) => {
    dispatch(DanceAction(messageId, name, message))
  })

  // Post-It Note Wall
  connection.on('noteAdded', (roomId, noteId, message, authorId) => {
    dispatch(NoteAddAction(roomId, { id: noteId, message, authorId }))
  })

  connection.on('noteRemoved', (roomId, noteId) => {
    dispatch(NoteRemoveAction(roomId, noteId))
  })

  connection.on('noteLikesUpdated', (roomId, noteId, likes) => {
    dispatch(NoteUpdateLikesAction(roomId, noteId, likes))
  })

  connection.on('spaceOpenedOrClosed', (status) => {
    dispatch(SpaceOpenedOrClosedAction(status))
  })

  connection.onclose(() => {
    console.log('disconnected')
    callAzureFunction('disconnect')
  })

  connection.on('ping', () => {
    console.log('Received heartbeat ping')
    callAzureFunction('pong')
  })

  connection.on('unlockBadge', (badge) => {
    if (badge.length !== 1) {
      console.log('ERROR: Expected one badge to unlock, got multiple:', badge)
    }
    dispatch(UnlockBadgeAction(badge[0]))
  })

  window.addEventListener('beforeunload', (e) => {
    callAzureFunction('disconnect')
  })

  console.log('connecting...')
  return await connection
    .start()
    .then(() => {
      console.log('Connected!')
    })
    .catch(console.error)
}

async function callAzureFunctionGet (endpoint: string): Promise<any> {
  try {
    const firebaseToken = await firebase.auth().currentUser.getIdToken(false)
    const r = await axios.get(
      `${Config.SERVER_HOSTNAME}/api/${endpoint}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${firebaseToken}`
        }
      }
    )
    console.log(r)
    return r.data
  } catch (e) {
    console.log('Error', e)
    return undefined
  }
}

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
    console.log(r)
    return r.data
  } catch (e) {
    console.log('Error', e)
    return undefined
  }
}
