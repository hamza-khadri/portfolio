import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'

/* Extra pages served next to the homepage, each at `/<name>` from `<name>.html`. */
const PAGES = ['v1', 'v2-0-0']

/* Dev-only: let `/<name>` resolve to `<name>.html` (Cloudflare assets do this in prod). */
function pageRewrite() {
  return {
    name: 'page-rewrite',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const name = req.url?.replace(/^\/|\/$/g, '')
        if (PAGES.includes(name)) req.url = `/${name}.html`
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [pageRewrite(), react(), cloudflare()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...Object.fromEntries(PAGES.map((name) => [name, resolve(__dirname, `${name}.html`)])),
      },
    },
  },
})
