// @ts-check
import { renameSync, copyFileSync, rmSync, readFileSync, writeFileSync } from 'fs'

function relocateMap(path, file) {
  const map = JSON.parse(readFileSync(path, 'utf8'))
  map.file = file
  map.sources = map.sources.map((source) => source.replace(/^\.\.\/\.\.\/src\//, '../src/'))
  writeFileSync(path, JSON.stringify(map))
}

// ESM: rename .js -> .mjs, .d.ts -> .d.mts, keep a .d.ts copy for legacy consumers
renameSync('lib/esm/resolver.js', 'lib/resolver.mjs')
renameSync('lib/esm/resolver.js.map', 'lib/resolver.mjs.map')
writeFileSync('lib/resolver.mjs', readFileSync('lib/resolver.mjs', 'utf8').replace('sourceMappingURL=resolver.js.map', 'sourceMappingURL=resolver.mjs.map'))
relocateMap('lib/resolver.mjs.map', 'resolver.mjs')
renameSync('lib/esm/resolver.d.ts', 'lib/resolver.d.mts')
copyFileSync('lib/resolver.d.mts', 'lib/resolver.d.ts')
renameSync('lib/esm/resolver.d.ts.map', 'lib/resolver.d.ts.map')

// CJS: rename .js -> .cjs, .d.ts -> .d.cts
renameSync('lib/cjs/resolver.js', 'lib/resolver.cjs')
renameSync('lib/cjs/resolver.js.map', 'lib/resolver.cjs.map')
writeFileSync('lib/resolver.cjs', readFileSync('lib/resolver.cjs', 'utf8').replace('sourceMappingURL=resolver.js.map', 'sourceMappingURL=resolver.cjs.map'))
relocateMap('lib/resolver.cjs.map', 'resolver.cjs')
renameSync('lib/cjs/resolver.d.ts', 'lib/resolver.d.cts')

// clean up temp dirs
rmSync('lib/esm', { recursive: true })
rmSync('lib/cjs', { recursive: true })
