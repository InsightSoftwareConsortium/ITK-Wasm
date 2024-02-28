import { spawnSync } from 'child_process'

import processCommonOptions from './process-common-options.js'

import program from './program.js'
import die from './die.js'

function test(options) {
  const { buildDir, dockcrossScript } = processCommonOptions(program, true)

  const testDir = options.testDir ?? '.'
  const ctestTestDir = `${buildDir}/${testDir}`

  const hyphenIndex = program.rawArgs.findIndex((arg) => arg === '--')
  let ctestArgs = []
  if (hyphenIndex !== -1) {
    ctestArgs = program.rawArgs.slice(hyphenIndex + 1)
  }
  if (process.platform === 'win32') {
    var dockerBuild = spawnSync(
      '"C:\\Program Files\\Git\\bin\\sh.exe"',
      [
        '--login',
        '-i',
        '-c',
        `"${buildDir}/itk-wasm-build-env ctest --test-dir ${ctestTestDir} ` +
          ctestArgs.join(' ') +
          '"'
      ],
      {
        env: process.env,
        stdio: 'inherit',
        shell: true
      }
    )

    if (dockerBuild.status !== 0) {
      die(dockerBuild.error)
    }
    process.exit(dockerBuild.status)
  } else {
    const dockerBuild = spawnSync(
      'bash',
      [dockcrossScript, 'ctest', '--test-dir', ctestTestDir].concat(ctestArgs),
      {
        env: process.env,
        stdio: 'inherit'
      }
    )
    if (dockerBuild.status !== 0) {
      die(dockerBuild.error)
    }
    process.exit(dockerBuild.status)
  }
}

export default test
