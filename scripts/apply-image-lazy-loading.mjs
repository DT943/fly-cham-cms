/**
 * Ensure every <img> in src/ uses loading="lazy" + decoding="async".
 *
 *   node scripts/apply-image-lazy-loading.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src')

function findImgTags(source) {
  const tags = []
  let i = 0
  while (i < source.length) {
    const start = source.indexOf('<img', i)
    if (start === -1) break
    const next = source[start + 4]
    if (next && /[A-Za-z0-9-]/.test(next)) {
      i = start + 4
      continue
    }
    let j = start + 4
    let quote = null
    let brace = 0
    while (j < source.length) {
      const c = source[j]
      if (quote) {
        if (c === quote && source[j - 1] !== '\\') quote = null
      } else if (c === '"' || c === "'" || c === '`') {
        quote = c
      } else if (c === '{') {
        brace += 1
      } else if (c === '}') {
        brace = Math.max(0, brace - 1)
      } else if (brace === 0 && c === '>') {
        tags.push({ start, end: j + 1, text: source.slice(start, j + 1) })
        break
      }
      j += 1
    }
    i = j + 1
  }
  return tags
}

function patchTag(tag) {
  let next = tag
    .replace(/\s*fetchPriority="high"/g, '')
    .replace(/\s*loading="eager"/g, '')
    .replace(/\s*loading=\{[^}]+\}/g, '')

  if (!/\bdecoding\s*=/.test(next)) {
    next = next.replace(/<img\b/, '<img decoding="async"')
  }
  if (!/\bloading\s*=/.test(next)) {
    next = next.replace(/<img\b/, '<img loading="lazy"')
  } else {
    next = next.replace(/loading=\{[^}]+\}/, 'loading="lazy"')
    next = next.replace(/loading="eager"/, 'loading="lazy"')
  }
  return next
}

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name)
    if (name.isDirectory()) walk(full, out)
    else if (/\.(jsx|tsx|js|ts)$/.test(name.name)) out.push(full)
  }
  return out
}

let filesTouched = 0
let tagsPatched = 0

for (const file of walk(root)) {
  if (file.endsWith(`${path.sep}LazyImage.jsx`)) continue
  const source = fs.readFileSync(file, 'utf8')
  if (!source.includes('<img')) continue
  const tags = findImgTags(source)
  if (!tags.length) continue

  let next = source
  let changed = 0
  for (let t = tags.length - 1; t >= 0; t -= 1) {
    const { start, end, text } = tags[t]
    const patched = patchTag(text)
    if (patched === text) continue
    next = next.slice(0, start) + patched + next.slice(end)
    changed += 1
  }
  if (!changed) continue
  fs.writeFileSync(file, next)
  filesTouched += 1
  tagsPatched += changed
  console.log(`${path.relative(root, file)}: ${changed}`)
}

console.log(`\nDone: ${tagsPatched} images in ${filesTouched} files`)
