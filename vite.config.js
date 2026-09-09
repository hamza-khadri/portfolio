import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'

/* Dev-only: let `/v1` resolve to `v1.html` (Cloudflare assets do this in prod). */
function v1Rewrite() {
  return {
    name: 'v1-rewrite',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/v1' || req.url === '/v1/') req.url = '/v1.html'
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [v1Rewrite(), react(), cloudflare()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        v1:   resolve(__dirname, 'v1.html'),
      },
    },
  },
})
