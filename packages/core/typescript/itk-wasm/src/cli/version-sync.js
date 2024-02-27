import fs from 'fs-extra'
import path from 'path'

import runHatch from './run-hatch.js'
import die from './die.js'

function versionSync(options) {
  const iface = options.interface ?? 'python'
  const outputDir = options.outputDir ?? iface
  if (!fs.existsSync(outputDir)) {
    die(`Could not find output bindings directory: ${outputDir}`)
  }

  const typescriptDir =
    options.typescriptDir ?? path.join(outputDir, '..', 'typescript')
  if (!fs.existsSync(typescriptDir)) {
    die(`Could not find typescript bindings directory: ${typescriptDir}`)
  }
  const typescriptPackageJsonPath = path.join(typescriptDir, 'package.json')
  const typescriptVersion = JSON.parse(
    fs.readFileSync(typescriptPackageJsonPath)
  ).version
  console.log(
    `Syncing ${iface} bindings version to typescript bindings version: ${typescriptVersion}`
  )

  const micromambaBinaryPath =
    options.micromambaBinaryPath ??
    path.join(outputDir, '..', 'micromamba', 'micromamba')
  if (!fs.existsSync(micromambaBinaryPath)) {
    die(`Could not find micromamba binary: ${micromambaBinaryPath}`)
  }

  const micromambaRootPath =
    options.micromambaRootPath ?? path.join(outputDir, '..', 'micromamba')
  if (!fs.existsSync(micromambaRootPath)) {
    die(`Could not find micromamba root: ${micromambaRootPath}`)
  }

  const micromambaName =
    options.micromambaName ??
    path.basename(path.resolve(path.join(outputDir, '..')))

  const packageName = options.packageName

  switch (iface) {
    case 'python':
      let packagePath = path.join(outputDir, packageName)
      let currentVersion = runHatch(
        micromambaBinaryPath,
        micromambaRootPath,
        micromambaName,
        packagePath,
        ['version']
      ).trim()
      if (currentVersion !== typescriptVersion) {
        console.log(`Syncing ${packagePath} version`)
        runHatch(
          micromambaBinaryPath,
          micromambaRootPath,
          micromambaName,
          packagePath,
          ['version', typescriptVersion]
        )
      }
      packagePath = path.join(outputDir, `${packageName}-emscripten`)
      currentVersion = runHatch(
        micromambaBinaryPath,
        micromambaRootPath,
        micromambaName,
        packagePath,
        ['version']
      ).trim()
      if (currentVersion !== typescriptVersion) {
        console.log(`Syncing ${packagePath} version`)
        runHatch(
          micromambaBinaryPath,
          micromambaRootPath,
          micromambaName,
          packagePath,
          ['version', typescriptVersion]
        )
      }
      packagePath = path.join(outputDir, `${packageName}-wasi`)
      currentVersion = runHatch(
        micromambaBinaryPath,
        micromambaRootPath,
        micromambaName,
        packagePath,
        ['version']
      ).trim()
      if (currentVersion !== typescriptVersion) {
        console.log(`Syncing ${packagePath} version`)
        runHatch(
          micromambaBinaryPath,
          micromambaRootPath,
          micromambaName,
          packagePath,
          ['version', typescriptVersion]
        )
      }
      break
    default:
      die(`Unexpected interface: ${iface}`)
  }

  process.exit(0)
}

export default versionSync
