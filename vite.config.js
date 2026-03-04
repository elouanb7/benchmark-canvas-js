import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: change 'canvas-benchmark' to your actual repo name
export default defineConfig({
  plugins: [react()],
  base: '/benchmark-canvas-js/',
})
