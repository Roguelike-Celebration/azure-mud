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
  ShowModalAction, CommandMessageAction, CaptionMessageAction
} from './Actions'
import { User } from '../server/src/user'
import { convertServerRoomData } from './room'
import { MESSAGE_MAX_LENGTH } from '../server/src/config'
import { Modal } from './modals'
import Config from './config'
import firebase from 'firebase/app'
import 'firebase/auth'
const axios = require('axios').default

let myUserId: string
let myDispatch: Dispatch<Action>

// const callFn = callAzureFunction
const callFn: (message: string, body?: any) => Promise<any> = sendWebsocketMessage

const inMediaChat: boolean = false

export async function sendWebsocketMessage (message: string, body?: any) {
  console.log(message, body)
}

export async function connect (userId: string, dispatch: Dispatch<Action>) {
  myUserId = userId
  myDispatch = dispatch

  const result: RoomResponse = await callFn('connect')

  console.log(result)
  dispatch(UpdatedCurrentRoomAction(result.roomId))
  dispatch(UserMapAction(result.users))

  if (result.roomData) {
    dispatch(UpdatedRoomDataAction(convertServerRoomData(result.roomData)))
  }

  if (result.profile) {
    dispatch(ReceivedMyProfileAction(result.profile))
  }

  if (result.roomNotes) {
    dispatch(NoteUpdateRoomAction(result.roomId, result.roomNotes))
  }

  dispatch(UpdatedPresenceAction(result.presenceData))

  connectSignalR(userId, dispatch)
}

export async function disconnect (userId: string) {
  const result = await callFn('disconnect')
}

export async function getServerSettings (dispatch: Dispatch<Action>) {
  const result: ServerSettings = await callFn('serverSettings', { method: 'get' })
  dispatch(ReceivedServerSettingsAction(result))
}

export async function updateServerSettings (serverSettings: ServerSettings) {
  const result = await callFn('serverSettings', serverSettings)
  if (result) {
    myDispatch(HideModalAction())
  }
}

// If isNewUser is true, a successful update will refresh the entire page instead of dismissing a modal
export async function updateProfile (user: Partial<User>, isNew: boolean) {
  const result = await callFn('updateProfile', { user, isNew })
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
  const result = await callFn('updateProfileColor', { userId: userId, color: color })
}

export async function updateFontReward (userId: string, font: string) {
  const result = await callFn('updateFontReward', { userId: userId, font: font })
}

export async function checkIsRegistered (): Promise<{registeredUsername: string, spaceIsClosed: boolean, isMod: string, isBanned: boolean}> {
  const result = await callFn('isRegistered')
  return { registeredUsername: result.registered, spaceIsClosed: result.spaceIsClosed, isMod: result.isMod, isBanned: result.isBanned }
}

export async function pickUpRandomItemFromList (listName: string) {
  await callFn('pickUpItem', { list: listName })
}

export async function pickUpItem (item: string) {
  await callFn('pickUpItem', { item })
}

export async function dropItem () {
  await callFn('pickUpItem', { drop: true })
}

export async function displayMessage (message: string) {
  await callFn('displayMessage', { message: message })
}

export async function displayMessageFromList (listName: string) {
  await callFn('displayMessage', { list: listName })
}

export async function fetchTwilioToken () {
  return await callFn('twilioToken')
}

export async function fetchCognitiveServicesKey () {
  return await callFn('cognitiveServicesKey')
}

// Post-it notes

export async function addNoteToWall (message: string) {
  if (message !== null && message.length > 0) {
    const id = uuid()
    await callFn('addRoomNote', { id, message })
  }
}

export async function deleteRoomNote (noteId: string) {
  await callFn('deleteRoomNote', { noteId })
}

export async function likeRoomNote (noteId: string) {
  await callFn('likeRoomNote', { noteId, like: true })
}

export async function unlikeRoomNote (noteId: string) {
  await callFn('likeRoomNote', { noteId, like: false })
}

//

export async function openOrCloseSpace (spaceIsClosed) {
  await callFn('openOrCloseSpace', { spaceIsClosed })
}

//

export async function moveToRoom (roomId: string) {
  const result: RoomResponse | ErrorResponse | any = await callFn(
    'moveRoom',
    {
      to: roomId
    }
  )

  console.log(result)

  if (result.error) {
    myDispatch(ErrorAction(result.error))
  } else {
    myDispatch(UpdatedCurrentRoomAction(result.roomId))

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

  const result: RoomResponse | Error | any = await callFn(
    'sendChatMessage',
    {
      id: id,
      text: text
    }
  )

  console.log(result)

  // If it's a /move command
  if (result && result.roomId) {
    myDispatch(UpdatedCurrentRoomAction(result.roomId))
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

  const result: RoomResponse | Error | any = await callFn(
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
  const result = await callFn('fetchProfile', { userId })
  if (result.error) {
    console.log('Could not fetch profile', result.erroc)
  } else {
    myDispatch(ShowProfileAction(result.user))
  }
}

export async function toggleUserBan (userId: string) {
  const result = await callFn('banUser', { userId })
}

export async function toggleUserMod (userId: string) {
  const result = await callFn('toggleModStatus', { userId })
}

export async function deleteMessage (messageId: string) {
  const result = await callFn('deleteMessage', { messageId })
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
    callFn('disconnect')
  })

  connection.on('ping', () => {
    console.log('Received heartbeat ping')
    callFn('pong')
  })

  window.addEventListener('beforeunload', (e) => {
    callFn('disconnect')
  })

  console.log('connecting...')
  return await connection
    .start()
    .then(() => {
      console.log('Connected!')
    })
    .catch(console.error)
}

async function callAzureFunction (endpoint: string, body?: any): Promise<any> {
  try {
    // By default we want to POST.
    // Someone can pass in { method: 'get'} into the body to force a GET request (or similar)
    // TO NOTE: This will fail in funny ways if your body actually has a "method" param
    const method = (body && body.method ? body.method : 'post')
    if (body) {
      delete body.method
    }

    const firebaseToken = await firebase.auth().currentUser.getIdToken(false)
    const r = await axios[method](
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
