/* Azure Functions endpoint Function definitions.
 *
 * Registers all the our Functions programmatically, using the Functions v4 programming model.
 * This is the "main" entry point pointed to by package.json.
 */

import { app, HttpMethod } from '@azure/functions'

import { AuthenticationOptions, getUserIdFromHeaders } from './authenticate.js'
import { authenticatedAzureWrap, azureWrap, readJsonBody } from './azureWrap.js'
import { auditLogOutput, pubSubConnectionInput, signalRConnectionInput, webPubSubOutput } from './bindings.js'
import { DB } from './database.js'
import { AuthenticatedEndpointFunction } from './endpoint.js'
import banUser from './endpoints/banUser.js'
import clientDeployedWebhook from './endpoints/clientDeployedWebhook.js'
import connect from './endpoints/connect.js'
import deleteMessage from './endpoints/deleteMessage.js'
import deleteRoom from './endpoints/deleteRoom.js'
import disconnect from './endpoints/disconnect.js'
import displayMessage from './endpoints/displayMessage.js'
import equipBadgeFunction from './endpoints/equipBadge.js'
import fetchProfile from './endpoints/fetchProfile.js'
import getAllRooms from './endpoints/getAllRooms.js'
import getRoom from './endpoints/getRoom.js'
import getRoomIds from './endpoints/getRoomIds.js'
import heartbeat from './endpoints/heartbeat.js'
import isRegistered from './endpoints/isRegistered.js'
import moveAllUsersToEntryway from './endpoints/moveAllUsersToEntryway.js'
import moveRoom from './endpoints/moveRoom.js'
import addObeliskNote from './endpoints/obelisk/addObeliskNote.js'
import deleteObeliskNote from './endpoints/obelisk/deleteObeliskNote.js'
import likeObeliskNote from './endpoints/obelisk/likeObeliskNote.js'
import startObservingObelisk from './endpoints/obelisk/startObservingObelisk.js'
import stopObservingObelisk from './endpoints/obelisk/stopObservingObelisk.js'
import openOrCloseSpace from './endpoints/openOrCloseSpace.js'
import orderNewDrink from './endpoints/orderNewDrink.js'
import pickUpItem from './endpoints/pickUpItem.js'
import pong from './endpoints/pong.js'
import resetBadgeData from './endpoints/resetBadgeData.js'
import resetRoomData from './endpoints/resetRoomData.js'
import addRoomNote from './endpoints/roomNote/addRoomNote.js'
import deleteRoomNote from './endpoints/roomNote/deleteRoomNote.js'
import likeRoomNote from './endpoints/roomNote/likeRoomNote.js'
import sendChatMessage from './endpoints/sendChatMessage.js'
import { getServerSettings, postServerSettings } from './endpoints/serverSettings.js'
import toggleModStatus from './endpoints/toggleModStatus.js'
import toggleSpeakerStatus from './endpoints/toggleSpeakerStatus.js'
import updateFontReward from './endpoints/updateFontReward.js'
import updateProfile from './endpoints/updateProfile.js'
import updateProfileColor from './endpoints/updateProfileColor.js'
import updateRoom from './endpoints/updateRoom.js'

const DEFAULT_METHODS: HttpMethod[] = ['GET', 'POST']
const DEFAULT_AUTH: AuthenticationOptions = { audit: true, mod: false }

/** Our typical endpoint function, using authenticatedAzureWrap() and no special handling. */
interface NormalEndpoint {
  name: string
  fn: AuthenticatedEndpointFunction
  auth?: AuthenticationOptions
  /** Allowed methods. Defaults to ['GET', 'POST'] if absent. */
  methods?: HttpMethod[]
  /** Register Web PubSub output for this endpoint? Defaults to true. */
  webPubSub?: boolean
  /** Register audit-log table output for this endpoint? See authenticate(). */
  auditLog?: boolean
}

