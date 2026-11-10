/*
 * Rendering of room description markup, like "[[text->target]]" links, into HTML.
 * Shared by the main app's RoomView and the admin app's room preview.
 */

import _ from 'lodash'

import allowedItems from '../server/src/allowedItems.js'

import { MUD_TOOLTIP_ID } from './display.js'
import { linkActions } from './linkActions.js'
// Type-only, so the admin app doesn't load the main app's reducer and its Firebase init
import type { PresenceCountMap, RoomDataMap } from './reducer.js'
import type { Room } from './room.js'

/** Default note-wall description text for rooms with note walls and no custom description. */
export const defaultRoomWallDescription = 'One of the walls has space for attendees to put up sticky notes.'

/**
 * Parse a room description and render it as HTML.
 *
 * Takes a room's description (its `description` field) and renders it as HTML for use in
 * room view.
 *
 * This supports both the main app's regular RoomView and the admin app's RoomPreview.
 *
 * @param room The room whose description to render. Its description text uses MUD link
 *   markup. Link checking also uses the room's other fields, e.g. its specialFeatureText
 *   for showModal links.
 * @param roomData Full room data to parse & render in the context of. Currently used only
 *   for link checking, but may be used for other things in the future, so it is required
 *   even when not checking links.
 * @param presenceData User presence data for incorporation in room links. May be an empty
 *   {} object to omit presence data - rooms absent from presenceData do not result in
 *   an error.
 * @param options Options for rendering. If checkLinks is true, links are checked and styled
 *   to indicate their resolution.
 *
 * @returns An HTML fragment as a string. The fragment will be suitable for use as the
 *   inner HTML content of a `<div>` as used in room views, *if* the input text was
 *   similarly valid HTML + MUD markup.
 */
export function parseDescription (
  room: Room,
  roomData: RoomDataMap,
  presenceData: PresenceCountMap,
  options: {
    /** Check links and give them tooltips & styling indicating their resolution. */
    checkLinks?: boolean
  } = {}
): string {
  // This code used to get room = roomData[roomId], but now that room data is JIT (in
  // the main app), it is normal for that to be absent. The links don't actually use data
  // from roomData, except for link checking (only done in the preview), so that is now
  // skipped in the normal case. But we're keeping it for use in the future to ensure the
  // code design still supports using other room data here, so it is still required.

  let description = room.description

  // Complex "[[text->target]]" links
  description = description.replace(COMPLEX_LINK_REGEX, (match: string, text: string, roomId: string) => {
    const userCount = presenceData[roomId]
    const textEsc = _.escape(text)
    const roomIdEsc = _.escape(roomId)
    const attrs = options.checkLinks
      ? checkedLinkAttrs(roomId, describeComplexLink(text, roomId, room, roomData))
      : "class='room-link'"
    if (roomId === 'item') {
      return `<a ${attrs} href='#' data-item='${textEsc}'>${textEsc}</a>`
    } else if (roomId === 'showModal') {
      return `<a ${attrs} href='#' data-modal='${roomId}'>${textEsc}</a>`
    } else if (linkActions[roomId]) {
      return `<a ${attrs} href='#' data-action='${roomId}'>${textEsc}</a>`
    } else {
      // With room data being JIT, it's now expected that roomData[roomId] might be empty,
      // even for valid rooms. So, assume that any roomId that isn't a match for some other
      // sort of link target is indeed a room ID.
      const userCountString = userCount > 0 ? ` (${userCount})` : ''
      return `<a ${attrs} href='#' data-room='${roomIdEsc}'>${textEsc}${userCountString}</a>`
    }
  })

  // Simple "[[roomId]]" links
  // TODO: Escape roomId here, but be careful about doing it! Some of our links currently (2026)
  // might only work due to accidents of the truncation of unescaped room long-names matching the roomId.
  description = description.replace(SIMPLE_LINK_REGEX, (match: string, roomId: string) => {
    const userCount = presenceData[roomId]
    const userCountString = userCount > 0 ? ` (${userCount})` : ''
    const attrs = options.checkLinks
      ? checkedLinkAttrs(roomId, describeSimpleRoomLink(roomId, roomData))
      : "class='room-link'"
    return `<a ${attrs} href='#' data-room='${roomId}'>${roomId}${userCountString}</a>`
  })

  return description
}

