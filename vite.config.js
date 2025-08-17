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
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  preview: {
    port: 80,
    host: true
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify('https://giantogram-tiktok.onrender.com'),
    'process.env.FRONTEND_URL': JSON.stringify('https://giantogram-tiktok-1.onrender.com')
  }
})
