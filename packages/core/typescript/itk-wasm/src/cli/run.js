import fs from 'fs-extra'
import { spawnSync } from 'child_process'

import processCommonOptions from './process-common-options.js'

import program from './program.js'
import die from './die.js'

function run(wasmBinary, options) {
  const { buildDir, dockcrossScript } = processCommonOptions(program, true)

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
  const quotes = process.platform === 'win32' ? "'" : ''
  switch (wasmRuntime) {
    case 'wasmtime':
      wasmRuntimeArgs = [
        '--args',
        `${quotes}-e WASMTIME_BACKTRACE_DETAILS=1${quotes}`,
        'wasmtime-pwd.sh',
        '-W', 'threads',
        '-S', 'threads,cli'
      ]
      break
    case 'wasmer':
      wasmRuntimeArgs = ['sudo', 'wasmer-pwd.sh']
      break
    case 'wasm3':
      wasmRuntimeArgs = ['wasm3']
      break
    case 'wavm':
      wasmRuntimeArgs = ['wavm', 'run']
      break
    default:
      throw Error('unexpected wasm runtime')
  }

  if (process.platform === 'win32') {
    var dockerRun = spawnSync(
      '"C:\\Program Files\\Git\\bin\\sh.exe"',
      [
        '--login',
        '-i',
        '-c',
        `"${buildDir}/itk-wasm-build-env ${wasmRuntimeArgs.join(' ')} ${wasmBinaryRelativePath} ${wasmBinaryArgs.join(' ')}"`
      ],
      {
        env: process.env,
        stdio: 'inherit',
        shell: true
      }
    )

    if (dockerRun.status !== 0) {
      die(dockerRun.error)
    }
    process.exit(dockerRun.status)
  } else {
    const dockerRun = spawnSync(
      'bash',
      [dockcrossScript]
        .concat(wasmRuntimeArgs)
        .concat(wasmBinaryRelativePath)
        .concat(wasmBinaryArgs),
      {
        env: process.env,
        stdio: 'inherit'
      }
    )
    if (dockerRun.status !== 0) {
      die(dockerRun.error)
    }
    process.exit(dockerRun.status)
  }
}

export default run
