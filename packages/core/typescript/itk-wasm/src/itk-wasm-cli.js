#!/usr/bin/env node

import { Option } from 'commander/esm.mjs'

import build from './cli/build.js'
import test from './cli/test.js'
import run from './cli/run.js'
import bindgen from './cli/bindgen.js'
import versionSync from './cli/version-sync.js'
import publish from './cli/publish.js'
import pnpmScript from './cli/pnpm-script.js'

import program from './cli/program.js'

async function main() {
  program
    .option('-i, --image <image>', 'build environment Docker image, defaults to itkwasm/emscripten -- another common image is itkwasm/wasi')
    .option('-s, --source-dir <source-directory>', 'path to source directory, defaults to "."')
    .option('-b, --build-dir <build-directory>', 'build directory whose path is relative to the source directory, defaults to "wasi-build" for the "itkwasm/wasi" image and "emscripten-build" otherwise')

  program
    .command('build')
    .usage('[-- <cmake arguments>]')
    .description('build the CMake project found in the source directory')
    .action(build)

  program
    .command('test')
    .option('-t, --test-dir <test-dir>', 'Subdirectory to run ctest in relative to the build directory.')
    .usage('[-- <ctest arguments>]')
    .description('Run the tests for the CMake project found in the build directory')
    .action(test)

  program
    .command('run <wasmBinary>')
    .addOption(new Option('-r, --runtime <wasm-runtime>', 'wasm runtime to use for execution, defaults to "wasmtime"').choices(['wasmtime', 'wasmer', 'wasm3', 'wavm']))
    .usage('[options] <wasmBinary> [-- -- <wasm binary arguments>]')
    .description('run the wasm binary, whose path is specified relative to the build directory')
    .action(run)

  program
    .command('bindgen')
    .option('-o, --output-dir <output-dir>', 'Output directory name. Defaults to the interface option value.')
    .requiredOption('-p, --package-name <package-name>', 'Output a package configuration files with the given packages name')
    .requiredOption('-d, --package-description <package-description...>', 'Description for package')
    .option('-v, --package-version <package-version>', 'Package version, e.g. "1.0.0"')
    .addOption(new Option('--interface <interface>', 'interface to generate bindings for, defaults to "typescript". "python-web-demo" support is in progress.').choices(['typescript', 'python', 'python-web-demo']))
    .option('-r, --repository <repository-url>', 'Source code repository URL')
    .option('-j, --js-module-url <js-module-url>', 'URL for the default hosted itk-wasm bindgen JS ESM module bundle. A JsDeliver is assumed by default.')
    .usage('[options]')
    .description('Generate language bindings or other interfaces for Wasm modules')
    .action(bindgen)

  program
    .command('version-sync')
    .requiredOption('-p, --package-name <package-name>', 'Assume bindgen package configuration files with the given packages name')
    .option('-o, --output-dir <output-dir>', 'Output directory name. Defaults to the interface option value.')
    .addOption(new Option('--interface <interface>', 'interface to sync version to, defaults to "python".').choices(['python']))
    .option('-t, --typescript-dir <typescript-dir>', 'Path to the typescript binding dir. Defaults to <output-dir>/../typescript.')
    .option('-m, --micromamba-binary-path <micromamba-binary-path>', 'Path to the micromamba binary. Defaults to <output-dir>/../micromamba/micromamba.')
    .option('-r, --micromamba-root-path <micromamba-root-path>', 'Path to the micromamba root. Defaults to <output-dir>/../micromamba.')
    .option('-n, --micromamba-name <micromamba-name>', 'Micromamba environnment name. Defaults to <output-dir>/../ basename.')
    .usage('[options]')
    .description('Synchronize the version in other language\'s bindings to the typescript binding version.')
    .action(versionSync)

  program
    .command('publish')
    .requiredOption('-p, --package-name <package-name>', 'Assume bindgen package configuration files with the given packages name')
    .option('-o, --output-dir <output-dir>', 'Output directory name. Defaults to the interface option value.')
    .addOption(new Option('--interface <interface>', 'interface to sync version to, defaults to "python".').choices(['python']))
    .option('-m, --micromamba-binary-path <micromamba-binary-path>', 'Path to the micromamba binary. Defaults to <output-dir>/../micromamba/micromamba.')
    .option('-r, --micromamba-root-path <micromamba-root-path>', 'Path to the micromamba root. Defaults to <output-dir>/../micromamba.')
    .option('-n, --micromamba-name <micromamba-name>', 'Micromamba environnment name. Defaults to <output-dir>/../ basename.')
    .usage('[options]')
    .description('Build and publish language\'s bindings packages.')
    .action(publish)

  program
    .command('pnpm-script <name> [extra-args...]')
    .description('Run an itk-wasm pnpm build script command. The extra-args are passed to delegated script calls.')
    .option('--wasi-docker-image <wasi-docker-image>', 'ITK-Wasm WASI Docker image name:tag.')
    .option('--emscripten-docker-image <emscripten-docker-image>', 'ITK-Wasm Emscripten Docker image name:tag.')
    .option('--typescript-output-dir <typescript-output-dir>', 'Typescript bindings directory name. Defaults to typescript.')
    .option('--python-output-dir <python-output-dir>', 'Python bindings directory name. Defaults to python.')
    .option('--typescript-package-name <typescript-package-name>', 'Typescript bindings package name.')
    .option('--python-package-name <python-package-name>', 'Python bindings dispatch package name.')
    .option('--package-description <package-description>', 'Package description.')
    .option('--repository <repository>', 'Source code repository URL.')
    .action(pnpmScript)

  await program
    .parseAsync(process.argv)
}

await main()
