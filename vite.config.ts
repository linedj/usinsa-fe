import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '#backend': resolve(__dirname, 'libs/backend'),
    },
  },
  server: {
    fs: {
      allow: [
        resolve(__dirname),
        resolve(__dirname, 'libs')
      ],
    },
    proxy: process.env.VITE_API_PROXY
      ? {
        '/api': {
          target: process.env.VITE_API_PROXY,
          changeOrigin: true,
        },
      }
      : undefined,
  },
})
