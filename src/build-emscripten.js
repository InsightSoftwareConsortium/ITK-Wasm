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
  .option('-e, --no-build-test-pipelines', 'Do not build the emscripten test pipelines')
  .option('-d, --debug', 'Create a debug build of the Emscripten modules')
  .parse(process.argv)

const options = program.opts()

// Make the directory to hold build artifacts
const buildDir = 'build-emscripten'
try {
  fs.mkdirSync('build')
} catch (err) {
  if (err.code !== 'EEXIST') throw err
}

if (options.buildIo) {
  // Make the "build" directory to hold build artifacts
  try {
    fs.mkdirSync(buildDir)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }

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
      let buildImage = 'itkwasm/emscripten:latest'
      if (options.debug) {
        buildImage = 'itkwasm/emscripten:latest-debug'
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
      const cmakeCall = spawnSync('bash', [dockcross, 'bash', '-c', `cmake ${buildType} -B${buildDir} -H. -GNinja -DITK_DIR=/ITK-build -DITK_WASM_NO_INTERFACE_LINK=1 -DBUILD_ITK_WASM_IO_MODULES=ON`], {
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

  // Build the Emscripten mobules with ninja
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
    fs.mkdirSync(path.join('dist', 'image-io'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  try {
    fs.mkdirSync(path.join('dist', 'mesh-io'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  try {
    fs.mkdirSync(path.join('dist', 'dicom', 'public', 'pipelines'), { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  try {
    fs.mkdirSync(path.join('dist', 'web-workers'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  let imageIOFiles = glob.sync(path.join(buildDir, 'image-io', '*.js'))
  imageIOFiles = imageIOFiles.concat(glob.sync(path.join(buildDir, 'image-io', '*.wasm')))
  imageIOFiles = imageIOFiles.filter((fn) => !fn.endsWith('.umd.wasm'))
  const copyImageIOModules = function (imageIOFile, callback) {
    const io = path.basename(imageIOFile)
    const output = path.join('dist', 'image-io', io)
    fs.copySync(imageIOFile, output)
    callback(null, io)
  }
  const buildImageIOsParallel = function (callback) {
    console.log('Copying image-io modules...')
    const result = asyncMod.map(imageIOFiles, copyImageIOModules)
    callback(null, result)
  }
  let meshIOFiles = glob.sync(path.join(buildDir, 'mesh-io', '*.js'))
  meshIOFiles = meshIOFiles.concat(glob.sync(path.join(buildDir, 'mesh-io', '*.wasm')))
  meshIOFiles = meshIOFiles.filter((fn) => !fn.endsWith('.umd.wasm'))
  const copyMeshIOModules = function (meshIOFile, callback) {
    const io = path.basename(meshIOFile)
    const output = path.join('dist', 'mesh-io', io)
    fs.copySync(meshIOFile, output)
    callback(null, io)
  }
  const buildMeshIOsParallel = function (callback) {
    console.log('Copying mesh-io modules...')
    const result = asyncMod.map(meshIOFiles, copyMeshIOModules)
    callback(null, result)
  }
  let dicomFiles = glob.sync(path.join(buildDir, 'dicom', '*.js'))
  dicomFiles = dicomFiles.concat(glob.sync(path.join(buildDir, 'dicom', '*.wasm')))
  dicomFiles = dicomFiles.filter((fn) => !fn.endsWith('.umd.wasm'))
  const copyDICOMModules = function (dicomFile, callback) {
    const io = path.basename(dicomFile)
    const output = path.join('dist', 'dicom', 'public', 'pipelines', io)
    fs.copySync(dicomFile, output)
    callback(null, io)
  }
  const buildDICOMParallel = function (callback) {
    console.log('Copying dicom modules...')
    const result = asyncMod.map(dicomFiles, copyDICOMModules)
    callback(null, result)
  }

  asyncMod.parallel([
    buildImageIOsParallel,
    buildMeshIOsParallel,
    buildDICOMParallel,
  ])
} // options.copySources

const testPipelines = [
  path.join('test', 'pipelines', 'stdout-stderr-pipeline'),
  path.join('test', 'pipelines', 'median-filter-pipeline'),
  path.join('test', 'pipelines', 'input-output-files-pipeline'),
  path.join('test', 'pipelines', 'input-output-json-pipeline'),
  path.join('test', 'pipelines', 'mesh-read-write-pipeline'),
  path.join('test', 'pipelines', 'bindgen-interface-types-pipeline'),
]

if (options.buildTestPipelines) {
  const buildPipeline = async (pipelinePath) => {
    console.log('Building ' + pipelinePath + ' with Emscripten...')
    let debugFlags = []
    let buildImage = 'itkwasm/emscripten:latest'
    if (options.debug) {
      buildImage = 'itkwasm/emscripten:latest-debug'
    }
    if (options.debug) {
      debugFlags = ['-DCMAKE_BUILD_TYPE:STRING=Debug', "-DCMAKE_EXE_LINKER_FLAGS_DEBUG='-s DISABLE_EXCEPTION_CATCHING=0'"]
    }
    const buildPipelineCall = await promiseSpawn('node', [path.join('src', 'itk-wasm-cli.js'), '--image', buildImage, '--source-dir', pipelinePath, 'build', '--'].concat(debugFlags), {
      env: process.env,
      stdio: 'inherit'
    })
    if (buildPipelineCall.code !== 0) {
      console.log(buildPipelineCall.stdout)
      console.error(buildPipelineCall.stderr)
      process.exit(buildPipelineCall.code)
    }
    let pipelineFiles = glob.sync(path.join(pipelinePath, 'emscripten-build', '*.js'))
    pipelineFiles = pipelineFiles.concat(glob.sync(path.join(pipelinePath, 'emscripten-build', '*.wasm')))
    pipelineFiles.forEach((file) => {
      const filename = path.basename(file)
      const output = path.join('dist', 'pipelines', filename)
      fs.copySync(file, output)
    })
  }

  try {
    fs.mkdirSync(path.join('dist', 'pipelines'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  let emscriptenTestPipelines = testPipelines
  await Promise.all(emscriptenTestPipelines.map(buildPipeline))
} // options.buildTestPipelines
