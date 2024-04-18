import { spawnSync } from 'child_process'

import die from './die.js'

function runHatch(
  micromambaBinaryPath,
  micromambaRootPath,
  micromambaName,
  cwd,
  hatchArgs
) {
  let versionProcess = spawnSync(
    micromambaBinaryPath,
    [
      '-r',
      micromambaRootPath,
      'run',
      '-n',
      micromambaName,
      '--cwd',
      cwd,
      'hatch'
    ].concat(hatchArgs),
    {
      env: process.env,
      stdio: 'pipe',
      encoding: 'utf-8'
    }
  )
  if (versionProcess.status !== 0) {
    die(`Could not run hatch at ${cwd} version with args: hatch ${hatchArgs.join(' ')}`)
  }
  return versionProcess.stdout.toString()
}

export default runHatch
