import { Writable } from 'stream'

export class BufferWritable extends Writable {
  private _buffer: string

  constructor() {
    super()
    this._buffer = ''
  }

  _write(chunk: string, encoding: unknown, callback: () => void) {
    // 处理输出的 chunk
    console.log('chunk', chunk.toString())
    this._buffer += chunk.toString()
    callback()
  }
  
  getBuffer() {
    return this._buffer
  }
}
