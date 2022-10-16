import Config from './config'

export const nie = <T extends unknown>(_: T): void => {
  throw Error('Not Implemented')
}

/**
 * converts a frame count per second to the number of milliseconds per frame,
 * returns 0 if you pass in a frame count less than or equal to 0 (negative or
 * zero fps doesn't make any sense)
 *
 * @param frames the number of frames per second
 * @returns the number of milliseconds per frame
 */
export const fps = (frames: number) => frames <= 0 ? 0 : 1e3 / frames
