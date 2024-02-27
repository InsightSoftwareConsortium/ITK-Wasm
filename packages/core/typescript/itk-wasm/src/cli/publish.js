import fs from 'fs-extra'
import path from 'path'

import glob from 'glob'

import runHatch from './run-hatch.js'
import die from './die.js'

function publish(options) {
  const iface = options.interface ?? 'python'
  const outputDir = options.outputDir ?? iface
  if (!fs.existsSync(outputDir)) {
    die(`Could not find output bindings directory: ${outputDir}`)
  }

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
      let packagePath = path.join(outputDir, `${packageName}-wasi`)
      runHatch(
        micromambaBinaryPath,
        micromambaRootPath,
        micromambaName,
        packagePath,
        ['build']
      )
      let currentVersion = runHatch(
        micromambaBinaryPath,
        micromambaRootPath,
        micromambaName,
        packagePath,
        ['version']
      ).trim()
      console.log(`Publishing ${packageName}-wasi version ${currentVersion}`)
      let artifacts = glob.sync(
        path.join(path.resolve(packagePath), 'dist', `*${currentVersion}*`)
      )
      runHatch(
        micromambaBinaryPath,
        micromambaRootPath,
        micromambaName,
        packagePath,
        ['publish'].concat(artifacts)
      )

      packagePath = path.join(outputDir, `${packageName}-emscripten`)
      runHatch(
        micromambaBinaryPath,
        micromambaRootPath,
        micromambaName,
        packagePath,
        ['build']
      )
      currentVersion = runHatch(
        micromambaBinaryPath,
        micromambaRootPath,
        micromambaName,
        packagePath,
        ['version']
      ).trim()
      console.log(
        `Publishing ${packageName}-emscripten version ${currentVersion}`
      )
      artifacts = glob.sync(
        path.join(path.resolve(packagePath), 'dist', `*${currentVersion}*`)
      )
      runHatch(
        micromambaBinaryPath,
        micromambaRootPath,
        micromambaName,
        packagePath,
        ['publish'].concat(artifacts)
      )

      packagePath = path.join(outputDir, packageName)
      runHatch(
        micromambaBinaryPath,
        micromambaRootPath,
        micromambaName,
        packagePath,
        ['build']
      )
      currentVersion = runHatch(
        micromambaBinaryPath,
        micromambaRootPath,
        micromambaName,
        packagePath,
        ['version']
      ).trim()
      console.log(`Publishing ${packageName} version ${currentVersion}`)
      artifacts = glob.sync(
        path.join(path.resolve(packagePath), 'dist', `*${currentVersion}*`)
      )
      runHatch(
        micromambaBinaryPath,
        micromambaRootPath,
        micromambaName,
        packagePath,
        ['publish'].concat(artifacts)
      )
      break
    default:
      die(`Unexpected interface: ${iface}`)
  }

  process.exit(0)
}

export default publish
