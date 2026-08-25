import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The dev server proxies API calls to the Spring Boot backend so the
// browser never has to deal with cross origin requests during local work.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
