import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { BufferWritable } from './utils/bufferWritable' 

export async function renderReactNode({
  ReactNode,
}) {
  const writable = new BufferWritable()
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
  rootContainerId,
  staticOptions = {},
  viteConfig = {},
}: {
  indexHTML: string
  appHTML: string
  rootContainerId: string
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
  // return htm
  return indexHTML.replace(
    `<div id="${rootContainerId}"></div>`,
    `<div id="${rootContainerId}" data-server-rendered="true">${appHTML}</div>`
  )
}