// Complex links are handled first, so these only find simple links in what's left
const COMPLEX_LINK_REGEX = /\[\[([^\]]*?)->([^\]]*?)\]\]/g
const SIMPLE_LINK_REGEX = /\[\[(.+?)\]\]/g

/**
 * Attributes for a checked link. Adds a tooltip with the link's target as written, plus
 * where it resolves to or a broken-link indication styling.
 */
function checkedLinkAttrs (target: string, resolution: string | undefined): string {
  const brokenReason = target === 'showModal'
    ? 'this room has no specialFeatureText to show'
    : 'no room, item, or action by that name'
  const [className, result] = resolution === undefined
    ? ['room-link broken-link', `broken link: ${brokenReason}`]
    : ['room-link', resolution]
  return `class='${className}' data-tooltip-id='${MUD_TOOLTIP_ID}' ` +
    `data-tooltip-content='${_.escape(`->${target}\n${result}`)}'`
}

/** The markup of the broken links in a room's description. */
export function findBrokenLinks (room: Room, roomData: RoomDataMap): string[] {
  const broken: string[] = []
  const rest = room.description.replace(COMPLEX_LINK_REGEX, (match: string, text: string, target: string) => {
    if (describeComplexLink(text, target, room, roomData) === undefined) {
      broken.push(match)
    }
    return ''
  })
  rest.replace(SIMPLE_LINK_REGEX, (match: string, target: string) => {
    if (describeSimpleRoomLink(target, roomData) === undefined) {
      broken.push(match)
    }
    return ''
  })
  return broken
}

/**
 * What a "[[text->target]]" link goes to, as display text like "item: Tap Water", checking
 * targets in parseDescription's order. Undefined if it doesn't go anywhere. `room` is the
 * room whose description the link is in.
 */
function describeComplexLink (
  text: string, target: string, room: Room, rooms: RoomDataMap
): string | undefined {
  if (target === 'item') {
    // Case-insensitive, like the server's pickUpItem
    const item = allowedItems.find((it) => it.toUpperCase() === text.toUpperCase())
    return item === undefined ? undefined : `item: ${item}`
  }
  if (target === 'showModal') {
    // The main app shows nothing for this link if the room has no specialFeatureText
    const featureTxt = room.specialFeatureText
    return featureTxt ? `special feature (modal)\n"${featureTxt}"` : undefined
  }
  if (hasOwnProp(linkActions, target)) {
    return `action: ${target}`
  }
  return describeSimpleRoomLink(target, rooms)
}

/**
 * Which room a room link goes to, as display text like "room: theater". Resolved the way the
 * server's moveToRoom does: by exact room ID, or else by a fuzzy match on a room's id,
 * shortName, or displayName. Undefined if no room matches. Unlike the server, this doesn't
 * fall back to matching the link text of the current room.
 */
function describeSimpleRoomLink (target: string, rooms: RoomDataMap): string | undefined {
  if (hasOwnProp(rooms, target)) {
    return `room: ${target}`
  }
  const key = fuzzyRoomKey(target)
  const matches = Object.keys(rooms).filter((roomId) => {
    const room = rooms[roomId]
    return [room.id, room.shortName, room.displayName].some((name) =>
      typeof name === 'string' && fuzzyRoomKey(name) === key)
  })
  if (matches.length > 1) {
    // The server keeps one room per fuzzy key: whichever was saved last
    return `room, by name: ambiguous, one of: ${matches.join(', ')}`
  }
  return matches.length === 1 ? `room, by name: ${matches[0]}` : undefined
}

/** The server's normalized room name for fuzzy lookups. See setRoomData in server/src/redis.ts. */
function fuzzyRoomKey (name: string): string {
  // A string pattern replaces only the first space. That's what the server does too.
  return name.replace(' ', '').toUpperCase()
}

function hasOwnProp (obj: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
