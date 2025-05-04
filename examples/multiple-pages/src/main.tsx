import { StrictMode, Suspense } from 'react'
// import { createRoot } from 'react-dom/client'
import { viteReactStatic } from 'vite-react-static'
import './index.css'
import './App.css'
import 'virtual:uno.css'
// import App from './App.tsx'
import Layout from './component/Layout.tsx'

const modules = import.meta.glob(
  [
    './pages/**/*.tsx',
  ], 
  { eager: true })

const route = Object.keys(modules)
  .map((filename: string) => {
    const path = filename
      .replace (/\.\/(pages)/, '')
      .replace(/\//g,'')
      .replace(/\.(mdx|tsx)$/, '')
      .replace('Index', '')
    //@ts-ignore
    const Component = modules[filename].default
    return { path: `/${path}`, element: <Suspense><Component /></Suspense> }
  })

const routes = [
  {
    path: '/',
    element: <Layout />, 
    children: route
  },
]

console.log(routes, 'routes')

export const createRoot = viteReactStatic({
  routes 
})

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
