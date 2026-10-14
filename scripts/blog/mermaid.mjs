// Notion code blocks in "mermaid" -> inline SVG, drawn at build time in headless Chromium (Playwright).
// Readers get a plain SVG in the HTML: no Mermaid JS (~1 MB) shipped, nothing drawn in their browser.
// The browser only starts if an article has a diagram. Any failure (bad syntax, no browser) is
// reported by the caller, which falls back to the raw code block: the build never breaks on a diagram.

import { createRequire } from 'node:module'

const MERMAID_JS = createRequire(import.meta.url).resolve('mermaid/dist/mermaid.min.js')
// Same fonts as the site: labels are measured with the font they are displayed in.
const FONTS = 'https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap'

// Site tokens (v2/styles.css): dark surfaces, light ink, violet accent.
const CONFIG = {
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'base',
  look: 'classic', // no "neo" drop shadows: they read as heavy white edges on the dark background
  fontFamily: "'Satoshi', system-ui, -apple-system, sans-serif",
  // Tighter than Mermaid's defaults: a diagram that fits the 44rem column keeps its text at full size.
  flowchart: { nodeSpacing: 28, rankSpacing: 36, padding: 10, diagramPadding: 4 },
  sequence: { diagramMarginX: 8, diagramMarginY: 8 },
  themeVariables: {
    darkMode: true,
    // Mermaid 12 still tags shapes data-look="neo": drop its light-grey shadow and gradient stroke explicitly.
    dropShadow: 'none',
    useGradient: false,
    fontFamily: "'Satoshi', system-ui, -apple-system, sans-serif",
    fontSize: '15px',
    background: 'transparent',
    primaryColor: '#16181D',
    primaryBorderColor: '#8B7BFF',
    primaryTextColor: '#ECEEF1',
    secondaryColor: '#1C1F25',
    secondaryBorderColor: '#3A3F48',
    secondaryTextColor: '#ECEEF1',
    tertiaryColor: '#111317',
    tertiaryBorderColor: '#2C3138',
    tertiaryTextColor: '#ECEEF1',
    textColor: '#ECEEF1',
    lineColor: '#9AA1AA',
    edgeLabelBackground: '#0B0C0F',
    clusterBkg: '#101216',
    clusterBorder: '#2C3138',
    titleColor: '#ECEEF1',
    noteBkgColor: '#1C1F25',
    noteBorderColor: '#8B7BFF',
    noteTextColor: '#ECEEF1',
    actorBkg: '#16181D',
    actorBorder: '#8B7BFF',
    actorTextColor: '#ECEEF1',
    actorLineColor: '#5B626B',
    signalColor: '#9AA1AA',
    signalTextColor: '#ECEEF1',
    labelBoxBkgColor: '#16181D',
    labelBoxBorderColor: '#8B7BFF',
    labelTextColor: '#ECEEF1',
    loopTextColor: '#9AA1AA',
    activationBkgColor: '#1C1F25',
    activationBorderColor: '#8B7BFF',
  },
}

export function createMermaidRenderer() {
  let browser
  let ready
  let count = 0

  async function start() {
    const { chromium } = await import('playwright')
    browser = await chromium.launch()
    const page = await browser.newPage()
    // Offline (or Fontshare down): system font instead, the diagram is still drawn.
    await page.setContent(`<!doctype html><html><head><link rel="stylesheet" href="${FONTS}"></head><body></body></html>`, { timeout: 15000 }).catch(() => {})
    await page.evaluate(() => Promise.all(['400', '500', '700'].map((w) => document.fonts.load(`${w} 16px Satoshi`))).catch(() => {}))
    await page.addScriptTag({ path: MERMAID_JS })
    await page.evaluate((cfg) => window.mermaid.initialize(cfg), CONFIG)
    return page
  }

  return {
    /** Mermaid source -> SVG markup. Throws on invalid syntax or if the browser can't start. */
    async render(code) {
      ready ??= start()
      const page = await ready
      const id = `mermaid-${++count}` // unique across the build: each SVG's styles are scoped to its id
      return page.evaluate(async ({ id, code }) => (await window.mermaid.render(id, code)).svg, { id, code })
    },
    async close() {
      await browser?.close()
    },
  }
}
