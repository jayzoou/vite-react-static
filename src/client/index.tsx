import React from 'react'
import type { ReactNode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, createStaticRouter, StaticRouterProvider } from 'react-router-dom'
import { ViteReactStaticClientOptions, ViteReactStaticClientResource } from '../types'

export function viteReactStatic(
  resource: ReactNode | ViteReactStaticClientResource,
  options?: ViteReactStaticClientOptions,
) {
  const hasRoutes = typeof resource === 'object' && resource.routes

  const {
    transformState,
    registerComponents = true,
    useHead = true,
    rootContainerId = 'root',
  } = options ?? {}

  function creatRoot(routePath = '/') {
    if (!hasRoutes) {
      return {
        App: resource,
        routes: undefined,
        rootContainerId, 
      }
    }

    const { routes } = resource
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
        const app = hasRoutes ? App : <App />
        hydrateRoot(
          document.getElementById(rootContainerId)!,
          app
        )
      }
    })()
  }

  return creatRoot
}
