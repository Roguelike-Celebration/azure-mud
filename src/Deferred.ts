/**
 * based loosely on the following:
 *
 * @see https://stackoverflow.com/questions/44728779/deferred-that-extends-promise
 * @see https://github.com/BabylonJS/Babylon.js/blob/master/packages/dev/core/src/Misc/deferred.ts
 */
export class Deferred<T> {
  private _promise: Promise<T>;
  private _resolve: (value: T | PromiseLike<T>) => void;
  private _reject: (reason?: any) => void;

  constructor () {
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }

  public get promise (): Promise<T> {
    return this._promise
  }

  public get resolve (): (value: T | PromiseLike<T>) => void {
    return this._resolve
  }

  public get reject (): (reason?: any) => void {
    return this._reject
  }
}
