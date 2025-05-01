export interface ViteReactStaticClientOptions {
  transformState?: (state: any) => any
  registerComponents?: boolean
  useHead?: boolean
  /**
   * The application's root container query selector.
   *
   * @default `#app`
   */
  rootContainer?: string | Element
  /**
   * Enable Vue hydration on client side
   *
   * @default false
   */
  hydration?: boolean
}
