import Config from './config'

export const nie = <T extends unknown>(_: T): void => {
  throw Error('Not Implemented')
}

/**
 * converts a frame count per second to the number of milliseconds per frame,
 * returns 0 if you pass in a frame count less than or equal to 0 (negative or
 * zero fps doesn't make any sense)
 *
 * n.b. `1e3` is just kind of a "neat" way to write "one thousand" ... if it
 * feels "too clever" feel free to rewrite it as `1_000` or just `1000` (though
 * I do like the numeric separators if we're going for absolute clarity)
 *
 * @param frames the number of frames per second
 * @returns the number of milliseconds per frame
 */
export const fps = (frames: number) => frames <= 0 ? 0 : 1e3 / frames