function registerNormalEndpoints (): void {
  for (const e of NORMAL_ENDPOINTS) {
    const auth = { ...DEFAULT_AUTH, ...e.auth }
    if (auth.audit && !e.auditLog) {
      throw new Error(`${e.name}: BUG in endpoint definition: auth.audit=true requires auditLog=true ` +
        'but it is false (authenticate() would return 501)')
    }
    app.http(e.name, {
      methods: e.methods ?? DEFAULT_METHODS,
      authLevel: 'anonymous',
      extraOutputs: [
        ...((e.webPubSub ?? true) ? [webPubSubOutput] : []),
        ...(e.auditLog ? [auditLogOutput] : [])
      ],
      handler: (req, context) => authenticatedAzureWrap(context, req, e.fn, auth)
    })
  }
}

const NORMAL_ENDPOINTS: NormalEndpoint[] = [
  { name: 'addObeliskNote', fn: addObeliskNote, auditLog: true },
  { name: 'addRoomNote', fn: addRoomNote, auditLog: true },
  { name: 'banUser', fn: banUser, auth: { mod: true }, auditLog: true },
  { name: 'connect', fn: connect, auditLog: true },
  { name: 'deleteMessage', fn: deleteMessage, auth: { mod: true }, methods: ['POST'], auditLog: true },
  { name: 'deleteObeliskNote', fn: deleteObeliskNote, auditLog: true },
  { name: 'deleteRoom', fn: deleteRoom, auth: { audit: false, mod: true }, webPubSub: false },
  { name: 'deleteRoomNote', fn: deleteRoomNote, auditLog: true },
  { name: 'disconnect', fn: disconnect, auditLog: true },
  { name: 'displayMessage', fn: displayMessage, auth: { audit: false } },
  { name: 'equipBadge', fn: equipBadgeFunction, auditLog: true },
  { name: 'getAllRooms', fn: getAllRooms, auth: { audit: false, mod: true }, webPubSub: false },
  { name: 'getRoom', fn: getRoom, auth: { audit: false, mod: true }, webPubSub: false },
  { name: 'getRoomIds', fn: getRoomIds, auth: { audit: false, mod: true }, webPubSub: false },
  { name: 'likeObeliskNote', fn: likeObeliskNote, auth: { audit: false } },
  { name: 'likeRoomNote', fn: likeRoomNote, auth: { audit: false } },
  { name: 'moveAllUsersToEntryway', fn: moveAllUsersToEntryway, auth: { audit: false }, methods: ['POST'], auditLog: true },
  { name: 'moveRoom', fn: moveRoom, auth: { audit: false }, auditLog: true },
  { name: 'openOrCloseSpace', fn: openOrCloseSpace, auth: { mod: true }, auditLog: true },
  { name: 'orderNewDrink', fn: orderNewDrink, auditLog: true },
  { name: 'pickUpItem', fn: pickUpItem, auth: { audit: false } },
  { name: 'pong', fn: pong, auth: { audit: false }, webPubSub: false },
  { name: 'resetBadgeData', fn: resetBadgeData, auth: { audit: false, mod: true } },
  { name: 'resetRoomData', fn: resetRoomData, auth: { audit: false, mod: true }, webPubSub: false },
  { name: 'sendChatMessage', fn: sendChatMessage, auditLog: true },
  { name: 'startObservingObelisk', fn: startObservingObelisk, auth: { audit: false }, auditLog: true },
  { name: 'stopObservingObelisk', fn: stopObservingObelisk, auth: { audit: false }, auditLog: true },
  { name: 'toggleModStatus', fn: toggleModStatus, auth: { mod: true }, auditLog: true },
  { name: 'toggleSpeakerStatus', fn: toggleSpeakerStatus, auth: { mod: true }, auditLog: true },
  { name: 'updateFontReward', fn: updateFontReward, methods: ['POST'], auditLog: true },
  { name: 'updateProfileColor', fn: updateProfileColor, methods: ['POST'], auditLog: true },
  { name: 'updateRoom', fn: updateRoom, auth: { audit: false, mod: true }, webPubSub: false }
]

