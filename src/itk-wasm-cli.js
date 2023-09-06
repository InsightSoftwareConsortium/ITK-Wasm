#!/usr/bin/env node

import fs from 'fs-extra'
import path from 'path'
import { spawnSync } from 'child_process'

import glob from 'glob'
import { Command, Option } from 'commander/esm.mjs'

import typescriptBindgen from './bindgen/typescript/typescript-bindgen.js'
import pythonBindgen from './bindgen/python/python-bindgen.js'
import pythonWebDemoBindgen from './bindgen/python-web-demo/python-web-demo-bindgen.js'

const program = new Command()

const defaultImageTag = '20230906-a6f398d1'

function processCommonOptions(wasiDefault=false) {
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

function build(options) {
  const { buildDir, dockcrossScript } = processCommonOptions()

  const hyphenIndex = program.rawArgs.findIndex((arg) => arg === '--')
  let cmakeArgs = []
  if (hyphenIndex !== -1) {
    cmakeArgs = program.rawArgs.slice(hyphenIndex + 1)
  }
  if(process.platform === "win32"){
    var dockerBuild = spawnSync('"C:\\Program Files\\Git\\bin\\sh.exe"',
      ["--login", "-i", "-c", `"${buildDir}/itk-wasm-build-env web-build ${buildDir} ` + cmakeArgs.join(' ') + '"'], {
      env: process.env,
      stdio: 'inherit',
      shell: true
    });

    if (dockerBuild.status !== 0) {
      console.error(dockerBuild.error);
    }
    process.exit(dockerBuild.status);
  } else {
    const dockerBuild = spawnSync('bash', [dockcrossScript, 'web-build', buildDir].concat(cmakeArgs), {
      env: process.env,
      stdio: 'inherit'
    })
    if (dockerBuild.status !== 0) {
      console.error(dockerBuild.error);
    }
    process.exit(dockerBuild.status)
  }
}

function test(options) {
  const { buildDir, dockcrossScript } = processCommonOptions(true)

  const testDir = options.testDir ?? '.'
  const ctestTestDir = `${buildDir}/${testDir}`

  const hyphenIndex = program.rawArgs.findIndex((arg) => arg === '--')
  let ctestArgs = []
  if (hyphenIndex !== -1) {
    ctestArgs = program.rawArgs.slice(hyphenIndex + 1)
  }
  if(process.platform === "win32"){
    var dockerBuild = spawnSync('"C:\\Program Files\\Git\\bin\\sh.exe"',
      ["--login", "-i", "-c", `"${buildDir}/itk-wasm-build-env ctest --test-dir ${ctestTestDir} ` + ctestArgs.join(' ') + '"'], {
      env: process.env,
      stdio: 'inherit',
      shell: true
    });

    if (dockerBuild.status !== 0) {
      console.error(dockerBuild.error);
    }
    process.exit(dockerBuild.status);
  } else {
    const dockerBuild = spawnSync('bash', [dockcrossScript, 'ctest', '--test-dir', ctestTestDir].concat(ctestArgs), {
      env: process.env,
      stdio: 'inherit',
    })
    if (dockerBuild.status !== 0) {
      console.error(dockerBuild.error);
    }
    process.exit(dockerBuild.status)
  }
}


function run(wasmBinary, options) {
  const { buildDir, dockcrossScript } = processCommonOptions(true)

  const hyphenIndex = program.rawArgs.findIndex((arg) => arg === '--')
  let wasmBinaryArgs = []
  if (hyphenIndex !== -1) {
    wasmBinaryArgs = program.rawArgs.slice(hyphenIndex + 1)
  }
  let wasmBinaryRelativePath = `${buildDir}/${wasmBinary}`
  if (!fs.existsSync(wasmBinaryRelativePath)) {
    wasmBinaryRelativePath = wasmBinary
  }

  let wasmRuntime = 'wasmtime'
  if (options.runtime) {
    wasmRuntime = options.runtime
  }
  let wasmRuntimeArgs = []
  const quotes = process.platform === "win32" ? '\'' : ''
  switch (wasmRuntime) {
  case 'wasmtime':
    wasmRuntimeArgs = ['--args', `${quotes}-e WASMTIME_BACKTRACE_DETAILS=1${quotes}`, 'wasmtime-pwd.sh',]
    break
  case 'wasmer':
    wasmRuntimeArgs = ['sudo', 'wasmer-pwd.sh',]
    break
  case 'wasm3':
    wasmRuntimeArgs = ['wasm3',]
    break
  case 'wavm':
    wasmRuntimeArgs = ['wavm', 'run']
    break
  default:
    throw Error('unexpected wasm runtime')
  }

  if(process.platform === "win32"){
    var dockerRun = spawnSync('"C:\\Program Files\\Git\\bin\\sh.exe"',
      ["--login", "-i", "-c", `"${buildDir}/itk-wasm-build-env ${wasmRuntimeArgs.join(' ')} ${wasmBinaryRelativePath} ${wasmBinaryArgs.join(' ')}"`], {
      env: process.env,
      stdio: 'inherit',
      shell: true
    });

    if (dockerRun.status !== 0) {
      console.error(dockerRun.error);
    }
    process.exit(dockerRun.status);
  } else {
    const dockerRun = spawnSync('bash', [dockcrossScript,].concat(wasmRuntimeArgs).concat(wasmBinaryRelativePath).concat(wasmBinaryArgs), {
      env: process.env,
      stdio: 'inherit'
    })
    if (dockerRun.status !== 0) {
      console.error(dockerRun.error);
    }
    process.exit(dockerRun.status)
  }
}

function bindgen(options) {
  const { buildDir } = processCommonOptions()

  const iface = options.interface ?? 'typescript'
  const outputDir = options.outputDir ?? iface

  const wasmBinaries = glob.sync(path.join(buildDir, '**/*.wasm'))

  try {
    fs.mkdirSync(outputDir, { recursive: true })
  } catch (err) {
    if (err.code !== 'EE XIST') throw err
  }

  // Building for emscripten can generate duplicate .umd.wasm and .wasm binaries
  // Also filter libraries.
  let filteredWasmBinaries = wasmBinaries.filter(binary => !binary.endsWith('.umd.wasm') && !path.basename(binary).startsWith('lib'))

  switch (iface) {
    case 'typescript':
      typescriptBindgen(outputDir, buildDir, filteredWasmBinaries, options)
      break
    case 'python':
      pythonBindgen(outputDir, buildDir, filteredWasmBinaries, options)
      break
    case 'python-web-demo':
      pythonWebDemoBindgen(outputDir, buildDir, filteredWasmBinaries, options)
      break
    default:
      console.error(`Unexpected interface: ${iface}`)
      process.exit(1)
  }

  process.exit(0)
}

program
  .option('-i, --image <image>', 'build environment Docker image, defaults to itkwasm/emscripten -- another common image is itkwasm/wasi')
  .option('-s, --source-dir <source-directory>', 'path to source directory, defaults to "."')
  .option('-b, --build-dir <build-directory>', 'build directory whose path is relative to the source directory, defaults to "wasi-build" for the "itkwasm/wasi" image and "emscripten-build"i otherwise')
program
  .command('build')
  .usage('[-- <cmake arguments>]')
  .description('build the CMake project found in the source directory')
  .action(build)
program
  .command('test')
  .option('-t, --test-dir <test-dir>', 'Subdirectory to run ctest in relative to the build directory.')
  .usage('[-- <ctest arguments>]')
  .description('Run the tests for the CMake project found in the build directory')
  .action(test)
program
  .command('run <wasmBinary>')
  .addOption(new Option('-r, --runtime <wasm-runtime>', 'wasm runtime to use for execution, defaults to "wasmtime"').choices(['wasmtime', 'wasmer', 'wasm3', 'wavm']))
  .usage('[options] <wasmBinary> [-- -- <wasm binary arguments>]')
  .description('run the wasm binary, whose path is specified relative to the build directory')
  .action(run)
program
  .command('bindgen')
  .option('-o, --output-dir <output-dir>', 'Output directory name. Defaults to the interface option value.')
  .requiredOption('-p, --package-name <package-name>', 'Output a package configuration files with the given packages name')
  .requiredOption('-d, --package-description <package-description>', 'Description for package')
  .option('-v, --package-version <package-version>', 'Package version, e.g. "1.0.0"')
  .addOption(new Option('--interface <interface>', 'interface to generate bindings for, defaults to "typescript". "python-web-demo" support is in progress.').choices(['typescript', 'python', 'python-web-demo']))
  .option('-r, --repository <repository-url>', 'Source code repository URL')
  .option('-j, --js-module-url <js-module-url>', 'URL for the default hosted itk-wasm bindgen JS ESM module bundle. A JsDeliver is assumed by default.')
  .usage('[options]')
  .description('Generate language bindings or other interfaces for Wasm modules')
  .action(bindgen)

program
  .parse(process.argv)

program.help()
