import { spawnSync } from 'child_process'

import die from './die.js'

function buildAndTest(directory: string) {
  const command = ['install', '&&', 'pnpm', 'build', '&&', 'pnpm', 'test']
  const pnpmProcess = spawnSync('pnpm', command, {
    env: process.env,
    stdio: 'inherit',
    shell: true,
    cwd: directory
  })
  if (pnpmProcess.status !== 0) {
    console.error(pnpmProcess.error)
    die(`Failed to build and test in ${directory}`)
  }
  process.exit(pnpmProcess.status)
}

export default buildAndTest
