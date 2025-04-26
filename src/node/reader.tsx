import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { Writable } from 'stream'; 

class MyWritable extends Writable {
  constructor() {
    super();
  }

  _write(chunk, encoding, callback) {
    // 处理输出的 chunk
    console.log('chunk', chunk.toString());
    callback();
  }
}

// 示例 React 组件
const Page = ({ title, content }) => (
  <div>pppp</div>
)

export async function render() {

  const writable = new MyWritable();
  // console.log(renderToPipeableStream, 'renderToPipeableStream')
  const { pipe } = renderToPipeableStream(<Page title="Hello" content="World" />, {
    onShellReady() {
      pipe(writable) 
    }
  }); 
}
