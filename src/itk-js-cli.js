#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const spawnSync = require('child_process').spawnSync

const program = require('commander')

const build = (sourceDir) => {
  // Check that the source directory exists and chdir to it.
  if (!fs.existsSync(sourceDir)) {
    console.error('The source directory: ' + sourceDir + ' does not exist!')
    process.exit(1)
  }
  process.chdir(sourceDir)

  // Make the 'web-build' directory to hold the dockcross script and the CMake
  // build.
  try {
    fs.mkdirSync('web-build')
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }

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

  let dockerImage = 'insighttoolkit/itk-js'
  if (program.commands[0].image) {
    dockerImage = program.commands[0].image
  }

  // Ensure we have the 'dockcross' Docker build environment driver script
  const dockcrossScript = path.join('web-build', 'itk-js-build-env')
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
        process.exit(dockerCall.status)
      }
      fs.closeSync(output)
      fs.chmodSync(dockcrossScript, '755')
    } else {
      throw err
    }
  }

  const dockerBuild = spawnSync(dockcrossScript, ['web-build'], {
    env: process.env,
    stdio: 'inherit'
  })
  if (dockerBuild.status !== 0) {
    process.exit(dockerBuild.status)
  }
}

program
  .command('build <sourceDir>')
  .description('build the CMake project found in the given source directory')
  .action(build)
  .option('-i, --image <image>', 'build environment Docker image, defaults to insighttoolkit/itk-js')

program
  .parse(process.argv)
