import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
      allow: ['..'],
    },
    warmup: {
      clientFiles: ['./src/main.tsx'],
    },
  },
})
