import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { BufferWritable } from './utils/bufferWritable' 

// 示例 React 组件
const Page = ({ title, content }) => (
  <div>pppp</div>
)

export async function render() {

  const writable = new BufferWritable();
  // console.log(renderToPipeableStream, 'renderToPipeableStream')
  const { pipe } = renderToPipeableStream(<Page title="Hello" content="World" />, {
    onShellReady() {
      pipe(writable) 
    }
  }); 
}
