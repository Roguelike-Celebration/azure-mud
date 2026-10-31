/* Miscellaneous shared display-related code and settings. */

/** Id for the one main tooltip we add. Elements that want to use this tooltip
 * put 'data-tooltip-id=MUD_TOOLTIP_ID' in their attrs. */
export const MUD_TOOLTIP_ID = 'mud-tooltip'

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
