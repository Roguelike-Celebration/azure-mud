// Miscellaneous shared utility functions and classes

/** Get a new random UUID in the manner that this codebase does that. */
export function uuid (): string {
  return crypto.randomUUID()
}

/** Filter to the non-undefined elements of an array. */
export function defineds<T> (arr: (T | undefined)[]): T[] {
  return arr.filter(x => x !== undefined)
}
