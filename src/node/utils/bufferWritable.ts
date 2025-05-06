import { Writable } from 'stream'

export class BufferWritable extends Writable {
  private _buffer: string
  private _p: {
    resolve: (value: string) => void
    reject: (reason?: unknown) => void
    promise: Promise<string>
  }

  constructor() {
    super()
    this._buffer = ''
    this._p = {
      resolve: () => {},
      reject: () => {},
      promise: null as unknown as Promise<string>,
    }

    this._p.promise = new Promise((resolve, reject) => {
      this._p.resolve = resolve
      this._p.reject = reject
    })
  }

  _write(chunk: string, encoding: unknown, callback: () => void) {
    this._buffer += chunk.toString()
    callback()
  }

  end() {
    this._p.resolve(this._buffer)
  }

  getData() {
    return this._p.promise
  }
}
