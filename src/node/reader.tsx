import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { BufferWritable } from './utils/bufferWritable' 

// 示例 React 组件
const Page = ({ title, content }) => (
  <div>pppp</div>
)

export async function renderReactNode({
  ReactNode,
}) {
  console.log('renderReactNode', ReactNode)

  const writable = new BufferWritable()
  // console.log(renderToPipeableStream, 'renderToPipeableStream')
  const { pipe } = renderToPipeableStream(<ReactNode />, {
    onShellReady() {
      pipe(writable) 
    }
  })
  return writable.getPromise()
}

export async function renderHTML({
  indexHTML,
  appHTML,
  staticOptions = {},
  viteConfig = {},
}: {
  indexHTML: string
  appHTML: string
  staticOptions?: any
  viteConfig?: any
}) {
  // console.log('renderHTML', indexHTML, appHTML, staticOptions, viteConfig)
  // const { script } = staticOptions
  // const { injectScript } = viteConfig
  // const html = indexHTML.replace(
  //   '<div id="app"></div>',
  //   `<div id="app">${appHTML}</div>`
  // )
  // return html
  return indexHTML.replace(
    '<div id="root"></div>',
    `<div id="root">${appHTML}</div>`
  )
}
