import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'https://giantogram-tiktok.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 80,
    host: true
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify('https://giantogram-tiktok.onrender.com')
  }
})
