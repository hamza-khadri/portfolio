import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'

/* Dev-only: let `/v2` resolve to `v2.html` (Cloudflare assets do this in prod). */
function v2Rewrite() {
  return {
    name: 'v2-rewrite',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/v2' || req.url === '/v2/') req.url = '/v2.html'
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [v2Rewrite(), react(), cloudflare()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        v2:   resolve(__dirname, 'v2.html'),
      },
    },
  },
})
