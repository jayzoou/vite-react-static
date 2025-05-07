import type { RouteObject } from 'react-router-dom'

export interface ViteReactStaticClientOptions {
  transformState?: (state: any) => any
  registerComponents?: boolean
  useHead?: boolean
  /**
   * The application's root container query selector.
   *
   * @default `root`
   */
  rootContainerId?: string
}


export interface ViteReactStaticClientResource {
  routes: RouteObject[],
  basename?: string
}
