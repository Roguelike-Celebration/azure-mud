/* Miscellaneous shared display-related code and settings. */

import Config from './config.js'

/** Id for the one main tooltip we add. Elements that want to use this tooltip
 * put 'data-tooltip-id=MUD_TOOLTIP_ID' in their attrs. */
export const MUD_TOOLTIP_ID = 'mud-tooltip'

/** z-index for our tooltips, so they sit above everything else, including modals
 * (#modal-wrapper in style/modal.css is 100000) and the admin app's Ace editor. */
export const MUD_TOOLTIP_Z_INDEX = 100001

// Needed because eslint explicit-module-boundary-types requires explicit interface types
/** Data attrs to put on an element to attach our tooltip to it. */
export interface TooltipAttrs {
  'data-tooltip-id': string
  /** In react-tooltip v5+, an empty string '' is rendered; use undefined to suppress
   * the tooltip. */
  'data-tooltip-content': string | undefined
}

/** Get tooltip data attrs for using our tooltip with a given text.
 *  Falsy text suppresses the tooltip. */
export function tooltipAttrs (content: string | false | null | undefined): TooltipAttrs {
  return {
    'data-tooltip-id': MUD_TOOLTIP_ID,
    'data-tooltip-content': content || undefined
  }
}

// Page titles

/**
 * Add a tag with the backend's name to the page title, so non-prod tabs are easy to tell
 * apart. Prod gets no tag, so players see the plain title.
 */
export function addBackendTagToTitle (): void {
  const tag = backendTitleTag()
  if (tag === undefined) {
    return
  }
  const suffix = ` (${tag})`
  // Parcel's hot reload can rerun this, so don't tag twice
  if (!document.title.endsWith(suffix)) {
    document.title += suffix
  }
}

/** Tag for the page title saying which backend this is; undefined for prod. */
function backendTitleTag (): string | undefined {
  // TODO: This is a prototype with hardcoded names. Replace with real instance config later.
  const baseName = backendHostBaseName()
  if (baseName === undefined) {
    return 'unknown backend'
  }
  const special = SPECIAL_BACKEND_HOST_NAMES.get(baseName)
  return special === 'prod' ? undefined : special ?? baseName
}

// Hardcoded known host names as of 2022-2026. Need to update this if we change our deployment.
// This hardcoding is just a hack to get a prototype of tagging going. Real support probably
// means an explicit instance name in config items, not the source code.
const SPECIAL_BACKEND_HOST_NAMES = new Map([
  ['roguelikecelebration2021', 'prod'],
  ['roguelike-staging', 'staging']
])

/** The backend's unqualified hostname, from config. Undefined if SERVER_HOSTNAME isn't a
 * valid URL. */
export function backendHostBaseName (): string | undefined {
  try {
    return new URL(Config.SERVER_HOSTNAME ?? '').hostname.split('.')[0]
  } catch {
    return undefined
  }
}
