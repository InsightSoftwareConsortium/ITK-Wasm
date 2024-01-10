import { spawnSync } from 'child_process'

function runHatch(micromambaBinaryPath, micromambaRootPath, micromambaName, cwd, hatchArgs) {
  let versionProcess = spawnSync(micromambaBinaryPath, ['-r', micromambaRootPath, 'run', '-n', micromambaName, '--cwd', cwd, 'hatch'].concat(hatchArgs), {
    env: process.env,
    stdio: 'pipe',
    encoding: 'utf-8',
  })
  if (versionProcess.status !== 0) {
    console.error(`Could not run hatch at ${cwd} version with args ${hatchArgs}`)
    process.exit(versionProcess.status)
  }
  return versionProcess.stdout.toString()
}

export default runHatch