import fs from 'fs-extra'
import path from 'path'
import { spawnSync } from 'child_process'

import defaultImageTag from './default-image-tag.js'
import findOciExe from './find-oci-exe.js'
import die from './die.js'

function processCommonOptions(program, wasiDefault = false) {
  const options = program.opts()

  const ociExePath = findOciExe()

  let dockerImage = `quay.io/itkwasm/emscripten:${defaultImageTag}`
  if (options.image) {
    dockerImage = options.image
    if (dockerImage === 'itkwasm/wasi') {
      dockerImage = `quay.io/itkwasm/wasi:${defaultImageTag}`
    }
  }

  const dockerImageCheck = spawnSync(
    ociExePath,
    ['images', '--quiet', dockerImage],
    {
      env: process.env,
      stdio: 'pipe',
      encoding: 'utf-8'
    }
  )

  if (dockerImageCheck.stdout === '') {
    console.log(`Build environment image not found, pulling ${dockerImage}...`)
    const dockerPull = spawnSync(ociExePath, ['pull', dockerImage], {
      env: process.env,
      stdio: 'inherit',
      encoding: 'utf-8'
    })
    if (dockerPull.status !== 0) {
      die(`Could not pull docker image ${dockerImage}`)
    }
  }

  let sourceDir = '.'
  if (options.sourceDir) {
    sourceDir = options.sourceDir
  }

  // Check that the source directory exists and chdir to it.
  if (!fs.existsSync(sourceDir)) {
    die('The source directory: ' + sourceDir + ' does not exist!')
  }
  process.chdir(sourceDir)

  let buildDir =
    dockerImage.includes('wasi') || wasiDefault
      ? 'wasi-build'
      : 'emscripten-build'
  if (options.buildDir) {
    buildDir = options.buildDir
  }

  // Make the build directory to hold the dockcross script and the CMake
  // build.
  try {
    fs.mkdirSync(buildDir)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }

  // Ensure we have the 'dockcross' Docker build environment driver script
  const dockcrossScript = path.join(buildDir, 'itk-wasm-build-env')
  try {
    fs.statSync(dockcrossScript)
  } catch (err) {
    if (err.code === 'ENOENT') {
      const output = fs.openSync(dockcrossScript, 'w')
      const dockerCall = spawnSync(ociExePath, ['run', '--rm', dockerImage], {
        env: process.env,
        stdio: ['ignore', output, null]
      })
      if (dockerCall.status !== 0) {
        die(dockerCall.stderr.toString())
      }
      fs.closeSync(output)
      fs.chmodSync(dockcrossScript, '755')
    } else {
      throw err
    }
  }

  return { dockerImage, dockcrossScript, buildDir }
}

export default processCommonOptions
