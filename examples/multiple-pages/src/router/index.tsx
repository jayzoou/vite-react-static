import { createBrowserRouter } from 'react-router-dom'
import { Suspense } from 'react'
import Layout from '../component/Layout.tsx'

const modules = import.meta.glob(
  [
    '../pages/**/*.tsx',
  ], 
  { eager: true })
console.log(modules, 'm')
const routes = Object.keys(modules)
  .map((filename: string) => {
    const path = filename
      .replace (/\..\/(pages)/, '')
      .replace(/\//g,'')
      .replace(/\.(mdx|tsx)$/, '')
      .replace('Index', '')
    //@ts-ignore
    const Component = modules[filename].default
    return { path: `/${path}`, element: <Suspense><Component /></Suspense> }
  })

console.log(routes, 'rssdas')

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, 
    children: routes
  },
]);

export default router
