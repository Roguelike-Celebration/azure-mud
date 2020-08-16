import * as SignalR from '@aspnet/signalr'
import { v4 as uuid } from 'uuid'

import { RoomResponse, ErrorResponse } from '../server/src/types'
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
  ShowProfileActionForFetchedUser,
  UserMapAction,
  ModMessageAction,
  LocalMediaDeviceListReceivedAction,
  UpdatedCurrentRoomAction,
  UpdatedRoomDataAction,
  UpdatedPresenceAction,
  ReceivedMyProfileAction,
  DeleteMessageAction,
  NoteAddAction,
  NoteRemoveAction,
  NoteUpdateRoomAction,
  NoteUpdateLikesAction
} from './Actions'
import { User } from '../server/src/user'
import { startSignaling, receiveSignalData, getMediaStream } from './webRTC'
import Config from './config'
import { convertServerRoomData } from './room'
const axios = require('axios').default

let myUserId: string
let myDispatch: Dispatch<Action>

let inMediaChat: boolean = false

export async function connect (userId: string, dispatch: Dispatch<Action>) {
  myUserId = userId
  myDispatch = dispatch

  const result: RoomResponse = await callAzureFunction('connect')

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

export async function updateProfile (user: Partial<User>) {
  const result = await callAzureFunction('updateProfile', { user })
  if (result.valid) {
    // TODO: I'm not sure this does what we want.
    // Need to test this on the new user flow.
    window.location.reload()
  }
}

export async function checkIsRegistered (): Promise<boolean> {
  const result = await callAzureFunction('isRegistered')
  return result.registered
}

// Post-it notes

export async function addNoteToWall (message: string) {
  const id = uuid()
  await callAzureFunction('addRoomNote', { id, message })
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

export async function moveToRoom (roomId: string) {
  const result: RoomResponse | ErrorResponse | any = await callAzureFunction(
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
  const result: RoomResponse | Error | any = await callAzureFunction(
    'sendChatMessage',
    {
      id: id,
      text: text
    }
  )

  console.log(result)

  // If it's a /move command
  if (result && result.roomId && result.roomOccupants) {
    myDispatch(UpdatedCurrentRoomAction(result.roomId))
  } else if (result && result.user) {
    myDispatch(ShowProfileActionForFetchedUser(result.user))
  } else if (result && result.error) {
    myDispatch(ErrorAction(result.error))
  }
}

export async function fetchProfile (userId: string): Promise<User | undefined> {
  const result = await callAzureFunction('fetchProfile', { userId })
  if (result.error) {
    console.log('Could not fetch profile', result.erroc)
  } else {
    return result.user
  }
}

export async function toggleUserBan (userId: string) {
  const result = await callAzureFunction('banUser', { userId })
}

export async function deleteMessage (messageId: string) {
  const result = await callAzureFunction('deleteMessage', { messageId })
}

// WebRTC
// A note: the WebRTC handshake process generally avoids the Flux store / reducer
// The app store is only aware of actual video streams it has to present.

// This loads a local webcam view
// We show a "here's what you look like, select your input devices, toggle audio/video" before you connect
// We need to grab a local feed first so we can get pretty names for the list of inputs.
export async function prepareToStartVideoChat () {
  // The act of fetching the local media stream triggers a local view of your webcam
  await getMediaStream(myDispatch)
  const devices = await navigator.mediaDevices.enumerateDevices()
  myDispatch(LocalMediaDeviceListReceivedAction(devices))
}

// This kicks off the whole peering process.
// Any connected WebRTC clients will start signaling, which happens over SignalR.
export async function startVideoChat () {
  inMediaChat = true
  callAzureFunction('broadcastPeerId')
}

export async function sendSignalData (peerId: string, data: string) {
  return await callAzureFunction('sendSignalData', { peerId, data })
}

export function setNetworkMediaChatStatus (isInMediaChat: boolean) {
  inMediaChat = isInMediaChat
}

export function getNetworkMediaChatStatus (): boolean {
  return inMediaChat
}

// Setup

async function connectSignalR (userId: string, dispatch: Dispatch<Action>) {
  const connection = new SignalR.HubConnectionBuilder()
    .withUrl(`${Config.SERVER_HOSTNAME}/api`)
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

  connection.on('mods', (otherId, message) => {
    dispatch(ModMessageAction(otherId, message))
  })

  connection.on('deleteMessage', (modId, targetMessageId) => {
    dispatch(DeleteMessageAction(modId, targetMessageId))
  })

  connection.on('playerEntered', (name, from) => {
    if (name === userId) return
    dispatch(PlayerEnteredAction(name, from))
  })

  connection.on('myProfile', (profile) => {
    dispatch(ReceivedMyProfileAction(profile))
  })

  connection.on('whisper', (otherId, message) => {
    dispatch(WhisperAction(otherId, message))
  })

  connection.on('playerLeft', (name, to) => {
    if (name === userId) return
    dispatch(PlayerLeftAction(name, to))
  })

  connection.on('usernameMap', (map) => {
    console.log('Received map', map)
    dispatch(UserMapAction(map))
  })

  connection.on('shout', (messageId, name, message) => {
    // We don't gate on your own userId here.
    // Because shouting can fail at the server level, we don't show it preemptively.
    dispatch(ShoutAction(messageId, name, message))
  })

  connection.on('emote', (messageId, name, message) => {
    dispatch(EmoteAction(messageId, name, message))
  })

  connection.on('webrtcSignalData', (peerId, data) => {
    console.log('Received signaling data from', peerId)
    receiveSignalData(peerId, data, dispatch)
  })

  connection.on('webrtcPeerId', (peerId) => {
    if (peerId === userId) return
    if (!inMediaChat) return
    console.log('Starting signaling with', peerId)
    startSignaling(peerId, dispatch)
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

  connection.onclose(() => {
    console.log('disconnected')
    callAzureFunction('disconnect')
  })

  connection.on('ping', () => {
    console.log('Received heartbeat ping')
    callAzureFunction('pong')
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

async function callAzureFunction (endpoint: string, body?: any): Promise<any> {
  try {
    const r = await axios.post(
      `${Config.SERVER_HOSTNAME}/api/${endpoint}`,
      body,
      { withCredentials: true }
    )
    console.log(r)
    return r.data
  } catch (e) {
    console.log('Error', e)
    return undefined
  }
}

export async function getLoginInfo () {
  try {
    console.log('Fetching')
    const r = await axios.post(`${Config.SERVER_HOSTNAME}/.auth/me`, null, {
      withCredentials: true
    })
    console.log(r)
    return r.data[0]
  } catch (e) {
    console.log(e)
    return undefined
  }
}
