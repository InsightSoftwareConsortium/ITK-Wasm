import fs from 'fs-extra'
import { spawnSync } from 'child_process'

import path from 'path'

import defaultImageTag from './default-image-tag.js'

import die from './die.js'
import { download as damDownload } from '@itk-wasm/dam'

function configValue(
  name,
  options,
  packageJson,
  defaultValue,
  required = false
) {
  const nameCamelCase = name.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase()
  })
  if (options[nameCamelCase]) {
    return options[nameCamelCase]
  }

  const packageJsonConfigValue = packageJson?.['itk-wasm']?.[name]
  if (packageJsonConfigValue) {
    return packageJsonConfigValue
  }

  if (required) {
    die(
      `Required option\n\n  --${name}\n\n or package.json entry for\n\n  ["itk-wasm"]["${name}"]\n\n not provided`
    )
  }

  return defaultValue
}

async function downloadPyodide(unpackPath, pkg) {
  const pyodideDamCid =
    'bafybeieoibjer4bhhfls53m34rjpyfyp54oxyqimceyaia2k7syosw4jtq'
  const pyodideDamUrls = [
    'https://github.com/InsightSoftwareConsortium/ITK-Wasm/releases/download/itk-wasm-v1.0.0-b.171/pyodide-0.25.0-itkwasm-1.0b169-test-dist.tar.bz2'
  ]
  await damDownload(
    unpackPath,
    `test/pyodide-${pkg}.tar.bz2`,
    pyodideDamCid,
    pyodideDamUrls
  )
}

