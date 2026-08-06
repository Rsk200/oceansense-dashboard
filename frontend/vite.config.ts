import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Treat .geojson files as JSON modules
    {
      name: 'geojson-loader',
      transform(code, id) {
        if (id.endsWith('.geojson')) {
          return {
            code: `export default ${code}`,
            map: null,
          };
        }
      },
    },
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
