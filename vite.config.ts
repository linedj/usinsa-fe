import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
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
      proxy: env.VITE_API_PROXY
        ? {
          '/api': {
            target: env.VITE_API_PROXY,
            changeOrigin: true,
          },
        }
        : undefined,
    },
  }
})
