import { StrictMode, Suspense } from 'react'
// import { createRoot } from 'react-dom/client'
import { viteReactStatic } from 'vite-react-static'
import './index.css'
import App from './App.tsx'

const modules = import.meta.glob(
  [
    '../../../pages/**/*.mdx',
  ], 
  { eager: true })

const routes = Object.keys(modules)
  .map((filename: string) => {
    const path = filename
      .replace (/\..\/\..\/(pages)/, '')
      .replace(/\//g,'')
      .replace(/\.(mdx|tsx)$/, '')
      .replace('Index', '')
    //@ts-ignore
    const Component = modules[filename].default
    return { path: `/${path}`, element: <Suspense><Component /></Suspense> }
  })

export const createRoot = viteReactStatic(App, {
  routes 
})

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
