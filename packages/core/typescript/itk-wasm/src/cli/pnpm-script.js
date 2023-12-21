import fs from 'fs-extra'
import { spawnSync } from 'child_process'

import path from 'path'

import program from './program.js'

function pnpmScript(name, extraArgs, options) {
  let pnpmCommand = ['-c', 'exec']

  const micromambaExe = process.platform === 'win32' ? 'micromamba.exe' : 'micromamba'
  const micromambaBinaryPath = path.resolve(path.join('micromamba', micromambaExe))
  const micromambaRootPath = path.resolve('micromamba')
  const environmentFile = path.resolve('environment.yml')
  const environmentFileContents = fs.readFileSync(environmentFile, 'utf8')
  const environmentName = environmentFileContents.split('\n').filter(l => l.includes('name:'))[0].split(':')[1].trim()

  switch (name) {
  case 'build:emscripten':
    pnpmCommand = pnpmCommand.concat(['itk-wasm', 'build'])
    break
  case 'build:emscripten:debug':
    pnpmCommand = pnpmCommand.concat(['itk-wasm', 'build', '-i', 'itkwasm/emscripten:latest-debug', '--', '-DCMAKE_BUILD_TYPE:STRING=Debug'])
    break
  case 'build:wasi':
    pnpmCommand = pnpmCommand.concat(['itk-wasm', 'build', '-i', 'itkwasm/wasi'])
    break
  case 'build:wasi:debug':
    pnpmCommand = pnpmCommand.concat(['itk-wasm', 'build', '-i', 'itkwasm/wasi:latest-debug', '--', '-DCMAKE_BUILD_TYPE:STRING=Debug'])
    break
  case 'build:python:wasi': {
    // equivalent to: "build:python:wasi": "setup-micromamba --micromamba-binary-path ./micromamba/micromamba --micromamba-root-path micromamba --environment-file environment.yml --log-level info --run-command \"run --cwd ./python/itkwasm-compress-stringify-wasi python -m pip install -e .\"",
    if (extraArgs.length < 1) {
      throw Error('Package path is required')
    }
    const packagePath = extraArgs.shift()
    pnpmCommand = pnpmCommand.concat([micromambaBinaryPath, '-r', micromambaRootPath, '-n',  environmentName, 'run', '--cwd', packagePath, 'python', '-m', 'pip', 'install', '-e', '.'])
    }
    break
  case 'bindgen:typescript':
    pnpmCommand = pnpmCommand.concat(['itk-wasm', '-b', 'emscripten-build', 'bindgen', '--interface', 'typescript'])
    break
  case 'bindgen:python':
    pnpmCommand = pnpmCommand.concat(['itk-wasm', '-b', 'wasi-build', 'bindgen', '--interface', 'python'])
    break
  case 'build:gen:typescript':
    pnpmCommand = pnpmCommand.concat(['pnpm', 'build:emscripten', '&&', 'pnpm', 'bindgen:typescript'])
    break
  case 'build:gen:python':
    pnpmCommand = pnpmCommand.concat(['pnpm', 'build:wasi', '&&', 'pnpm', 'bindgen:python', '&&', 'pnpm', 'build:micromamba', '&&', 'pnpm', 'build:python:wasi'])
    break
  case 'build:micromamba':
    pnpmCommand = pnpmCommand.concat(['setup-micromamba', '--micromamba-binary-path', './micromamba/micromamba', '--micromamba-root-path', 'micromamba', '--init-shell', 'none', '--create-environment', 'true', '--environment-file', 'environment.yml', '--log-level', 'info', '--run-command', "clean -fya"])
    break
  case 'build:python:versionSync':
    pnpmCommand = pnpmCommand.concat(['pnpm', 'build:micromamba', '&&', 'itk-wasm', 'version-sync', '--micromamba-binary-path', micromambaBinaryPath, '--micromamba-root-path', micromambaRootPath, '--micromamba-name', environmentName])
    break
  case 'publish:python':
    pnpmCommand = pnpmCommand.concat(['pnpm', 'build:micromamba', '&&', 'itk-wasm', 'publish'])
    break
  case 'test:python:wasi':
    if (extraArgs.length < 1) {
      throw Error('Package path is required')
    }
    const packagePath = extraArgs.shift()
    pnpmCommand = pnpmCommand.concat(['pnpm', 'test:data:download', '&&', micromambaBinaryPath, '-r', micromambaRootPath, '-n',  environmentName, 'run', '--cwd', packagePath, 'pytest', '-s'])
    break
  case 'test:pyodide:download:emscripten':
  case 'test:pyodide:download:dispatch': {
    if (extraArgs.length < 1) {
      throw Error('Unpack path is required')
    }
    const unpackPath = extraArgs.shift()
    const pkg = name.split(':').pop()
    pnpmCommand = pnpmCommand.concat(['dam', 'download', unpackPath, `test/pyodide-${pkg}.tar.bz2`, 'bafybeienencwyms2wzlzx6itqe4tw7rptocwaxihqf2sj6jej2hhoy7jxa', 'https://github.com/InsightSoftwareConsortium/itk-wasm/releases/download/itk-wasm-v1.0.0-b.158/pyodide-0.24.1-itkwasm-1.0b145-test-dist.tar.bz2'])
    }
    break
  case 'test:python:emscripten':
  case 'test:python:dispatch': {
    if (extraArgs.length < 1) {
      throw Error('Package path is required')
    }
    const packagePath = extraArgs.shift()
    const downloadScript = name.replace(':python', ':pyodide:download')
    pnpmCommand = pnpmCommand.concat(['pnpm', 'test:data:download', '&&', 'pnpm', downloadScript, '&&', micromambaBinaryPath, '-r', micromambaRootPath, '-n',  environmentName, 'run', '--cwd', packagePath, 'hatch', 'run', 'test'])
    }
    break
  case 'test:python':
    pnpmCommand = pnpmCommand.concat(['pnpm', 'test:python:wasi', '&&', 'pnpm', 'test:python:emscripten'])
    break
  case 'test:wasi':
    pnpmCommand = pnpmCommand.concat(['pnpm', 'test:data:download', '&&', 'itk-wasm', 'test', '--', '--output-on-failure'])
    break
  default:
    throw Error('Unexpected itk-wasm pnpm script')
  }

  pnpmCommand = pnpmCommand.concat(extraArgs)

  const pnpmProcess = spawnSync('pnpm', pnpmCommand, {
    env: process.env,
    stdio: 'inherit',
    shell: true
  })
  if (pnpmProcess.status !== 0) {
    console.error(pnpmProcess.error);
  }
  process.exit(pnpmProcess.status)
}

export default pnpmScript