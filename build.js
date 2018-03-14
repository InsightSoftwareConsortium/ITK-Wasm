const fs = require('fs-extra')
const path = require('path')
const spawnSync = require('child_process').spawnSync
const glob = require('glob')
const asyncMod = require('async')
const ramda = require('ramda')

// Make the "build" directory to hold build artifacts
try {
  fs.mkdirSync('build')
} catch(err) {
  if (err.code != 'EEXIST') throw err
}

dockerVersion = spawnSync('docker', ['--version'], {
  env: process.env,
  stdio: [ 'ignore', 'ignore', 'ignore' ]
})
if (dockerVersion.status != 0) {
  console.error("Could not run the 'docker' command.")
  console.error("This package requires Docker to build.")
  console.error("")
  console.error("Please find installation instructions at:")
  console.error("")
  console.error("  https://docs.docker.com/install/")
  console.error("")
  process.exit(dockerVersion.status)
}

// Ensure we have the 'dockcross' Docker build environment driver script
const dockcross = path.join('build', 'dockcross')
try {
  fs.statSync(dockcross)
} catch(err) {
  if (err.code == 'ENOENT') {
    const output = fs.openSync(dockcross, 'w')
    dockerCall = spawnSync('docker', ['run', '--rm', 'insighttoolkit/itk-js:latest'], {
      env: process.env,
      stdio: [ 'ignore', output, null ]
    })
    if (dockerCall.status != 0) {
      process.exit(dockerCall.status)
    }
    fs.closeSync(output)
    fs.chmodSync(dockcross, '755')
  }else {
    throw err
  }
}

// Perform initial CMake configuration if required
try {
  fs.statSync(path.join('build', 'build.ninja'))
} catch(err) {
  if (err.code == 'ENOENT') {
    console.log('Running CMake configuration...')
    const cmakeCall = spawnSync(dockcross, ['cmake', '-DRapidJSON_INCLUDE_DIR=/rapidjson/include', '-DCMAKE_BUILD_TYPE=Release', '-Bbuild', '-H.', '-GNinja', '-DITK_DIR=/ITK-build'], {
      env: process.env,
      stdio: 'inherit'
    })
    if (cmakeCall.status != 0) {
      process.exit(cmakeCall.status)
    }
  }else {
    throw err
  }
}

// Build the Emscripten mobules with ninja
console.log('\nRunning ninja...')
const ninjaCall = spawnSync(dockcross, ['ninja', '-j8', '-Cbuild'], {
  env: process.env,
  stdio: 'inherit'
})
if (ninjaCall.status != 0) {
  process.exit(ninjaCall.status)
}
console.log('')

try {
  fs.mkdirSync('dist')
} catch(err) {
  if (err.code != 'EEXIST') throw err
}
try {
  fs.mkdirSync(path.join('dist', 'ImageIOs'))
} catch(err) {
  if (err.code != 'EEXIST') throw err
}
try {
  fs.mkdirSync(path.join('dist', 'MeshIOs'))
} catch(err) {
  if (err.code != 'EEXIST') throw err
}
try {
  fs.mkdirSync(path.join('dist', 'WebWorkers'))
} catch(err) {
  if (err.code != 'EEXIST') throw err
}
let imageIOFiles = glob.sync(path.join('build', 'ImageIOs', '*.js'))
let wasmFiles = glob.sync(path.join('build', 'ImageIOs', '*.wasm'))
imageIOFiles = imageIOFiles.concat(wasmFiles)
const copyImageIOModules = function (imageIOFile, callback) {
  let io = path.basename(imageIOFile)
  let output = path.join('dist', 'ImageIOs', io)
  fs.copySync(imageIOFile, output)
  callback(null, io)
}
const buildImageIOsParallel = function (callback) {
  console.log('Copying ImageIO modules...')
  result = asyncMod.map(imageIOFiles, copyImageIOModules)
  callback(null, result)
}
let meshIOFiles = glob.sync(path.join('build', 'MeshIOs', '*.js'))
wasmFiles = glob.sync(path.join('build', 'MeshIOs', '*.wasm'))
meshIOFiles = meshIOFiles.concat(wasmFiles)
const copyMeshIOModules = function (meshIOFile, callback) {
  let io = path.basename(meshIOFile)
  let output = path.join('dist', 'MeshIOs', io)
  fs.copySync(meshIOFile, output)
  callback(null, io)
}
const buildMeshIOsParallel = function (callback) {
  console.log('Copying MeshIO modules...')
  result = asyncMod.map(meshIOFiles, copyMeshIOModules)
  callback(null, result)
}

const copySources = ramda.curry(function (sourceSubDir, sourceFile, callback) {
  let source = path.basename(sourceFile)
  let output = path.join('dist', sourceSubDir, source)
  fs.copySync(sourceFile, output)
  callback(null, source)
})
const copyMainSources = function (callback) {
  console.log('Copying main sources...')
  const sourceFiles = glob.sync(path.join('src', '*.js'))
  const copier = copySources('.')
  const result = asyncMod.map(sourceFiles, copier)
  callback(null, result)
}

const browserify = require('browserify')
const browserifyBuild = ramda.curry(function (outputDir, es6File, callback) {
  let basename = path.basename(es6File)
  let output = path.join(outputDir, basename)
  const bundler = browserify(es6File)
  bundler.transform({global: true}, 'uglifyify')
  bundler
    .transform('babelify', {presets: ['es2015']})
    .bundle()
    .pipe(fs.createWriteStream(output))
  callback(null, basename)
})
const browserifyWebWorkerBuildParallel = function (callback) {
  console.log('Converting WebWorker sources...')
  const es6Files = glob.sync(path.join('src', 'WebWorkers', '*.js'))
  const outputDir = path.join('dist', 'WebWorkers')
  builder = browserifyBuild(outputDir)
  result = asyncMod.map(es6Files, builder)
  callback(null, result)
}

asyncMod.parallel([
  buildImageIOsParallel,
  buildMeshIOsParallel,
  copyMainSources,
  browserifyWebWorkerBuildParallel
])
