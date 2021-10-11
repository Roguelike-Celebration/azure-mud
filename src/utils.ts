import Config from './config'

export const nie = <T extends unknown>(_: T): void => {
  throw Error('Not Implemented')
}
