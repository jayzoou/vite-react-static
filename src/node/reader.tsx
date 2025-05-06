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
  return writable.getData()
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
  return indexHTML.replace(
    `<div id="${rootContainerId}"></div>`,
    `<div id="${rootContainerId}" data-server-rendered="true">${appHTML}</div>`
  )
}
