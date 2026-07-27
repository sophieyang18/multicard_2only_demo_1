import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(rootDir, 'dist')
const publicDir = join(rootDir, 'public')
const htmlPath = join(distDir, 'index.html')
const outputPath = join(rootDir, '即创工作台方案1-单文件.html')

function readAsset(assetPath) {
  const cleanPath = assetPath.replace(/^\//, '')
  return readFileSync(join(distDir, cleanPath), 'utf8')
}

function dataUrl(filePath, mimeType) {
  const content = readFileSync(filePath)
  return `data:${mimeType};base64,${content.toString('base64')}`
}

if (!existsSync(htmlPath)) {
  throw new Error('dist/index.html 不存在，请先运行 vite build')
}

let html = readFileSync(htmlPath, 'utf8')

html = html.replace(
  /<link rel="icon" type="image\/svg\+xml" href="([^"]+)" \/>/g,
  (_, href) => {
    const faviconPath = join(publicDir, href.replace(/^\//, ''))
    if (!existsSync(faviconPath)) return ''
    return `<link rel="icon" type="image/svg+xml" href="${dataUrl(faviconPath, 'image/svg+xml')}" />`
  },
)

html = html.replace(
  /<link rel="stylesheet" crossorigin href="([^"]+)">/g,
  (_, href) => `<style>\n${readAsset(href)}\n</style>`,
)

html = html.replace(
  /<script type="module" crossorigin src="([^"]+)"><\/script>/g,
  (_, src) => `<script type="module">\n${readAsset(src)}\n</script>`,
)

const agentImagePath = join(publicDir, 'routine-agent-page.png')
if (existsSync(agentImagePath)) {
  html = html.replace(/\/routine-agent-page\.png/g, dataUrl(agentImagePath, 'image/png'))
}

writeFileSync(outputPath, html)
console.log(`Standalone HTML written: ${outputPath}`)
