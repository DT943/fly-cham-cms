import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    let target = join(root, 'src', 'vendor', 'flycham', specifier.slice(2))
    if (!target.endsWith('.js') && !target.endsWith('.json')) target += '.js'
    return nextResolve(pathToFileURL(target).href, context)
  }
  if (
    (specifier.startsWith('./') || specifier.startsWith('../')) &&
    !specifier.endsWith('.js') &&
    !specifier.endsWith('.json')
  ) {
    return nextResolve(`${specifier}.js`, context)
  }
  return nextResolve(specifier, context)
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.json')) {
    const { readFile } = await import('node:fs/promises')
    const source = await readFile(fileURLToPath(url), 'utf8')
    return {
      format: 'module',
      source: `export default ${source}`,
      shortCircuit: true,
    }
  }
  return nextLoad(url, context)
}
