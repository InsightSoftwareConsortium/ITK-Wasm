import fs from 'fs-extra'

import runHatch from './run-hatch.js'

function versionSync(options) {
  const iface = options.interface ?? 'python'
  const outputDir = options.outputDir ?? iface
  if (!fs.existsSync(outputDir)) {
    console.error(`Could not find output bindings directory: ${outputDir}`)
    process.exit(1)
  }

  const typescriptDir = options.typescriptDir ?? path.join(outputDir, '..', 'typescript')
  if (!fs.existsSync(typescriptDir)) {
    console.error(`Could not find typescript bindings directory: ${typescriptDir}`)
    process.exit(1)
  }
  const typescriptPackageJsonPath = path.join(typescriptDir, 'package.json')
  const typescriptVersion = JSON.parse(fs.readFileSync(typescriptPackageJsonPath)).version
  console.log(`Syncing ${iface} bindings version to typescript bindings version: ${typescriptVersion}`)

  const micromambaBinaryPath = options.micromambaBinaryPath ?? path.join(outputDir, '..', 'micromamba', 'micromamba')
  if (!fs.existsSync(micromambaBinaryPath)) {
    console.error(`Could not find micromamba binary: ${micromambaBinaryPath}`)
    process.exit(1)
  }

  const micromambaRootPath = options.micromambaRootPath ?? path.join(outputDir, '..', 'micromamba')
  if (!fs.existsSync(micromambaRootPath)) {
    console.error(`Could not find micromamba root: ${micromambaRootPath}`)
    process.exit(1)
  }

  const micromambaName = options.micromambaName ?? path.basename(path.resolve(path.join(outputDir, '..')))

  const packageName = options.packageName

  switch (iface) {
    case 'python':
      let packagePath = path.join(outputDir, packageName)
      let currentVersion = runHatch(packagePath, ['version']).trim()
      if (currentVersion !== typescriptVersion) {
        console.log(`Syncing ${packagePath} version`)
        runHatch(micromambaBinaryPath, micromambaRootPath, micromambaName, packagePath, ['version', typescriptVersion])
      }
      packagePath = path.join(outputDir, `${packageName}-emscripten`)
      currentVersion = runHatch(packagePath, ['version']).trim()
      if (currentVersion !== typescriptVersion) {
        console.log(`Syncing ${packagePath} version`)
        runHatch(micromambaBinaryPath, micromambaRootPath, micromambaName, packagePath, ['version', typescriptVersion])
      }
      packagePath = path.join(outputDir, `${packageName}-wasi`)
      currentVersion = runHatch(packagePath, ['version']).trim()
      if (currentVersion !== typescriptVersion) {
        console.log(`Syncing ${packagePath} version`)
        runHatch(micromambaBinaryPath, micromambaRootPath, micromambaName, packagePath, ['version', typescriptVersion])
      }
      break
    default:
      console.error(`Unexpected interface: ${iface}`)
      process.exit(1)
  }

  process.exit(0)
}

export default versionSync