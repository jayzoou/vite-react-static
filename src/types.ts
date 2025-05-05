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
  /**
   * Enable Vue hydration on client side
   *
   * @default false
   */
  hydration?: boolean
}
