#!/usr/bin/env node

import fs from 'fs-extra'
import path from 'path'
import { spawnSync } from 'child_process'
import glob from 'glob'
import asyncMod from 'async'

import { Command } from 'commander/esm.mjs'

const program = new Command()

// Make the "build" directory to hold build artifacts
try {
  fs.mkdirSync('build')
} catch (err) {
  if (err.code !== 'EEXIST') throw err
}
program
  .option('-i, --no-build-io', 'Do not compile io modules')
  .option('-s, --no-copy-build-artifacts', 'Do not copy build artifacts')
  .option('-e, --no-build-emscripten-pipelines', 'Do not build the emscripten test pipelines')
  .option('-w, --no-build-wasi-pipelines', 'Do not build the wasi test pipelines')
  .option('-v, --no-build-vtk', 'Do not build the VTK-dependent io and test pipelines')
  .option('-d, --debug', 'Create a debug build of the Emscripten modules')
  .parse(process.argv)

const options = program.opts()

if (options.buildIo) {
  // Make the "build" directory to hold build artifacts
  try {
    fs.mkdirSync('build')
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
  let dockcross = 'build/dockcross'
  if (options.debug) {
    dockcross = 'build/dockcross-debug'
  }
  if (options.buildVtk) {
    dockcross = `${dockcross}-with-vtk`
  }
  try {
    fs.statSync(dockcross)
  } catch (err) {
    if (err.code === 'ENOENT') {
      const output = fs.openSync(dockcross, 'w')
      let buildImage = 'itkwasm/emscripten:latest'
      if (options.buildVtk) {
        buildImage = 'itkwasm/emscripten-vtk:latest'
      }
      if (options.debug) {
        buildImage = 'itkwasm/emscripten:latest-debug'
        if (options.buildVtk) {
          buildImage = 'itkwasm/emscripten-vtk:latest-debug'
        }
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
    fs.statSync(path.join('build', 'build.ninja'))
  } catch (err) {
    if (err.code === 'ENOENT') {
      let buildType = '-DCMAKE_BUILD_TYPE:STRING=Release'
      if (options.debug) {
        buildType = '-DCMAKE_BUILD_TYPE:STRING=Debug'
      }
      const cmakeCall = spawnSync('bash', [dockcross, 'bash', '-c', `cmake ${buildType} -Bbuild -H. -GNinja -DITK_DIR=/ITK-build -DVTK_DIR=/VTK-build -DITK_WASM_NO_INTERFACE_LINK=1 -DBUILD_ITK_JS_IO_MODULES=ON`], {
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
  const ninjaCall = spawnSync('bash', [dockcross, 'ninja', '-Cbuild'], {
    env: process.env,
    stdio: 'inherit'
  })
  if (ninjaCall.status !== 0) {
    process.exit(ninjaCall.status)
  }
  console.log('')
} // options.compile

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
    fs.mkdirSync(path.join('dist', 'polydata-io'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  try {
    fs.mkdirSync(path.join('dist', 'web-workers'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  let imageIOFiles = glob.sync(path.join('build', 'image-io', '*.js'))
  imageIOFiles = imageIOFiles.concat(glob.sync(path.join('build', 'image-io', '*.wasm')))
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
  let meshIOFiles = glob.sync(path.join('build', 'mesh-io', '*.js'))
  meshIOFiles = meshIOFiles.concat(glob.sync(path.join('build', 'mesh-io', '*.wasm')))
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

  let polyDataIOFiles = glob.sync(path.join('build', 'polydata-io', '*.js'))
  polyDataIOFiles = polyDataIOFiles.concat(glob.sync(path.join('build', 'polydata-io', '*.wasm')))
  const copyPolyDataIOModules = function (polyDataIOFile, callback) {
    const io = path.basename(polyDataIOFile)
    const output = path.join('dist', 'polydata-io', io)
    fs.copySync(polyDataIOFile, output)
    callback(null, io)
  }
  const buildPolyDataIOsParallel = function (callback) {
    console.log('Copying polydata-io modules...')
    const result = asyncMod.map(polyDataIOFiles, copyPolyDataIOModules)
    callback(null, result)
  }

  asyncMod.parallel([
    buildImageIOsParallel,
    buildMeshIOsParallel,
    buildPolyDataIOsParallel,
  ])
} // options.copySources

const testPipelines = [
  path.join('test', 'pipelines', 'StdoutStderrPipeline'),
  path.join('test', 'pipelines', 'MedianFilterPipeline'),
  path.join('test', 'pipelines', 'InputOutputFilesPipeline'),
  path.join('test', 'pipelines', 'MeshReadWritePipeline'),
]

if (options.buildEmscriptenPipelines) {
  const buildPipeline = (pipelinePath) => {
    console.log('Building ' + pipelinePath + ' with Emscripten...')
    let debugFlags = []
    let buildImage = 'itkwasm/emscripten:latest'
    if (options.buildVtk) {
      buildImage = 'itkwasm/emscripten-vtk:latest'
    }
    if (options.debug) {
      buildImage = 'itkwasm/emscripten:latest-debug'
      if (options.buildVtk) {
        buildImage = 'itkwasm/emscripten-vtk:latest-debug'
      }
    }
    if (options.debug) {
      debugFlags = ['-DCMAKE_BUILD_TYPE:STRING=Debug', "-DCMAKE_EXE_LINKER_FLAGS_DEBUG='-s DISABLE_EXCEPTION_CATCHING=0'"]
    }
    const buildPipelineCall = spawnSync('node', [path.join('src', 'itk-wasm-cli.js'), '--image', buildImage, '--source-dir', pipelinePath, 'build', '--'].concat(debugFlags), {
      env: process.env,
      stdio: 'inherit'
    })
    if (buildPipelineCall.status !== 0) {
      process.exit(buildPipelineCall.status)
    }
    let pipelineFiles = glob.sync(path.join(pipelinePath, 'web-build', '*.js'))
    pipelineFiles = pipelineFiles.concat(glob.sync(path.join(pipelinePath, 'web-build', '*.wasm')))
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
  let emscriptenTestPipelines = testPipelines
  asyncMod.map(emscriptenTestPipelines, buildPipeline)
} // options.buildEmscriptenPipelines

if (options.buildWasiPipelines) {
  const buildPipeline = (pipelinePath) => {
    console.log('Building ' + pipelinePath + ' with wasi...')
    let debugFlags = []
    let buildImage = 'itkwasm/wasi:latest'
    if (options.debug) {
      debugFlags = ['-DCMAKE_BUILD_TYPE:STRING=Debug']
      buildImage = 'itkwasm/wasi:latest-debug'
    }
    const buildPipelineCall = spawnSync('node', [path.join('src', 'itk-wasm-cli.js'), '--image', buildImage, '--build-dir', 'wasi-build', '--source-dir', pipelinePath, 'build', '--'].concat(debugFlags), {
      env: process.env,
      stdio: 'inherit'
    })
    if (buildPipelineCall.status !== 0) {
      process.exit(buildPipelineCall.status)
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
  asyncMod.map(testPipelines, buildPipeline)
} // options.buildWasiPipelines