async function pnpmScript(name, extraArgs, options) {
  let pnpmCommand = ['-c', 'exec']

  const micromambaExe =
    process.platform === 'win32' ? 'micromamba.exe' : 'micromamba'
  const micromambaBinaryPath = path.resolve(
    path.join('micromamba', micromambaExe)
  )
  const micromambaRootPath = path.resolve('micromamba')
  const environmentFile = path.resolve('environment.yml')
  const environmentFileContents = fs.existsSync(environmentFile)
    ? fs.readFileSync(environmentFile, 'utf8')
    : null
  const environmentName = fs.existsSync(environmentFile)
    ? environmentFileContents
        .split('\n')
        .filter((l) => l.includes('name:'))[0]
        .split(':')[1]
        .trim()
    : null

  const pnpmRootCommand = ['root']
  const pnpmRootProcess = spawnSync('pnpm', pnpmRootCommand, {
    env: process.env,
    shell: true
  })
  if (pnpmRootProcess.status !== 0) {
    die(pnpmRootProcess.error)
  }
  const nodeModulesDir = pnpmRootProcess.stdout.toString().trim()
  const packageJsonPath = path.join(nodeModulesDir, '..', 'package.json')
  const packageJson = fs.readJsonSync(packageJsonPath)

  const defaultPythonOutputDir = 'python'
  const defaultTypescriptOutputDir = 'typescript'

  switch (name) {
    case 'build:emscripten':
      {
        pnpmCommand = pnpmCommand.concat(['itk-wasm', 'build'])
        const emscriptenDockerImage =
          configValue(
            'emscripten-docker-image',
            options,
            packageJson,
            undefined
          ) ?? `quay.io/itkwasm/emscripten:${defaultImageTag}`
        pnpmCommand = pnpmCommand.concat(['-i', emscriptenDockerImage])
      }
      break
    case 'build:emscripten:debug':
      {
        pnpmCommand = pnpmCommand.concat(['itk-wasm', 'build'])
        const emscriptenDockerImage =
          configValue(
            'emscripten-docker-image',
            options,
            packageJson,
            undefined
          ) ?? `quay.io/itkwasm/emscripten:${defaultImageTag}`
        // Currently, we expect the debug docker image to be tagged with -debug
        pnpmCommand = pnpmCommand.concat([
          '-i',
          `${emscriptenDockerImage}-debug`
        ])
        pnpmCommand = pnpmCommand.concat([
          '--',
          '-DCMAKE_BUILD_TYPE:STRING=Debug'
        ])
      }
      break
    case 'build:wasi':
      {
        pnpmCommand = pnpmCommand.concat(['itk-wasm', 'build'])
        const wasiDockerImage =
          configValue('wasi-docker-image', options, packageJson, undefined) ??
          `quay.io/itkwasm/wasi:${defaultImageTag}`
        pnpmCommand = pnpmCommand.concat(['-i', wasiDockerImage])
      }
      break
    case 'build:wasi:debug':
      {
        pnpmCommand = pnpmCommand.concat(['itk-wasm', 'build'])
        const wasiDockerImage =
          configValue('wasi-docker-image', options, packageJson, undefined) ??
          `quay.io/itkwasm/wasi:${defaultImageTag}`
        // Currently, we expect the debug docker image to be tagged with -debug
        pnpmCommand = pnpmCommand.concat(['-i', `${wasiDockerImage}-debug`])
        pnpmCommand = pnpmCommand.concat([
          '--',
          '-DCMAKE_BUILD_TYPE:STRING=Debug'
        ])
      }
      break
    case 'build:python:wasi':
      {
        // equivalent to: "build:python:wasi": "setup-micromamba --micromamba-binary-path ./micromamba/micromamba --micromamba-root-path micromamba --environment-file environment.yml --log-level info --run-command \"run --cwd ./python/itkwasm-compress-stringify-wasi python -m pip install -e .\"",
        const pythonOutputDir = configValue(
          'python-output-dir',
          options,
          packageJson,
          defaultPythonOutputDir
        )
        const pythonPackageName = configValue(
          'python-package-name',
          options,
          packageJson,
          undefined,
          true
        )
        const pythonPackagePath = path.join(
          pythonOutputDir,
          `${pythonPackageName}-wasi`
        )
        pnpmCommand = pnpmCommand.concat([
          micromambaBinaryPath,
          '-r',
          micromambaRootPath,
          '-n',
          environmentName,
          'run',
          '--cwd',
          pythonPackagePath,
          'python',
          '-m',
          'pip',
          'install',
          '-e',
          '.'
        ])
      }
      break
    case 'bindgen:typescript':
      {
        const typescriptOutputDir = configValue(
          'typescript-output-dir',
          options,
          packageJson,
          defaultTypescriptOutputDir
        )
        const typescriptPackageName = configValue(
          'typescript-package-name',
          options,
          packageJson,
          undefined,
          true
        )
        const emscriptenDockerImage =
          configValue(
            'emscripten-docker-image',
            options,
            packageJson,
            undefined
          ) ?? `quay.io/itkwasm/emscripten:${defaultImageTag}`
        const packageDescription = configValue(
          'package-description',
          options,
          packageJson,
          undefined,
          true
        )
        pnpmCommand = pnpmCommand.concat([
          'itk-wasm',
          '-b',
          'emscripten-build',
          '-i',
          emscriptenDockerImage,
          'bindgen',
          '--interface',
          'typescript',
          '--output-dir',
          typescriptOutputDir,
          '--package-name',
          typescriptPackageName,
          '--package-description',
          `"${packageDescription}"`
        ])
        const repositoryUrl = configValue(
          'repository',
          options,
          packageJson,
          undefined
        )
        if (repositoryUrl) {
          pnpmCommand = pnpmCommand.concat(['--repository', repositoryUrl])
        }
      }
      break
    case 'bindgen:python':
      {
        const pythonOutputDir = configValue(
          'python-output-dir',
          options,
          packageJson,
          defaultPythonOutputDir
        )
        const pythonPackageName = configValue(
          'python-package-name',
          options,
          packageJson,
          undefined,
          true
        )
        const packageDescription = configValue(
          'package-description',
          options,
          packageJson,
          undefined,
          true
        )
        const wasiDockerImage =
          configValue('wasi-docker-image', options, packageJson, undefined) ??
          `quay.io/itkwasm/wasi:${defaultImageTag}`
        pnpmCommand = pnpmCommand.concat([
          'itk-wasm',
          '-b',
          'wasi-build',
          '-i',
          wasiDockerImage,
          'bindgen',
          '--interface',
          'python',
          '--output-dir',
          pythonOutputDir,
          '--package-name',
          pythonPackageName,
          '--package-description',
          packageDescription
        ])
        const repositoryUrl = configValue(
          'repository',
          options,
          packageJson,
          undefined
        )
        if (repositoryUrl) {
          pnpmCommand = pnpmCommand.concat(['--repository', repositoryUrl])
        }
      }
      break
    case 'build:gen:typescript':
      {
        const typescriptOutputDir = configValue(
          'typescript-output-dir',
          options,
          packageJson,
          defaultTypescriptOutputDir
        )
        pnpmCommand = pnpmCommand.concat([
          'pnpm',
          'build:emscripten',
          '&&',
          'pnpm',
          'bindgen:typescript'
        ])
        pnpmCommand = pnpmCommand.concat([
          '&&',
          'pnpm',
          '--filter',
          `{${typescriptOutputDir}}`,
          'install',
          '&&',
          'pnpm',
          '--filter',
          `{${typescriptOutputDir}}`,
          'build'
        ])
      }
      break
    case 'build:gen:python':
      {
        pnpmCommand = pnpmCommand.concat([
          'pnpm',
          'build:wasi',
          '&&',
          'pnpm',
          'bindgen:python'
        ])
        if (environmentFileContents) {
          pnpmCommand = pnpmCommand.concat(['&&', 'pnpm', 'build:micromamba'])
        }
        pnpmCommand = pnpmCommand.concat([
          'pnpm',
          '&&',
          'pnpm',
          'build:python:wasi'
        ])
      }
      break
    case 'build:micromamba':
      {
        pnpmCommand = pnpmCommand.concat([
          'setup-micromamba',
          '--micromamba-binary-path',
          './micromamba/micromamba',
          '--micromamba-root-path',
          'micromamba',
          '--init-shell',
          'none',
          '--create-environment',
          'true',
          '--environment-file',
          'environment.yml',
          '--log-level',
          'info',
          '--run-command',
          'clean -fya'
        ])
      }
      break
    case 'build:python:versionSync':
      {
        const pythonOutputDir = configValue(
          'python-output-dir',
          options,
          packageJson,
          defaultPythonOutputDir
        )
        const pythonPackageName = configValue(
          'python-package-name',
          options,
          packageJson,
          undefined,
          true
        )
        pnpmCommand = pnpmCommand.concat([
          'pnpm',
          'build:micromamba',
          '&&',
          'itk-wasm',
          'version-sync',
          '--package-name',
          pythonPackageName,
          '--output-dir',
          pythonOutputDir,
          '--micromamba-binary-path',
          micromambaBinaryPath,
          '--micromamba-root-path',
          micromambaRootPath,
          '--micromamba-name',
          environmentName
        ])
      }
      break
    case 'publish:python':
      {
        const pythonOutputDir = configValue(
          'python-output-dir',
          options,
          packageJson,
          defaultPythonOutputDir
        )
        const pythonPackageName = configValue(
          'python-package-name',
          options,
          packageJson,
          undefined,
          true
        )
        pnpmCommand = pnpmCommand.concat([
          'pnpm',
          'build:micromamba',
          '&&',
          'itk-wasm',
          'publish',
          '--package-name',
          pythonPackageName,
          '--output-dir',
          pythonOutputDir,
          '--micromamba-binary-path',
          micromambaBinaryPath,
          '--micromamba-root-path',
          micromambaRootPath,
          '--micromamba-name',
          environmentName
        ])
      }
      break
    case 'test:python:wasi':
      {
        const pythonOutputDir = configValue(
          'python-output-dir',
          options,
          packageJson,
          defaultPythonOutputDir
        )
        const pythonPackageName = configValue(
          'python-package-name',
          options,
          packageJson,
          undefined,
          true
        )
        const pythonPackagePath = path.join(
          pythonOutputDir,
          `${pythonPackageName}-wasi`
        )
        pnpmCommand = pnpmCommand.concat([
          'pnpm',
          'test:data:download',
          '&&',
          micromambaBinaryPath,
          '-r',
          micromambaRootPath,
          '-n',
          environmentName,
          'run',
          '--cwd',
          pythonPackagePath,
          'pytest',
          '-s'
        ])
      }
      break
    case 'test:python:emscripten':
    case 'test:python:dispatch':
      {
        const pythonOutputDir = configValue(
          'python-output-dir',
          options,
          packageJson,
          defaultPythonOutputDir
        )
        const pythonPackageName = configValue(
          'python-package-name',
          options,
          packageJson,
          undefined,
          true
        )
        const pythonPackagePath =
          name === 'test:python:emscripten'
            ? path.join(pythonOutputDir, `${pythonPackageName}-emscripten`)
            : path.join(pythonOutputDir, pythonPackageName)

        const pyodideUnpackPath = path.join(pythonPackagePath, 'dist')
        const pkg = name.split(':').pop()
        await downloadPyodide(pyodideUnpackPath, pkg)

        pnpmCommand = pnpmCommand.concat([
          'pnpm',
          'test:data:download',
          '&&',
          micromambaBinaryPath,
          '-r',
          micromambaRootPath,
          '-n',
          environmentName,
          'run',
          '--cwd',
          pythonPackagePath,
          'hatch',
          'run',
          'test'
        ])
      }
      break
    case 'test:python':
      pnpmCommand = pnpmCommand.concat([
        'pnpm',
        'test:python:wasi',
        '&&',
        'pnpm',
        'test:python:emscripten'
      ])
      break
    case 'test:wasi':
      pnpmCommand = pnpmCommand.concat([
        'pnpm',
        'test:data:download',
        '&&',
        'itk-wasm',
        'test',
        '--',
        '--output-on-failure'
      ])
      break
    default:
      throw Error('Unexpected itk-wasm pnpm script')
  }

  pnpmCommand = pnpmCommand.concat(extraArgs)
  console.log(`>> pnpm ${pnpmCommand.join(' ')}`)

  const pnpmProcess = spawnSync('pnpm', pnpmCommand, {
    env: process.env,
    stdio: 'inherit',
    shell: true
  })
  if (pnpmProcess.status !== 0) {
    die(pnpmProcess.error)
  }
  process.exit(pnpmProcess.status)
}

export default pnpmScript
