import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ViteReactStaticClientOptions } from '../types'

export function viteReactStatic(
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

  function creatRoot() {

    const router = createBrowserRouter(routes)

    const App = () => {
      return (
        <RouterProvider router={router} /> 
     )
    }

    console.log(routes, 'rrr')
    return {
      App,
      routes,
      router
    }
  }

  if(!isSSR) {
    (async () => {
      const { App, routes } = await creatRoot()

      if(import.meta.env.DEV) { 
        const root = createRoot(
          document.getElementById('root')!,
        )
        root.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>,
        )
      } else {
        const root = hydrateRoot(
          document.getElementById('root')!,
          <App />
        )
        console.log(root, 'root') 
      }
    })()
  }

  return creatRoot
}
