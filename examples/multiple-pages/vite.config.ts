import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    UnoCSS(),
  ],
  staticOptions: {
    script: 'defer',
    mock: true,
    mode: 'ssg',
    outDir: 'dist',
  }
})
