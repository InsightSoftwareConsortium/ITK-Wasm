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
  .option('-d, --debug', 'Create a debug build of the Emscripten modules')
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
  if (program.debug) {
    dockcross = 'build/dockcross-debug'
  }
  try {
    fs.statSync(dockcross)
  } catch (err) {
    if (err.code === 'ENOENT') {
      const output = fs.openSync(dockcross, 'w')
      let buildImage = 'kitware/itk-js-vtk:latest'
      if (program.debug) {
        buildImage = 'kitware/itk-js-vtk:20210219-50b0b10-debug'
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
      if (program.debug) {
        buildType = '-DCMAKE_BUILD_TYPE:STRING=Debug'
      }
      const cmakeCall = spawnSync('bash', [dockcross, 'bash', '-c', `cmake -DRapidJSON_INCLUDE_DIR=/rapidjson/include ${buildType} -Bbuild -H. -GNinja -DITK_DIR=/ITK-build -DVTK_DIR=/VTK-build -DBUILD_ITK_JS_IO_MODULES=ON`], {
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
  const ninjaCall = spawnSync('bash', [dockcross, 'ninja', '-j8', '-Cbuild'], {
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
    fs.mkdirSync(path.join('dist', 'PolyDataIOs'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  try {
    fs.mkdirSync(path.join('dist', 'WebWorkers'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  let imageIOFiles = glob.sync(path.join('build', 'ImageIOs', '*.js'))
  imageIOFiles = imageIOFiles.concat(glob.sync(path.join('build', 'ImageIOs', '*.wasm')))
  const copyImageIOModules = function (imageIOFile, callback) {
    const io = path.basename(imageIOFile)
    const output = path.join('dist', 'ImageIOs', io)
    fs.copySync(imageIOFile, output)
    callback(null, io)
  }
  const buildImageIOsParallel = function (callback) {
    console.log('Copying ImageIO modules...')
    const result = asyncMod.map(imageIOFiles, copyImageIOModules)
    callback(null, result)
  }
  let meshIOFiles = glob.sync(path.join('build', 'MeshIOs', '*.js'))
  meshIOFiles = meshIOFiles.concat(glob.sync(path.join('build', 'MeshIOs', '*.wasm')))
  const copyMeshIOModules = function (meshIOFile, callback) {
    const io = path.basename(meshIOFile)
    const output = path.join('dist', 'MeshIOs', io)
    fs.copySync(meshIOFile, output)
    callback(null, io)
  }
  const buildMeshIOsParallel = function (callback) {
    console.log('Copying MeshIO modules...')
    const result = asyncMod.map(meshIOFiles, copyMeshIOModules)
    callback(null, result)
  }

  let polyDataIOFiles = glob.sync(path.join('build', 'PolyDataIOs', '*.js'))
  polyDataIOFiles = polyDataIOFiles.concat(glob.sync(path.join('build', 'PolyDataIOs', '*.wasm')))
  const copyPolyDataIOModules = function (polyDataIOFile, callback) {
    const io = path.basename(polyDataIOFile)
    const output = path.join('dist', 'PolyDataIOs', io)
    fs.copySync(polyDataIOFile, output)
    callback(null, io)
  }
  const buildPolyDataIOsParallel = function (callback) {
    console.log('Copying PolyDataIO modules...')
    const result = asyncMod.map(polyDataIOFiles, copyPolyDataIOModules)
    callback(null, result)
  }

  const browserify = require('browserify')
  const browserifyBuild = ramda.curry(function (uglify, outputDir, es6File, callback) {
    const basename = path.basename(es6File)
    const output = path.join(outputDir, basename)
    const bundler = browserify(es6File)
    if (uglify) {
      bundler.transform({ global: true }, 'uglifyify')
      bundler
        .transform('babelify', { presets: ['@babel/preset-env'], plugins: ['@babel/plugin-transform-runtime'] })
        .bundle()
        .pipe(fs.createWriteStream(output))
    } else {
      bundler
        .transform('babelify', { presets: ['@babel/preset-env'], plugins: ['@babel/plugin-transform-runtime'] })
        .bundle()
        .pipe(fs.createWriteStream(output))
    }
    callback(null, basename)
  })
  const browserifyWebWorkerBuildParallel = function (callback) {
    console.log('Converting WebWorker sources...')
    const es6Files = glob.sync(path.join('src', 'WebWorkers', '*.js'))
    const outputDir = path.join('dist', 'WebWorkers')
    const builder = browserifyBuild(false, outputDir)
    const result = asyncMod.map(es6Files, builder)
    callback(null, result)
  }

  const babelOptionsPresetEnv = {
    presets: [
      ['@babel/preset-env', { modules: false }]
    ],
    plugins: [
      ['@babel/plugin-transform-runtime', {
        regenerator: true
      }]
    ]
  }
  const babelOptionsCJS = {
    plugins: [
      '@babel/plugin-transform-modules-commonjs'
    ]
  }
  const babel = require('@babel/core')
  const babelBuild = ramda.curry(function (outputDir, es6File, callback) {
    babel.transformFile(es6File, babelOptionsPresetEnv, function (err, result) {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      const basename = path.basename(es6File)
      const output = path.join(outputDir, basename)
      const outputFD = fs.openSync(output, 'w')
      fs.writeSync(outputFD, result.code)
      fs.closeSync(outputFD)
    })
    babel.transformFile(es6File, babelOptionsCJS, function (err, result) {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      const basename = path.basename(es6File, '.js')
      const output = path.join(outputDir, `${basename}.cjs`)
      const outputFD = fs.openSync(output, 'w')
      fs.writeSync(outputFD, result.code)
      fs.closeSync(outputFD)
    })
    callback(null, es6File)
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
    buildPolyDataIOsParallel,
    babelBuildParallel,
    browserifyWebWorkerBuildParallel
  ])
} // program.copySources

if (program.buildPipelines) {
  const buildPipeline = (pipelinePath) => {
    console.log('Building ' + pipelinePath + ' ...')
    let debugFlags = []
    if (program.debug) {
      debugFlags = ['-DCMAKE_BUILD_TYPE:STRING=Debug', "-DCMAKE_EXE_LINKER_FLAGS_DEBUG='-s DISABLE_EXCEPTION_CATCHING=0'"]
    }
    const buildPipelineCall = spawnSync('node', [path.join(__dirname, 'src', 'itk-js-cli.js'), 'build', '--image', 'kitware/itk-js-vtk:latest', pipelinePath, '--'].concat(debugFlags), {
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
      const output = path.join(__dirname, 'dist', 'Pipelines', filename)
      fs.copySync(file, output)
    })
  }

  const pipelines = [
    path.join(__dirname, 'test', 'StdoutStderrPipeline'),
    path.join(__dirname, 'test', 'MedianFilterPipeline'),
    path.join(__dirname, 'test', 'InputOutputFilesPipeline'),
    path.join(__dirname, 'test', 'MeshReadWritePipeline'),
    path.join(__dirname, 'test', 'WriteVTKPolyDataPipeline'),
    path.join(__dirname, 'test', 'CLPExample1'),
    path.join(__dirname, 'src', 'Pipelines', 'MeshToPolyData')
  ]
  try {
    fs.mkdirSync(path.join(__dirname, 'dist', 'Pipelines'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  asyncMod.map(pipelines, buildPipeline)
} // progrem
