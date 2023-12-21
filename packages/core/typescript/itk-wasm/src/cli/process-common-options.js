import fs from 'fs-extra'
import path from 'path'
import { spawnSync } from 'child_process'

import defaultImageTag from './default-image-tag.js'

function processCommonOptions(program, wasiDefault=false) {
  const options = program.opts()

  // Check that we have docker and can run it.
  const dockerVersion = spawnSync('docker', ['--version'], {
    env: process.env,
    stdio: [ 'ignore', 'ignore', 'ignore' ]
  })
  if (dockerVersion.status !== 0) {
    console.error("Could not run the 'docker' command.")
    console.error('This tool requires Docker.')
    console.error('')
    console.error('Please find installation instructions at:')
    console.error('')
    console.error('  https://docs.docker.com/install/')
    console.error('')
    process.exit(dockerVersion.status)
  }

  let dockerImage = `itkwasm/emscripten:${defaultImageTag}`
  if (options.image) {
    dockerImage = options.image
    if (dockerImage === 'itkwasm/wasi') {
      dockerImage = `itkwasm/wasi:${defaultImageTag}`
    }
  }

  const dockerImageCheck = spawnSync('docker', ['images', '--quiet', dockerImage], {
    env: process.env,
    stdio: 'pipe',
    encoding: 'utf-8',
  })

  if (dockerImageCheck.stdout === '') {
    console.log(`Build environment image not found, pulling ${dockerImage}...`)
    const dockerPull = spawnSync('docker', ['pull', dockerImage], {
      env: process.env,
      stdio: 'inherit',
      encoding: 'utf-8',
    })
    if (dockerPull.status !== 0) {
      console.error(`Could not pull docker image ${dockerImage}`)
      process.exit(dockerPull.status)
    }
  }

  let sourceDir = '.'
  if (options.sourceDir) {
    sourceDir = options.sourceDir
  }

  // Check that the source directory exists and chdir to it.
  if (!fs.existsSync(sourceDir)) {
    console.error('The source directory: ' + sourceDir + ' does not exist!')
    process.exit(1)
  }
  process.chdir(sourceDir)

  let buildDir = dockerImage.includes('wasi') || wasiDefault ? 'wasi-build' : 'emscripten-build'
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
      const dockerCall = spawnSync('docker', ['run', '--rm', dockerImage], {
        env: process.env,
        stdio: [ 'ignore', output, null ]
      })
      if (dockerCall.status !== 0) {
        console.error(dockerCall.stderr.toString())
        process.exit(dockerCall.status)
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