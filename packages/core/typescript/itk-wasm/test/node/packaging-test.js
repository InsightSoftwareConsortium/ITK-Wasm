import test from 'ava'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const coreTypeScript = path.resolve(dirname, '..', '..', '..')

// The workspace root .gitignore carries a bare `dist/*` rule for the documentation site.
// pnpm 11 re-anchors workspace root .gitignore patterns to the package being packed, so a
// package that does not declare its own `files` (or ship an .npmignore) publishes without
// its build output -- itk-wasm@1.0.0-b.200 shipped that way. Generated packages are covered
// by the bindgen .npmignore; these three are maintained by hand.
const packages = ['itk-wasm', 'demo-app', 'create-itk-wasm']

for (const packageName of packages) {
  const packageDir = path.join(coreTypeScript, packageName)

  test(`${packageName} declares dist in package.json files`, (t) => {
    const manifestPath = path.join(packageDir, 'package.json')
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    t.true(Array.isArray(manifest.files), `${packageName} package.json needs a "files" array`)
    t.true(manifest.files.includes('dist'), `${packageName} "files" must include "dist"`)
  })

  // Only itk-wasm and demo-app are built by the job that runs these tests, so packing
  // create-itk-wasm would assert against an absent dist/. Decide at declaration time
  // rather than passing early, so an unbuilt package reports as skipped, not as green.
  const packTest = existsSync(path.join(packageDir, 'dist')) ? test : test.skip

  packTest(`${packageName} packs its dist directory`, (t) => {
    const packed = execFileSync('pnpm', ['pack', '--dry-run'], {
      cwd: packageDir,
      encoding: 'utf8'
    })
    const distEntries = packed.split('\n').filter((line) => line.trim().startsWith('dist/'))
    t.true(distEntries.length > 0, `${packageName} packed no dist/ files`)
  })
}
