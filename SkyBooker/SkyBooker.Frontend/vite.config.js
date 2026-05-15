import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    proxy: {
      '/api/auth': { target: 'http://localhost:5010', changeOrigin: true, rewrite: p => p.replace(/^\/api\/auth/, '/api/auth') },
      '/api/flight': { target: 'http://localhost:5001', changeOrigin: true },
      '/api/booking': { target: 'http://localhost:5003', changeOrigin: true },
    }
  }
})
