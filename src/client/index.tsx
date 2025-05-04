import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, createStaticRouter } from 'react-router-dom'
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
    rootContainer = '#root',
  } = options ?? {}

  function creatRoot(routePath = '/') {

    const router = import.meta.env.SSR ? createStaticRouter(routes, {
      location: routePath,
      matches: []
    }) : createBrowserRouter(routes)

    const App = () => {
      return (
        <RouterProvider router={router} /> 
     )
    }

    return {
      App,
      routes,
      router
    }
  }

  if(!import.meta.env.SSR) {
    (async () => {
      const { App } = await creatRoot()

      if(import.meta.env.DEV) { 
        createRoot(
          document.querySelector(rootContainer)!,
        ).render(
          <React.StrictMode>
            <App />
          </React.StrictMode>,
        )
      } else {
        hydrateRoot(
          document.querySelector(rootContainer)!,
          <App />
        )
      }
    })()
  }

  return creatRoot
}
