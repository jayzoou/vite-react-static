# Vite React Static (SSG)

Static-site generation for React 18+ with Vite.

[![NPM version](https://img.shields.io/npm/v/vite-react-static?color=grren)](https://www.npmjs.com/package/vite-react-static)


## Install

<pre>
<b>npm i -D vite-react-static</b>
</pre>

```diff
// package.json
{
  "scripts": {
    "dev": "vite",
-   "build": "vite build"
+   "build": "vite-react-static build"

    // OR if you want to use another vite config file
+   "build": "vite-react-static build -c another-vite.config.ts"
  }
}
```

```ts
// src/main.tsx
import { viteReactStatic } from 'vite-react-static'

const routes = [
    {
      path: '/',
      element: <Layout />, 
      children: [
        //...
      ]
    },
] 

// `export const createRoot` is required
export const createRoot = viteReactStatic({
  routes
})
```
