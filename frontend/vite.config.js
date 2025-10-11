import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy /api requests to the local FastAPI server during development
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
      ,
      // Proxy the generated CSV to the backend so Vite dev server doesn't return index.html for this path
      '/ranked_lawyer_data.csv': {
        target: 'http://localhost:8000/ranked_lawyer_data.csv',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ranked_lawyer_data.csv/, '/ranked_lawyer_data.csv')
      }
    }
  }
})
