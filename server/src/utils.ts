// Miscellaneous shared utility functions and classes

/** Get a new random UUID in the manner that this codebase does that.
 */
export function uuid (): string {
  return crypto.randomUUID()
}
