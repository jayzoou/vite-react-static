// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import { viteReactStatic } from 'vite-react-static'
import './index.css'
import App from './App.tsx'

console.log(viteReactStatic, 'viteReactStatic')

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

export const createRoot =  viteReactStatic(App)
