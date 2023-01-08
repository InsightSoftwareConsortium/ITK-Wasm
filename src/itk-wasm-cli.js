#!/usr/bin/env node

import fs from 'fs-extra'
import path from 'path'
import { spawnSync } from 'child_process'
import { markdownTable } from 'markdown-table'

import { Command, Option } from 'commander/esm.mjs'

const program = new Command()


const defaultImageTag = '20230116-9dfa2b8a'

// Array of types that will require an import from itk-wasm
const typesRequireImport = ['Image']

function bindgenResource(filePath) {
  return path.join(path.dirname(import.meta.url.substring(7)), 'bindgen', filePath)
}

function processCommonOptions() {
  const options = program.opts()

  let sourceDir = '.'
  if (options.sourceDir) {
    sourceDir = options.sourceDir
  }

  // Check that the source directory exists and chdir to it.
  if (!fs.existsSync(sourceDir)) {
    console.error('The source directory: ' + sourceDir + ' does not exist!')
    process.exit(1)
  }
  process.chdir(sourceDir)

  let buildDir = 'emscripten-build'
  if (options.buildDir) {
    buildDir = options.buildDir
  }

  // Make the build directory to hold the dockcross script and the CMake
  // build.
  try {
    fs.mkdirSync(buildDir)
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

  let dockerImage = `itkwasm/emscripten:${defaultImageTag}`
  if (options.image) {
    dockerImage = options.image
  }

  // Ensure we have the 'dockcross' Docker build environment driver script
  const dockcrossScript = path.join(buildDir, 'itk-wasm-build-env')
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
        console.error(dockerCall.stderr.toString())
        process.exit(dockerCall.status)
      }
      fs.closeSync(output)
      fs.chmodSync(dockcrossScript, '755')
    } else {
      throw err
    }
  }

  return { dockerImage, dockcrossScript, buildDir }
}

function build(options) {
  const { buildDir, dockcrossScript } = processCommonOptions()

  const hyphenIndex = program.rawArgs.findIndex((arg) => arg === '--')
  let cmakeArgs = []
  if (hyphenIndex !== -1) {
    cmakeArgs = program.rawArgs.slice(hyphenIndex + 1)
  }
  if(process.platform === "win32"){
    var dockerBuild = spawnSync('"C:\\Program Files\\Git\\bin\\sh.exe"',
      ["--login", "-i", "-c", `"${buildDir}/itk-wasm-build-env web-build ${buildDir} ` + cmakeArgs + '"'], {
      env: process.env,
      stdio: 'inherit',
      shell: true
    });

    if (dockerBuild.status !== 0) {
      console.error(dockerBuild.error);
    }
    process.exit(dockerBuild.status);
  } else {
    const dockerBuild = spawnSync('bash', [dockcrossScript, 'web-build', buildDir].concat(cmakeArgs), {
      env: process.env,
      stdio: 'inherit'
    })
    if (dockerBuild.status !== 0) {
      console.error(dockerBuild.error);
    }
    process.exit(dockerBuild.status)
  }
}

function test(options) {
  const { buildDir, dockcrossScript } = processCommonOptions()

  const hyphenIndex = program.rawArgs.findIndex((arg) => arg === '--')
  let ctestArgs = []
  if (hyphenIndex !== -1) {
    ctestArgs = program.rawArgs.slice(hyphenIndex + 1)
  }
  if(process.platform === "win32"){
    var dockerBuild = spawnSync('"C:\\Program Files\\Git\\bin\\sh.exe"',
      ["--login", "-i", "-c", `"${buildDir}/itk-wasm-build-env ctest --test-dir ${buildDir} ` + ctestArgs + '"'], {
      env: process.env,
      stdio: 'inherit',
      shell: true
    });

    if (dockerBuild.status !== 0) {
      console.error(dockerBuild.error);
    }
    process.exit(dockerBuild.status);
  } else {
    const dockerBuild = spawnSync('bash', [dockcrossScript, 'ctest', '--test-dir', buildDir].concat(ctestArgs), {
      env: process.env,
      stdio: 'inherit'
    })
    if (dockerBuild.status !== 0) {
      console.error(dockerBuild.error);
    }
    process.exit(dockerBuild.status)
  }
}