/** Endpoints with special cases like trigger, bindings, handlers, or other logic. */
function registerSpecialEndpoints (): void {
  app.timer('heartbeat', {
    schedule: '0 * * * * *',
    extraOutputs: [webPubSubOutput],
    handler: async (timer, context) => {
      await azureWrap(context, undefined, heartbeat)
    }
  })

  app.http('clientDeployedWebhook', {
    methods: ['POST'],
    authLevel: 'anonymous',
    extraOutputs: [webPubSubOutput],
    handler: (req, context) => azureWrap(context, req, clientDeployedWebhook)
  })

  app.http('fetchProfile', {
    authLevel: 'anonymous',
    handler: (req, context) => azureWrap(context, req, fetchProfile)
  })

  app.http('isRegistered', {
    authLevel: 'anonymous',
    handler: async (req, context) => {
      const userId = await getUserIdFromHeaders(context, req)
      return await azureWrap(context, req, isRegistered, { userId })
    }
  })

  app.http('negotiate', {
    methods: ['POST'],
    authLevel: 'anonymous',
    extraInputs: [signalRConnectionInput],
    handler: async (req, context) => ({ jsonBody: context.extraInputs.get(signalRConnectionInput) })
  })

  app.http('negotiatePubSub', {
    authLevel: 'anonymous',
    extraInputs: [pubSubConnectionInput],
    handler: async (req, context) => ({ jsonBody: context.extraInputs.get(pubSubConnectionInput) })
  })

  app.http('serverSettings', {
    authLevel: 'anonymous',
    extraOutputs: [webPubSubOutput, auditLogOutput],
    handler: (req, context) => req.method === 'POST'
      ? authenticatedAzureWrap(context, req, postServerSettings, { mod: true })
      : azureWrap(context, req, getServerSettings)
  })

  app.http('startPonderingOrbs', {
    methods: ['GET'],
    authLevel: 'anonymous',
    extraInputs: [pubSubConnectionInput],
    extraOutputs: [webPubSubOutput],
    handler: async (req, context) => {
      const userId = req.headers.get('userId')
      context.log(`pondering orbs: userId ${userId}`)
      if (userId !== process.env.ORB_PONDER_USER) {
        context.log(`invalid orb ponderer: you shall not pass!!! userId ${userId}`)
        return { status: 401, body: 'Unauthorized' }
      }
      context.log(`valid orb ponderer: userId ${userId}`)
      return { jsonBody: context.extraInputs.get(pubSubConnectionInput) }
    }
  })

  app.http('updateProfile', {
    authLevel: 'anonymous',
    extraOutputs: [webPubSubOutput, auditLogOutput],
    handler: async (req, context) => {
      const userId = await getUserIdFromHeaders(context, req)
      // grab copy of body for audit log because azureWrap consumes it
      const reqBody = await readJsonBody(req.clone())

      const response = await azureWrap(context, req, updateProfile, { userId })

      // We don't yet have an abstraction to do custom audit logs within our wrapped Azure functions
      // Adding a lil bit of business logic here is a quick fix for now.
      if (userId) {
        const username = (await DB.getUser(userId) || {}).username

        // Special case audit log entry - see authenticate(...) for general case audit
        context.extraOutputs.set(auditLogOutput, [{
          PartitionKey: userId,
          RowKey: Date.now().toString(),
          userId,
          username,
          endpoint: req.url.replace('https://' + process.env.WEBSITE_HOSTNAME, ''),
          request: reqBody
        }])
      }
      return response
    }
  }
  )
}

function registerAllEndpoints (): void {
  registerNormalEndpoints()
  registerSpecialEndpoints()
}

// ========== Main module on-import code ==========
//
// Need to call the functions down here, only after all the const assignments have been done.

registerAllEndpoints()
