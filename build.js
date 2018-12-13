#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const spawnSync = require('child_process').spawnSync
const glob = require('glob')
const asyncMod = require('async')
const ramda = require('ramda')

const program = require('commander')

// Make the "build" directory to hold build artifacts
try {
  fs.mkdirSync('build')
} catch (err) {
  if (err.code !== 'EEXIST') throw err
}
program
  .option('-c, --no-compile', 'Do not compile Emscripten modules')
  .option('-s, --no-copy-sources', 'Do not copy JavaScript sources')
  .option('-p, --no-build-pipelines', 'Do not build the test pipelines')
  .parse(process.argv)

if (program.compile) {
  // Make the "build" directory to hold build artifacts
  try {
    fs.mkdirSync('build')
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }

  const dockerVersion = spawnSync('docker', ['--version'], {
    env: process.env,
    stdio: [ 'ignore', 'ignore', 'ignore' ]
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
  const dockcross = path.join('build', 'dockcross')
  try {
    fs.statSync(dockcross)
  } catch (err) {
    if (err.code === 'ENOENT') {
      const output = fs.openSync(dockcross, 'w')
      const dockerCall = spawnSync('docker', ['run', '--rm', 'insighttoolkit/itk-js-base:latest'], {
        env: process.env,
        stdio: [ 'ignore', output, null ]
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
      console.log('Running CMake configuration...')
      const cmakeCall = spawnSync(dockcross, ['cmake', '-DRapidJSON_INCLUDE_DIR=/rapidjson/include', '-DCMAKE_BUILD_TYPE=Release', '-Bbuild', '-H.', '-GNinja', '-DITK_DIR=/ITK-build', '-DBUILD_ITK_JS_IO_MODULES=ON'], {
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
  const ninjaCall = spawnSync(dockcross, ['ninja', '-j8', '-Cbuild'], {
    env: process.env,
    stdio: 'inherit'
  })
  if (ninjaCall.status !== 0) {
    process.exit(ninjaCall.status)
  }
  console.log('')
} // program.compile

if (program.copySources) {
  try {
    fs.mkdirSync('dist')
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  try {
    fs.mkdirSync(path.join('dist', 'ImageIOs'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  try {
    fs.mkdirSync(path.join('dist', 'MeshIOs'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  try {
    fs.mkdirSync(path.join('dist', 'WebWorkers'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  let imageIOFiles = glob.sync(path.join('build', 'ImageIOs', '*.js'))
  const copyImageIOModules = function (imageIOFile, callback) {
    let io = path.basename(imageIOFile)
    let output = path.join('dist', 'ImageIOs', io)
    fs.copySync(imageIOFile, output)
    callback(null, io)
  }
  const buildImageIOsParallel = function (callback) {
    console.log('Copying ImageIO modules...')
    const result = asyncMod.map(imageIOFiles, copyImageIOModules)
    callback(null, result)
  }
  let meshIOFiles = glob.sync(path.join('build', 'MeshIOs', '*.js'))
  const copyMeshIOModules = function (meshIOFile, callback) {
    let io = path.basename(meshIOFile)
    let output = path.join('dist', 'MeshIOs', io)
    fs.copySync(meshIOFile, output)
    callback(null, io)
  }
  const buildMeshIOsParallel = function (callback) {
    console.log('Copying MeshIO modules...')
    const result = asyncMod.map(meshIOFiles, copyMeshIOModules)
    callback(null, result)
  }

  const browserify = require('browserify')
  const browserifyBuild = ramda.curry(function (uglify, outputDir, es6File, callback) {
    let basename = path.basename(es6File)
    let output = path.join(outputDir, basename)
    const bundler = browserify(es6File)
    if (uglify) {
      bundler.transform({ global: true }, 'uglifyify')
      bundler
        .transform('babelify', { presets: ['@babel/preset-env'] })
        .bundle()
        .pipe(fs.createWriteStream(output))
    } else {
      bundler
        .transform('babelify', { presets: ['@babel/preset-env'] })
        .bundle()
        .pipe(fs.createWriteStream(output))
    }
    callback(null, basename)
  })
  const browserifyWebWorkerBuildParallel = function (callback) {
    console.log('Converting WebWorker sources...')
    const es6Files = glob.sync(path.join('src', 'WebWorkers', '*.js'))
    const outputDir = path.join('dist', 'WebWorkers')
    const builder = browserifyBuild(true, outputDir)
    const result = asyncMod.map(es6Files, builder)
    callback(null, result)
  }

  const babelOptions = {
    presets: [
      ['@babel/preset-env', { 'modules': false }]
    ]
  }
  const babel = require('@babel/core')
  const babelBuild = ramda.curry(function (outputDir, es6File, callback) {
    let basename = path.basename(es6File)
    let output = path.join(outputDir, basename)
    babel.transformFile(es6File, babelOptions, function (err, result) {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      const outputFD = fs.openSync(output, 'w')
      fs.writeSync(outputFD, result.code)
      fs.closeSync(outputFD)
    })
    callback(null, basename)
  })
  const babelBuildParallel = function (callback) {
    console.log('Converting main sources...')
    const es6Files = glob.sync(path.join('src', '*.js'))
    const outputDir = 'dist'
    const builder = babelBuild(outputDir)
    const result = asyncMod.map(es6Files, builder)
    callback(null, result)
  }

  asyncMod.parallel([
    buildImageIOsParallel,
    buildMeshIOsParallel,
    babelBuildParallel,
    browserifyWebWorkerBuildParallel
  ])
} // program.copySources

if (program.buildPipelines) {
  const buildPipeline = (pipelinePath) => {
    console.log('Building ' + pipelinePath + ' ...')
    const buildPipelineCall = spawnSync(path.join(__dirname, 'src', 'itk-js-cli.js'), ['build', pipelinePath], {
      env: process.env,
      stdio: 'inherit'
    })
    if (buildPipelineCall.status !== 0) {
      process.exit(buildPipelineCall.status)
    }
    const pipelineFiles = glob.sync(path.join(pipelinePath, 'web-build', '*.js'))
    pipelineFiles.forEach((file) => {
      let filename = path.basename(file)
      let output = path.join(__dirname, 'dist', 'Pipelines', filename)
      fs.copySync(file, output)
    })
  }

  const pipelines = [
    path.join(__dirname, 'test', 'StdoutStderrPipeline'),
    path.join(__dirname, 'test', 'BinShrinkPipeline'),
    path.join(__dirname, 'test', 'InputOutputFilesPipeline')
  ]
  try {
    fs.mkdirSync(path.join(__dirname, 'dist', 'Pipelines'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  asyncMod.map(pipelines, buildPipeline)
} // progrem