function run(wasmBinary, options) {
  const { buildDir, dockcrossScript } = processCommonOptions()

  const hyphenIndex = program.rawArgs.findIndex((arg) => arg === '--')
  let wasmBinaryArgs = []
  if (hyphenIndex !== -1) {
    wasmBinaryArgs = program.rawArgs.slice(hyphenIndex + 1)
  }
  let wasmBinaryRelativePath = `${buildDir}/${wasmBinary}`
  if (!fs.existsSync(wasmBinaryRelativePath)) {
    wasmBinaryRelativePath = wasmBinary
  }

  let wasmRuntime = 'wasmtime'
  if (options.runtime) {
    wasmRuntime = options.runtime
  }
  let wasmRuntimeArgs = []
  switch (wasmRuntime) {
  case 'wasmtime':
    wasmRuntimeArgs = ['--args', '-e WASMTIME_BACKTRACE_DETAILS=1', '/wasi-runtimes/wasmtime/bin/wasmtime-pwd.sh',]
    break
  case 'wasmer':
    wasmRuntimeArgs = ['sudo', '/wasi-runtimes/wasmer/bin/wasmer-pwd.sh',]
    break
  case 'wasm3':
    wasmRuntimeArgs = ['/wasi-runtimes/wasm3/bin/wasm3',]
    break
  case 'wavm':
    wasmRuntimeArgs = ['/wasi-runtimes/wavm/bin/wavm', 'run']
    break
  default:
    throw Error('unexpected wasm runtime')
  }

  if(process.platform === "win32"){
    var dockerRun = spawnSync('"C:\\Program Files\\Git\\bin\\sh.exe"',
      ["--login", "-i", "-c", `"${buildDir}/itk-wasm-build-env ` + wasmRuntimeArgs + wasmBinaryRelativePath + wasmBinaryArgs + '"'], {
      env: process.env,
      stdio: 'inherit',
      shell: true
    });

    if (dockerRun.status !== 0) {
      console.error(dockerRun.error);
    }
    process.exit(dockerRun.status);
  } else {
    const dockerRun = spawnSync('bash', [dockcrossScript,].concat(wasmRuntimeArgs).concat(wasmBinaryRelativePath).concat(wasmBinaryArgs), {
      env: process.env,
      stdio: 'inherit'
    })
    if (dockerRun.status !== 0) {
      console.error(dockerRun.error);
    }
    process.exit(dockerRun.status)
  }
}

function camelCase(param) {
  // make any alphabets that follows '-' an uppercase character, and remove the corresponding hyphen
  let cameledParam = param.replace(/-([a-z])/g, (kk) => {
    return kk[1].toUpperCase();
  });

  // remove all non-alphanumeric characters
  const outParam = cameledParam.replace(/([^0-9a-z])/ig, '')

  // check if resulting string is empty
  if(outParam === '') {
    console.error(`Resulting string is empty.`)
  }
  return outParam
}

const interfaceJsonTypeToTypeScriptType = new Map([
  ['INPUT_TEXT_FILE:FILE', 'string'],
  ['OUTPUT_TEXT_FILE:FILE', 'string'],
  ['INPUT_BINARY_FILE:FILE', 'Uint8Array'],
  ['OUTPUT_BINARY_FILE:FILE', 'Uint8Array'],
  ['INPUT_TEXT_STREAM', 'string'],
  ['OUTPUT_TEXT_STREAM', 'string'],
  ['INPUT_BINARY_STREAM', 'Uint8Array'],
  ['OUTPUT_BINARY_STREAM', 'Uint8Array'],
  ['INPUT_IMAGE', 'Image'],
  ['OUTPUT_IMAGE', 'Image'],
  ['INPUT_MESH', 'Mesh'],
  ['OUTPUT_MESH', 'Mesh'],
  ['INPUT_POLYDATA', 'PolyData'],
  ['OUTPUT_POLYDATA', 'PolyData'],
  ['BOOL', 'boolean'],
  ['TEXT', 'string'],
  ['INT', 'number'],
  ['OUTPUT_JSON', 'Object'],
])

