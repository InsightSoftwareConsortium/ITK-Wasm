#!/usr/bin/env node

import fs from 'fs-extra'
import path from 'path'
import { spawnSync } from 'child_process'
import glob from 'glob'
import asyncMod from 'async'
import promiseSpawn from '@npmcli/promise-spawn'

import { Command } from 'commander/esm.mjs'

const program = new Command()

program
  .option('-b, --no-build-io', 'Do not compile io modules')
  .option('-s, --no-copy-build-artifacts', 'Do not copy build artifacts')
  .option('-w, --no-build-test-pipelines', 'Do not build the wasi test pipelines')
  .option('-d, --debug', 'Create a debug build of the WebAssembly modules')
  .parse(process.argv)

const options = program.opts()

// Make the directory to hold build artifacts
const buildDir = 'build-wasi'
try {
  fs.mkdirSync(buildDir)
} catch (err) {
  if (err.code !== 'EEXIST') throw err
}

if (options.buildIo) {
  const dockerVersion = spawnSync('docker', ['--version'], {
    env: process.env,
    stdio: ['ignore', 'ignore', 'ignore']
  })
  if (dockerVersion.status !== 0) {
    console.error("Could not run the 'docker' command.")
    console.error('This package requires Docker to build.')
    console.error('')
    console.error('Please find installation instructions at:')
    console.error('')
    console.error('  https://docs.docker.com/install/')
    console.error('')
    process.exit(dockerVersion.status)
  }

  // Ensure we have the 'dockcross' Docker build environment driver script
  let dockcross = `${buildDir}/dockcross`
  if (options.debug) {
    dockcross = `${buildDir}/dockcross-debug`
  }
  try {
    fs.statSync(dockcross)
  } catch (err) {
    if (err.code === 'ENOENT') {
      const output = fs.openSync(dockcross, 'w')
      let buildImage = 'itkwasm/wasi:latest'
      if (options.debug) {
        buildImage = 'itkwasm/wasi:latest-debug'
      }
      const dockerCall = spawnSync('docker', ['run', '--rm', buildImage], {
        env: process.env,
        stdio: ['ignore', output, null]
      })
      if (dockerCall.status !== 0) {
        process.exit(dockerCall.status)
      }
      fs.closeSync(output)
      fs.chmodSync(dockcross, '755')
    } else {
      throw err
    }
  }

  // Perform initial CMake configuration if required
  try {
    fs.statSync(path.join(buildDir, 'build.ninja'))
  } catch (err) {
    if (err.code === 'ENOENT') {
      let buildType = '-DCMAKE_BUILD_TYPE:STRING=Release'
      if (options.debug) {
        buildType = '-DCMAKE_BUILD_TYPE:STRING=Debug'
      }
      const cmakeCall = spawnSync('bash', [dockcross, 'bash', '-c', `cmake ${buildType} -B${buildDir} -H. -GNinja -DSIZEOF_SIZE_T:INTERNAL=4 -DSANITIZE:BOOL=OFF -DITK_DIR=/ITK-build -DITK_WASM_NO_INTERFACE_LINK=1 -DBUILD_ITK_WASM_IO_MODULES=ON`], {
        env: process.env,
        stdio: 'inherit'
      })
      if (cmakeCall.status !== 0) {
        process.exit(cmakeCall.status)
      }
    } else {
      throw err
    }
  }

  // Build the WebAssembly mobules with ninja
  console.log('\nRunning ninja...')
  const ninjaCall = spawnSync('bash', [dockcross, 'ninja', `-C${buildDir}`], {
    env: process.env,
    stdio: 'inherit'
  })
  if (ninjaCall.status !== 0) {
    process.exit(ninjaCall.status)
  }
  console.log('')
} // options.buildIo

if (options.copyBuildArtifacts) {
  try {
    fs.mkdirSync('dist')
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  try {
    fs.mkdirSync(path.join('dist', 'wasi-image-io'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  try {
    fs.mkdirSync(path.join('dist', 'wasi-mesh-io'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  let imageIOFiles = glob.sync(path.join(buildDir, 'wasi-image-io', '*.wasm'))
  const copyImageIOModules = function (imageIOFile, callback) {
    const io = path.basename(imageIOFile)
    const output = path.join('dist', 'wasi-image-io', io)
    fs.copySync(imageIOFile, output)
    callback(null, io)
  }
  const buildImageIOsParallel = function (callback) {
    console.log('Copying wasi-image-io modules...')
    const result = asyncMod.map(imageIOFiles, copyImageIOModules)
    callback(null, result)
  }
  let meshIOFiles = glob.sync(path.join(buildDir, 'wasi-mesh-io', '*.wasm'))
  const copyMeshIOModules = function (meshIOFile, callback) {
    const io = path.basename(meshIOFile)
    const output = path.join('dist', 'wasi-mesh-io', io)
    fs.copySync(meshIOFile, output)
    callback(null, io)
  }
  const buildMeshIOsParallel = function (callback) {
    console.log('Copying wasi-mesh-io modules...')
    const result = asyncMod.map(meshIOFiles, copyMeshIOModules)
    callback(null, result)
  }

  asyncMod.parallel([
    buildImageIOsParallel,
    buildMeshIOsParallel,
  ])
} // options.copySources

const testPipelines = [
  path.join('test', 'pipelines', 'stdout-stderr-pipeline'),
  path.join('test', 'pipelines', 'median-filter-pipeline'),
  path.join('test', 'pipelines', 'input-output-files-pipeline'),
  path.join('test', 'pipelines', 'mesh-read-write-pipeline'),
]

if (options.buildTestPipelines) {
  const buildPipeline = async (pipelinePath) => {
    console.log('Building ' + pipelinePath + ' with wasi...')
    let debugFlags = []
    let buildImage = 'itkwasm/wasi:latest'
    if (options.debug) {
      debugFlags = ['-DCMAKE_BUILD_TYPE:STRING=Debug']
      buildImage = 'itkwasm/wasi:latest-debug'
    }
    const buildPipelineCall = await promiseSpawn('node', [path.join('src', 'itk-wasm-cli.js'), '--image', buildImage, '--build-dir', 'wasi-build', '--source-dir', pipelinePath, 'build', '--'].concat(debugFlags), {
      env: process.env,
      stdio: 'inherit'
    })
    if (buildPipelineCall.code !== 0) {
      console.log(buildPipelineCall.stdout)
      console.error(buildPipelineCall.stderr)
      process.exit(buildPipelineCall.code)
    }
    const pipelineFiles = glob.sync(path.join(pipelinePath, 'wasi-build', '*.wasm'))
    pipelineFiles.forEach((file) => {
      const filename = path.basename(file)
      const output = path.join('dist', 'pipeline', filename)
      fs.copySync(file, output)
    })
  }

  try {
    fs.mkdirSync(path.join('dist', 'pipeline'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  await Promise.all(testPipelines.map(buildPipeline))
} // options.buildWasiPipelines
