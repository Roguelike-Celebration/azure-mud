import type { Opts } from 'linkifyjs'

/** Linkify options we use in the MUD. */
export const linkifyOpts: Opts = {
  target: '_blank',
  rel: 'noopener noreferrer',
  // Links inside <a> and <button> elements are invalid HTML
  ignoreTags: ['a', 'button']
}
