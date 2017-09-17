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

// Ensure we have the 'dockcross' Docker build environment driver script
const dockcross = path.join('build', 'dockcross')
try {
  fs.statSync(dockcross)
} catch(err) {
  if (err.code == 'ENOENT') {
    const output = fs.openSync(dockcross, 'w')
    dockerCall = spawnSync('docker', ['run', '--rm', 'insighttoolkit/bridgejavascript'], {
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
    const cmakeCall = spawnSync(dockcross, ['cmake', '-DCMAKE_BUILD_TYPE=Release', '-Bbuild', '-H.', '-GNinja', '-DITK_DIR=/usr/src/ITK-build'], {
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
const ninjaCall = spawnSync(dockcross, ['ninja', '-j5', '-Cbuild'], {
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
  fs.mkdirSync(path.join('dist', 'WebWorkers'))
} catch(err) {
  if (err.code != 'EEXIST') throw err
}
imageIOFiles = glob.sync(path.join('build', 'ImageIOs', '*.js'))
const copyIOModules = function (imageIOFile, callback) {
  let io = path.basename(imageIOFile)
  console.log('Copying ' + io + ' ...')
  let output = path.join('dist', 'ImageIOs', io)

  fs.copySync(imageIOFile, output)

  console.log(io + ' copy complete')
  callback(null, io)
}
const buildImageIOsParallel = function (callback) {
  result = asyncMod.map(imageIOFiles, copyIOModules)
  callback(null, result)
}

const babelOptions = {
  presets: [
    ['es2015', { 'modules': false }]
  ]
}
const babel = require('babel-core')
const babelBuild = ramda.curry(function (outputDir, es6File, callback) {
  let basename = path.basename(es6File)
  let output = path.join(outputDir, basename)
  console.log('Converting ' + basename + ' ...')
  babel.transformFile(es6File, babelOptions, function (err, result) {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    const outputFD = fs.openSync(output, 'w')
    fs.writeSync(outputFD, result.code)
    fs.closeSync(outputFD)
    console.log(basename + ' conversion complete')
  })
  callback(null, basename)
})
const babelBuildParallel = function (callback) {
  const es6Files = glob.sync(path.join('src', '*.js'))
  const outputDir = 'dist'
  builder = babelBuild(outputDir)
  result = asyncMod.map(es6Files, builder)
  callback(null, result)
}

const browserify = require('browserify')
const browserifyBuild = ramda.curry(function (outputDir, es6File, callback) {
  let basename = path.basename(es6File)
  let output = path.join(outputDir, basename)
  console.log('Converting ' + basename + ' ...')
  const bundler = browserify(es6File)
  bundler.transform({global: true}, 'uglifyify')
  bundler
    .transform('babelify', {presets: ['es2015']})
    .bundle()
    .pipe(fs.createWriteStream(output))

  console.log(basename + ' conversion complete')
  callback(null, basename)
})
const browserifyWebWorkerBuildParallel = function (callback) {
  const es6Files = glob.sync(path.join('src', 'WebWorkers', '*.js'))
  const outputDir = path.join('dist', 'WebWorkers')
  builder = browserifyBuild(outputDir)
  result = asyncMod.map(es6Files, builder)
  callback(null, result)
}

asyncMod.parallel([
  buildImageIOsParallel,
  babelBuildParallel,
  browserifyWebWorkerBuildParallel
])
