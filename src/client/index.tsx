import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, createStaticRouter, StaticRouterProvider } from 'react-router-dom'
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
    rootContainerId = 'root',
  } = options ?? {}

  function creatRoot(routePath = '/') {

    const router = import.meta.env.SSR ? createStaticRouter(routes, {
      location: routePath,
      basename: '/',
      matches: [],
    }) : createBrowserRouter(routes, {
      basename: '/',
    })

    const App = () => {
      return (
        import.meta.env.SSR ? <StaticRouterProvider router={router} context={{
          location: routePath,
          basename: '/',
          matches: [],
        }} /> : 
        <RouterProvider router={router} />
     )
    }

    return {
      App,
      routes,
      rootContainerId,
    }
  }

  if(!import.meta.env.SSR) {
    (async () => {
      const { App } = await creatRoot()

      const isSSG = document.querySelector('[data-server-rendered=true]') !== null

      if(import.meta.env.DEV || !isSSG) { 
        createRoot(
          document.getElementById(rootContainerId)!,
        ).render(
          <React.StrictMode>
            <App />
          </React.StrictMode>,
        )
      } else {
        hydrateRoot(
          document.getElementById(rootContainerId)!,
          App
        )
      }
    })()
  }

  return creatRoot
}
