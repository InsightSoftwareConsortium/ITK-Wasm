import { spawnSync } from 'child_process'

import processCommonOptions from './process-common-options.js'

import program from './program.js'
import die from './die.js'

function build(options) {
  const { buildDir, dockcrossScript } = processCommonOptions(program)

  const hyphenIndex = program.rawArgs.findIndex((arg) => arg === '--')
  let cmakeArgs = []
  if (hyphenIndex !== -1) {
    cmakeArgs = program.rawArgs.slice(hyphenIndex + 1)
  }
  if (process.platform === 'win32') {
    var dockerBuild = spawnSync(
      '"C:\\Program Files\\Git\\bin\\sh.exe"',
      [
        '--login',
        '-i',
        '-c',
        `"${buildDir}/itk-wasm-build-env web-build ${buildDir} ` +
          cmakeArgs.join(' ') +
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
      [dockcrossScript, 'web-build', buildDir].concat(cmakeArgs),
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

export default build
