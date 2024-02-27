import fs from 'fs'
import path from 'path'
import os from 'os'

import chalk from 'chalk'

import die from './die.js'

function findOciExe() {
  // Check for OCI_EXE environmental variable
  const ociExe = process.env.OCI_EXE
  if (ociExe && fs.existsSync(ociExe)) {
    return ociExe
  }

  // Get the PATH environment variable
  const PATH = process.env.PATH.split(path.delimiter)

  // Check for podman executable
  const podmanExe = os.platform() === 'win32' ? 'podman.exe' : 'podman'
  for (let p of PATH) {
    if (fs.existsSync(path.join(p, podmanExe))) {
      return podmanExe
    }
  }

  // Check for docker executable
  const dockerExe = os.platform() === 'win32' ? 'docker.exe' : 'docker'
  for (let p of PATH) {
    if (fs.existsSync(path.join(p, dockerExe))) {
      return dockerExe
    }
  }

  // If none of the above exist, die
  die(`${chalk.magenta(`Could not find podman or docker executable in the
    PATH or OCI_EXE environmental variables.`)}

${chalk.blue(`Please find installation instructions at:

    https://podman.io/docs/installation`)}

`)
}

export default findOciExe
