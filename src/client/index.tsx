import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { ViteReactStaticClientOptions } from '../types'

export function viteReactStatic(
  App,
  routerOptions,
  options?: ViteReactStaticClientOptions,
) {
  const { routes } = routerOptions
  const {
    transformState,
    registerComponents = true,
    useHead = true,
    rootContainer = '#iroot',
  } = options ?? {}

  const isSSR = import.meta.env.SSR

  console.log('App', App)
  function creatRoot() {

    console.log(routes, 'rrr')
    return {
      App,
      routes 
    }
  }

  if(!isSSR) {
    (async () => {
      const { routes } = await creatRoot()
      const root = hydrateRoot(
        document.getElementById('root')!,
        <App routes={routes} />
      )
      console.log(root, 'root')
    })()
  }

  return creatRoot
}
