import fs from 'fs-extra'
import path from 'path'

import glob from 'glob'

import runHatch from './run-hatch.js'

function publish(options) {
  const iface = options.interface ?? 'python'
  const outputDir = options.outputDir ?? iface
  if (!fs.existsSync(outputDir)) {
    console.error(`Could not find output bindings directory: ${outputDir}`)
    process.exit(1)
  }

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
      let packagePath = path.join(outputDir, `${packageName}-wasi`)
      runHatch(micromambaBinaryPath, micromambaRootPath, micromambaName, packagePath, ['build'])
      let currentVersion = runHatch(micromambaBinaryPath, micromambaRootPath, micromambaName, packagePath, ['version']).trim()
      console.log(`Publishing ${packageName}-wasi version ${currentVersion}`)
      let artifacts = glob.sync(path.join(path.resolve(packagePath), 'dist', `*${currentVersion}*`))
      runHatch(micromambaBinaryPath, micromambaRootPath, micromambaName, packagePath, ['publish'].concat(artifacts))

      packagePath = path.join(outputDir, `${packageName}-emscripten`)
      runHatch(micromambaBinaryPath, micromambaRootPath, micromambaName, packagePath, ['build'])
      currentVersion = runHatch(micromambaBinaryPath, micromambaRootPath, micromambaName, packagePath, ['version']).trim()
      console.log(`Publishing ${packageName}-emscripten version ${currentVersion}`)
      artifacts = glob.sync(path.join(path.resolve(packagePath), 'dist', `*${currentVersion}*`))
      runHatch(micromambaBinaryPath, micromambaRootPath, micromambaName, packagePath, ['publish'].concat(artifacts))

      packagePath = path.join(outputDir, packageName)
      runHatch(micromambaBinaryPath, micromambaRootPath, micromambaName, packagePath, ['build'])
      currentVersion = runHatch(micromambaBinaryPath, micromambaRootPath, micromambaName, packagePath, ['version']).trim()
      console.log(`Publishing ${packageName} version ${currentVersion}`)
      artifacts = glob.sync(path.join(path.resolve(packagePath), 'dist', `*${currentVersion}*`))
      runHatch(micromambaBinaryPath, micromambaRootPath, micromambaName, packagePath, ['publish'].concat(artifacts))
      break
    default:
      console.error(`Unexpected interface: ${iface}`)
      process.exit(1)
  }

  process.exit(0)
}

export default publish