const interfaceJsonTypeToInterfaceType = new Map([
  ['INPUT_TEXT_FILE:FILE', 'TextFile'],
  ['OUTPUT_TEXT_FILE:FILE', 'TextFile'],
  ['INPUT_BINARY_FILE:FILE', 'BinaryFile'],
  ['OUTPUT_BINARY_FILE:FILE', 'BinaryFile'],
  ['INPUT_TEXT_STREAM', 'TextStream'],
  ['OUTPUT_TEXT_STREAM', 'TextStream'],
  ['INPUT_BINARY_STREAM', 'BinaryStream'],
  ['OUTPUT_BINARY_STREAM', 'BinaryStream'],
  ['INPUT_IMAGE', 'Image'],
  ['OUTPUT_IMAGE', 'Image'],
  ['INPUT_MESH', 'Mesh'],
  ['OUTPUT_MESH', 'Mesh'],
  ['INPUT_POLYDATA', 'PolyData'],
  ['OUTPUT_POLYDATA', 'PolyData'],
  ['OUTPUT_JSON', 'JsonObject'],
])

function typescriptBindings(outputDir, buildDir, wasmBinaries, options, forNode=false) {
  // index module
  let indexContent = ''
  const nodeText = forNode ? 'Node' : ''

  const srcOutputDir = path.join(outputDir, 'src')
  try {
    fs.mkdirSync(srcOutputDir, { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }

  let readmeInterface = ''
  let readmePipelines = ''

  const packageName = options.packageName
  const packageJsonPath = path.join(outputDir, 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(bindgenResource('template.package.json')))
    packageJson.name = packageName
    packageJson.description = options.packageDescription
    packageJson.module = `./dist/${packageName}.js`
    packageJson.exports['.'].browser = `./dist/${packageName}.js`
    packageJson.exports['.'].node = `./dist/${packageName}.node.js`
    packageJson.exports['.'].default = `./dist/${packageName}.js`
    if(options.repository) {
      packageJson.repository = { 'type': 'git', 'url': options.repository }
    }
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  }

  if (!forNode) {
    try {
      fs.mkdirSync(path.join(outputDir, 'dist', 'demo'), { recursive: true })
    } catch (err) {
      if (err.code !== 'EEXIST') throw err
    }

    const npmIgnorePath = path.join(outputDir, '.npmignore')
    if (!fs.existsSync(npmIgnorePath)) {
      fs.copyFileSync(bindgenResource('.npmignore'), npmIgnorePath)
    }

    const docsIndexPath = path.join(outputDir, 'index.html')
    if (!fs.existsSync(docsIndexPath)) {
      let indexContent = fs.readFileSync(bindgenResource('index.html'), { encoding: 'utf8', flag: 'r' })
      indexContent = indexContent.replaceAll('<bindgenPackageName>', packageName)
      indexContent = indexContent.replaceAll('<bindgenPackageDescription>', options.packageDescription)
      fs.writeFileSync(docsIndexPath, indexContent)
      fs.copyFileSync(bindgenResource('.nojekyll'), path.join(outputDir, '.nojekll'))
    }

    const logoPath = path.join(outputDir, 'dist', 'demo', 'logo.svg')
    if (!fs.existsSync(logoPath)) {
      fs.copyFileSync(bindgenResource('logo.svg'), logoPath)
    }

    const demoStylePath = path.join(outputDir, 'dist', 'demo', 'style.css')
    if (!fs.existsSync(demoStylePath)) {
      fs.copyFileSync(bindgenResource('demo.css'), demoStylePath)
    }

    const indexPath = path.join(outputDir, 'dist', 'index.html')
    if (!fs.existsSync(indexPath)) {
      let indexContent = fs.readFileSync(bindgenResource('dist-index.html'), { encoding: 'utf8', flag: 'r' })
      indexContent = indexContent.replaceAll('<bindgenPackageName>', packageName)
      fs.writeFileSync(indexPath, indexContent)
    }

    const demoPath = path.join(outputDir, 'dist', 'demo', 'app.js')
    if (!fs.existsSync(demoPath)) {
      let demoContent = fs.readFileSync(bindgenResource('demo.js'), { encoding: 'utf8', flag: 'r' })
      demoContent = demoContent.replaceAll('<bindgenPackageName>', options.packageName)
      demoContent = demoContent.replaceAll('<bindgenPackageNameCamelCase>', camelCase(packageName))
      fs.writeFileSync(demoPath, demoContent)
    }

    const rollupConfigPath = path.join(outputDir, 'rollup.browser.config.js')
    if (!fs.existsSync(rollupConfigPath)) {
      fs.copyFileSync(bindgenResource('rollup.browser.config.js'), rollupConfigPath)
    }
  }

  if (forNode) {
    const rollupConfigPath = path.join(outputDir, 'rollup.node.config.js')
    if (!fs.existsSync(rollupConfigPath)) {
      fs.copyFileSync(bindgenResource('rollup.node.config.js'), rollupConfigPath)
    }
  }

  const tsConfigPath = path.join(outputDir, 'tsconfig.json')
  if (!fs.existsSync(tsConfigPath)) {
    fs.copyFileSync(bindgenResource('tsconfig.json'), tsConfigPath)
  }

  wasmBinaries.forEach((wasmBinaryName) => {
    let wasmBinaryRelativePath = `${buildDir}/${wasmBinaryName}`
    if (!fs.existsSync(wasmBinaryRelativePath)) {
      wasmBinaryRelativePath = wasmBinaryName
    }

    const distPipelinesDir = path.join(outputDir, 'dist', 'pipelines')
    try {
      fs.mkdirSync(distPipelinesDir, { recursive: true })
    } catch (err) {
      if (err.code !== 'EEXIST') throw err
    }
    fs.copyFileSync(wasmBinaryRelativePath, path.join(distPipelinesDir, path.basename(wasmBinaryRelativePath)))
    const wasmBinaryBasename = path.basename(wasmBinaryRelativePath, '.wasm')
    const wasmBinaryDirname = path.dirname(wasmBinaryRelativePath)
    if (fs.existsSync(path.join(wasmBinaryDirname, `${wasmBinaryBasename}.js`))) {
      fs.copyFileSync(path.join(wasmBinaryDirname, `${wasmBinaryBasename}.js`), path.join(distPipelinesDir, `${wasmBinaryBasename}.js`))
      fs.copyFileSync(path.join(wasmBinaryDirname, `${wasmBinaryBasename}.umd.js`), path.join(distPipelinesDir, `${wasmBinaryBasename}.umd.js`))
    }

    const parsedPath = path.parse(path.resolve(wasmBinaryRelativePath))
    const runPath = path.join(parsedPath.dir, parsedPath.name)
    const runPipelineScriptPath = bindgenResource('interfaceJSONNode.js')
    const runPipelineRun = spawnSync('node', [runPipelineScriptPath, runPath], {
      env: process.env,
      stdio: ['ignore', 'pipe', 'inherit']
    })
    if (runPipelineRun.status !== 0) {
      console.error(runPipelineRun.error);
      process.exit(runPipelineRun.status)
    }
    const interfaceJson = JSON.parse(runPipelineRun.stdout.toString())

    const moduleKebabCase = parsedPath.name
    const moduleCamelCase = camelCase(parsedPath.name)
    const modulePascalCase = `${moduleCamelCase[0].toUpperCase()}${moduleCamelCase.substring(1)}`

    readmeInterface += `  ${moduleCamelCase}${nodeText},\n`
    let readmeFunction = ''
    let readmeResult = ''
    let readmeOptions = ''

    // Result module
    let resultContent = `interface ${modulePascalCase}${nodeText}Result {\n`
    const readmeResultTable = [ ['Property', 'Type', 'Description'], ]
    readmeResult += `\n**\`${modulePascalCase}${nodeText}Result\` interface:**\n\n`
    if (!forNode) {
      resultContent += `  /** WebWorker used for computation */\n  webWorker: Worker | null\n\n`
      readmeResultTable.push(['**webWorker**', '*Worker*', 'WebWorker used for computation'])
    }

    // track unique output types in this set
    const importTypes = new Set()

    interfaceJson.outputs.forEach((output) => {
      if (!interfaceJsonTypeToTypeScriptType.has(output.type)) {

        console.error(`Unexpected output type: ${output.type}`)
        process.exit(1)
      }
      resultContent += `  /** ${output.description} */\n`
      const outputType = interfaceJsonTypeToTypeScriptType.get(output.type)
      if(typesRequireImport.includes(outputType)) {
        importTypes.add(outputType)
      }
      resultContent += `  ${camelCase(output.name)}: ${outputType}\n\n`
      readmeResultTable.push([`\`${camelCase(output.name)}\``, `*${outputType}*`, output.description])
    })
    readmeResult += markdownTable(readmeResultTable, { align: ['c', 'c', 'l'] }) + '\n'

    // Insert the import statement in the beginning for the file.
    if(importTypes.size !== 0)
      resultContent = `import { ${Array.from(importTypes).join(',')} } from 'itk-wasm'\n\n` + resultContent;

    resultContent += `}\n\nexport default ${modulePascalCase}${nodeText}Result\n`
    fs.writeFileSync(path.join(srcOutputDir, `${modulePascalCase}${nodeText}Result.ts`), resultContent)
    indexContent += `\n\nimport ${modulePascalCase}${nodeText}Result from './${modulePascalCase}${nodeText}Result.js'\n`
    indexContent += `export type { ${modulePascalCase}${nodeText}Result }\n\n`

    // Options module
    const haveParameters = !!interfaceJson.parameters.length
    if (haveParameters) {
      readmeOptions += `\n**\`${modulePascalCase}${nodeText}Options\` interface:**\n\n`
      const readmeOptionsTable = [ ['Property', 'Type', 'Description'], ]
      let optionsContent = `interface ${modulePascalCase}Options {\n`
      interfaceJson.parameters.forEach((parameter) => {
        if (parameter.name === 'memory-io') {
          // Internal
          return
        }
        if (!interfaceJsonTypeToTypeScriptType.has(parameter.type)) {

          console.error(`Unexpected parameter type: ${parameter.type}`)
          process.exit(1)
        }
        optionsContent += `  /** ${parameter.description} */\n`
        const parameterType = interfaceJsonTypeToTypeScriptType.get(parameter.type)
        optionsContent += `  ${camelCase(parameter.name)}?: ${parameterType}\n\n`
        readmeOptionsTable.push([`\`${camelCase(parameter.name)}\``, `*${parameterType}*`, parameter.description])
      })
      optionsContent += `}\n\nexport default ${modulePascalCase}Options\n`
      fs.writeFileSync(path.join(srcOutputDir, `${modulePascalCase}Options.ts`), optionsContent)

      indexContent += `import ${modulePascalCase}Options from './${modulePascalCase}Options.js'\n`
      indexContent += `export type { ${modulePascalCase}Options }\n\n`
      readmeOptions += markdownTable(readmeOptionsTable, { align: ['c', 'c', 'l'] }) + '\n'
    }

    // function module
    let functionContent = 'import {\n'
    const usedInterfaceTypes = new Set()
    const pipelineComponents = ['inputs', 'outputs', 'parameters']
    pipelineComponents.forEach((pipelineComponent) => {
      interfaceJson[pipelineComponent].forEach((value) => {
        if (interfaceJsonTypeToInterfaceType.has(value.type)) {
          const interfaceType = interfaceJsonTypeToInterfaceType.get(value.type)
          if (!interfaceType.includes('File')) {
            usedInterfaceTypes.add(interfaceType)
          }
        }
      })
    })
    usedInterfaceTypes.forEach((interfaceType) => {
      functionContent += `  ${interfaceType},\n`
    })
    functionContent += `  InterfaceTypes,\n`
    functionContent += `  PipelineInput,\n`
    if (forNode) {
      functionContent += `  runPipelineNode\n`
    } else {
      functionContent += `  runPipeline\n`

    }
    functionContent += `} from 'itk-wasm'\n\n`
    if (haveParameters) {
      functionContent += `import ${modulePascalCase}Options from './${modulePascalCase}Options.js'\n`
    }
    functionContent += `import ${modulePascalCase}${nodeText}Result from './${modulePascalCase}${nodeText}Result.js'\n\n`
    if (forNode) {
      functionContent += `\nimport path from 'path'\n\n`
    }

    const readmeParametersTable = [['Parameter', 'Type', 'Description'],]
    functionContent += `/**\n * ${interfaceJson.description}\n *\n`
    interfaceJson.inputs.forEach((input) => {
      if (!interfaceJsonTypeToTypeScriptType.has(input.type)) {

        console.error(`Unexpected input type: ${input.type}`)
        process.exit(1)
      }
      const typescriptType = interfaceJsonTypeToTypeScriptType.get(input.type)
      functionContent += ` * @param {${typescriptType}} ${camelCase(input.name)} - ${input.description}\n`
      readmeParametersTable.push([`\`${camelCase(input.name)}\``, `*${typescriptType}*`, input.description])
    })
    functionContent += ` *\n * @returns {Promise<${modulePascalCase}${nodeText}Result>} - result object\n`
    functionContent += ` */\n`

    readmeFunction += `\n#### ${moduleCamelCase}${nodeText}\n\n`
    let functionCall = ''
    functionCall += `async function ${moduleCamelCase}${nodeText}(\n`
    if (!forNode) {
      functionCall += '  webWorker: null | Worker,\n'

    }
    interfaceJson.inputs.forEach((input, index) => {
      const typescriptType = interfaceJsonTypeToTypeScriptType.get(input.type)
      const end = index === interfaceJson.inputs.length - 1 && !haveParameters ? `\n` : `,\n`
      functionCall += `  ${camelCase(input.name)}: ${typescriptType}${end}`
    })
    if (haveParameters) {
      functionCall += `  options: ${modulePascalCase}Options = {}\n) : Promise<${modulePascalCase}${nodeText}Result>`

    } else {
      functionCall += `\n) : Promise<${modulePascalCase}${nodeText}Result>`
    }
    readmeFunction += `*${interfaceJson.description}*\n\n`
    readmeFunction += `\`\`\`ts\n${functionCall}\n\`\`\`\n\n`
    readmeFunction += markdownTable(readmeParametersTable, { align: ['c', 'c', 'l'] }) + '\n'
    functionContent += functionCall
    functionContent += ' {\n\n'

    functionContent += `  const desiredOutputs = [\n`
    interfaceJson.outputs.forEach((output) => {
      if (interfaceJsonTypeToInterfaceType.has(output.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
        functionContent += `    { type: InterfaceTypes.${interfaceType} },\n`
      }
    })
    functionContent += `  ]\n`
    functionContent += `  const inputs: [ PipelineInput ] = [\n`
    interfaceJson.inputs.forEach((input, index) => {
      if (interfaceJsonTypeToInterfaceType.has(input.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(input.type)
        const camel = camelCase(input.name)
        let data = camel
        if (interfaceType.includes('File')) {
          data = `{ data: ${camel}, path: "file${index.toString()}" } `
        } else if(interfaceType.includes('Stream')) {
          data = `{ data: ${camel} } `
        }
        functionContent += `    { type: InterfaceTypes.${interfaceType}, data: ${data} },\n`
      }
    })
    functionContent += `  ]\n\n`

    let inputCount = 0
    functionContent += "  const args = []\n"
    functionContent += "  // Inputs\n"
    interfaceJson.inputs.forEach((input) => {
      if (interfaceJsonTypeToInterfaceType.has(input.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(input.type)
        const name = interfaceType.includes('File') ?  `file${inputCount.toString()}` : inputCount.toString()
        functionContent += `  args.push('${name}')\n`
        inputCount++
      } else {
        const camel = camelCase(input.name)
        functionContent += `  args.push(${camel}.toString())\n`
      }
    })

    let outputCount = 0
    functionContent += "  // Outputs\n"
    interfaceJson.outputs.forEach((output) => {
      if (interfaceJsonTypeToInterfaceType.has(output.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
        const name = interfaceType.includes('File') ?  `file${outputCount.toString()}` : outputCount.toString()
        functionContent += `  args.push('${name}')\n`
        outputCount++
      } else {
        const camel = camelCase(output.name)
        functionContent += `  args.push(${camel}.toString())\n`
      }
    })

    functionContent += "  // Options\n"
    functionContent += "  args.push('--memory-io')\n"
    interfaceJson.parameters.forEach((parameter) => {
      if (parameter.name === 'memory-io') {
        // Internal
        return
      }
      const camel = camelCase(parameter.name)
      functionContent += `  if (options.${camel}) {\n`
      if (parameter.type === "BOOL") {
        functionContent += `    args.push('--${parameter.name}')\n`
      } else {
        if (interfaceJsonTypeToInterfaceType.has(parameter.type)) {
          const interfaceType = interfaceJsonTypeToInterfaceType.get(parameter.type)
          if (interfaceType.includes('File')) {
            // for files
            functionContent += `    const inputFile = 'file' + inputs.length.toString()\n`
            functionContent += `    inputs.push({ type: InterfaceTypes.${interfaceType}, data: { data: options.${camel}, path: inputFile } })\n`
            functionContent += `    args.push('--${parameter.name}', inputFile)\n`
          } else {
            // for streams
            functionContent += `    const inputCountString = inputs.length.toString()\n`
            functionContent += `    inputs.push({ type: InterfaceTypes.${interfaceType}, data: { data: options.${camel} } })\n`
            functionContent += `    args.push('--${parameter.name}', inputCountString)\n`
          }
        } else {
          functionContent += `    args.push('--${parameter.name}', options.${camel}.toString())\n`
        }
      }
      functionContent += `  }\n`
    })

    if (forNode) {
      functionContent += `\n  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), 'pipelines', '${moduleKebabCase}')\n\n`
      functionContent += `  const {\n    returnValue,\n    stderr,\n    outputs\n  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)\n`
    } else {
      functionContent += `\n  const pipelinePath = '${moduleKebabCase}'\n\n`
      functionContent += `  const {\n    webWorker: usedWebWorker,\n    returnValue,\n    stderr,\n    outputs\n  } = await runPipeline(webWorker, pipelinePath, args, desiredOutputs, inputs)\n`
    }

    functionContent += '  if (returnValue !== 0) {\n    throw new Error(stderr)\n  }\n\n'

    functionContent += '  const result = {\n'
    if (!forNode) {
      functionContent += '    webWorker: usedWebWorker as Worker,\n'
    }
    interfaceJson.outputs.forEach((output, index) => {
      const camel = camelCase(output.name)
      const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
      if (interfaceType.includes('Text') || interfaceType.includes('Binary') || interfaceType.includes('JsonObject')) {
        functionContent += `    ${camel}: (outputs[${index.toString()}].data as ${interfaceType}).data,\n`
      } else {
        functionContent += `    ${camel}: outputs[${index.toString()}].data as ${interfaceType},\n`
      }
    })
    functionContent += '  }\n'
    functionContent += '  return result\n'

    functionContent += `}\n\nexport default ${moduleCamelCase}${nodeText}\n`
    fs.writeFileSync(path.join(srcOutputDir, `${moduleCamelCase}${nodeText}.ts`), functionContent)
    indexContent += `import ${moduleCamelCase}${nodeText} from './${moduleCamelCase}${nodeText}.js'\n`
    indexContent += `export { ${moduleCamelCase}${nodeText} }\n`

    readmePipelines += readmeFunction
    readmePipelines += readmeOptions
    readmePipelines += readmeResult
  })

  readmeInterface += `} from "${packageName}"\n\`\`\`\n`
  readmeInterface += readmePipelines
  fs.writeFileSync(path.join(srcOutputDir, `index${nodeText}.ts`), indexContent)
  return readmeInterface
}


function bindgen(wasmBinaries, options) {
  const { buildDir } = processCommonOptions()

  const language = options.language ?? 'typescript'
  const outputDir = options.outputDir ?? language

  try {
    fs.mkdirSync(outputDir, { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }

  // Building for emscripten can generate duplicate .umd.wasm and .wasm binaries
  let filteredWasmBinaries = wasmBinaries.filter(binary => !binary.endsWith('.umd.wasm'))

  switch (language) {
    case 'typescript': {
      let readme = ''
      const packageName = options.packageName
      readme += `# ${packageName}\n`
      readme += `\n[![npm version](https://badge.fury.io/js/${packageName}.svg)](https://www.npmjs.com/package/${packageName})\n`
      readme += `\n${options.packageDescription}\n`
      readme += `\n## Installation\n
\`\`\`sh
npm install ${packageName}
\`\`\`
`

      let readmeUsage = '\n## Usage\n'
      let readmeBrowserInterface = '\n### Browser interface\n\nImport:\n\n```js\nimport {\n'
      let readmeNodeInterface = '\n### Node interface\n\nImport:\n\n```js\nimport {\n'

      readmeBrowserInterface += typescriptBindings(outputDir, buildDir, filteredWasmBinaries, options, false)
      readmeNodeInterface += typescriptBindings(outputDir, buildDir, filteredWasmBinaries, options, true)
      readme += readmeUsage
      readme += readmeBrowserInterface
      readme += readmeNodeInterface

      const readmePath = path.join(outputDir, 'README.md')
      if (!fs.existsSync(readmePath)) {
        fs.writeFileSync(readmePath, readme)
      }
    }
    break
  }

  process.exit(0)
}

program
  .option('-i, --image <image>', 'build environment Docker image, defaults to itkwasm/emscripten')
  .option('-s, --source-dir <source-directory>', 'path to source directory, defaults to "."')
  .option('-b, --build-dir <build-directory>', 'build directory whose path is relative to the source directory, defaults to "emscripten-build"')
program
  .command('build')
  .usage('[-- <cmake arguments>]')
  .description('build the CMake project found in the source directory')
  .action(build)
program
  .command('test')
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
  .command('bindgen [wasmBinaries...]')
  .option('-o, --output-dir <output-dir>', 'Output directory name. Defaults to the language option value.')
  .requiredOption('-p, --package-name <package-name>', 'Output a package configuration files with the given packages name')
  .requiredOption('-d, --package-description <package-description>', 'Description for package')
  .addOption(new Option('-l, --language <language>', 'language to generate bindings for, defaults to "typescript"').choices(['typescript',]))
  .option('-r, --repository <repository-url>', 'Source code repository URL')
  .usage('[options] [wasmBinaries...]')
  .description('Generate WASM module bindings for a language')
  .action(bindgen)

program
  .parse(process.argv)

program.help()
