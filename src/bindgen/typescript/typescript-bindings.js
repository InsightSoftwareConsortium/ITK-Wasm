import fs from 'fs-extra'
import path from 'path'

import { markdownTable } from 'markdown-table'
import wasmBinaryInterfaceJson from '../wasm-binary-interface-json.js'
import interfaceJsonTypeToInterfaceType from '../interface-json-type-to-interface-type.js'
import camelCase from '../camel-case.js'

import interfaceJsonTypeToTypeScriptType from './interface-json-type-to-typescript-type.js'
import packageToBundleName from './package-to-bundle-name.js'
import writeIfOverrideNotPresent from './write-if-override-not-present.js'

import interfaceFunctionsDemoHtml from './demo/interface-functions-demo-html.js'
import interfaceFunctionsDemoTypeScript from './demo/interface-functions-demo-typescript.js'

// Array of types that will require an import from itk-wasm
const typesRequireImport = ['Image', 'Mesh', 'PolyData', 'TextFile', 'BinaryFile', 'TextFile', 'BinaryFile']

function bindgenResource(filePath) {
  return path.join(path.dirname(import.meta.url.substring(7)), 'resources', filePath)
}

function readFileIfNotInterfaceType(forNode, interfaceType, varName, indent) {
  if (forNode) {
    return `${indent}mountDirs.add(path.dirname(${varName} as string))\n`
  } else {
    if (interfaceType === 'TextFile') {

      return `${indent}let ${varName}File = ${varName}\n${indent}if (${varName} instanceof File) {\n${indent}  const ${varName}Buffer = await ${varName}.arrayBuffer()\n${indent}  ${varName}File = { path: ${varName}.name, data: new TextDecoder().decode(${varName}Buffer) }\n${indent}}\n`
    } else {
      return `${indent}let ${varName}File = ${varName}\n${indent}if (${varName} instanceof File) {\n${indent}  const ${varName}Buffer = await ${varName}.arrayBuffer()\n${indent}  ${varName}File = { path: ${varName}.name, data: new Uint8Array(${varName}Buffer) }\n${indent}}\n`
    }
  }
}

function typescriptBindings(outputDir, buildDir, wasmBinaries, options, forNode=false) {
  // index module
  let indexContent = `// Generated file. Do not edit.\n\n`
  const nodeTextKebab = forNode ? '-node' : ''
  const nodeTextCamel = forNode ? 'Node' : ''

  const srcOutputDir = path.join(outputDir, 'src')
  try {
    fs.mkdirSync(srcOutputDir, { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }

  let readmeInterface = ''
  let readmePipelines = ''
  let demoFunctionsHtml = ''
  let pipelinesFunctionsTabs = ''
  let demoFunctionsTypeScript = ''

  const packageName = options.packageName
  const bundleName = packageToBundleName(packageName)
  const packageJsonPath = path.join(outputDir, 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(bindgenResource('template.package.json')))
    packageJson.name = packageName
    packageJson.description = options.packageDescription
    packageJson.module = `./dist/bundles/${bundleName}.js`
    packageJson.exports['.'].browser = `./dist/bundles/${bundleName}.js`
    packageJson.exports['.'].node = `./dist/bundles/${bundleName}.node.js`
    packageJson.exports['.'].default = `./dist/bundles/${bundleName}.js`
    if(options.repository) {
      packageJson.repository = { 'type': 'git', 'url': options.repository }
    }
    if(options.packageVersion) {
      packageJson.version = options.packageVersion
    } else {
      packageJson.version = "0.1.0"
    }
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  } else {
    if (options.packageVersion) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath))
      packageJson.version = options.packageVersion
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    }
  }

  if (!forNode) {
    indexContent += "export * from './pipelines-base-url.js'\n"
    indexContent += "export * from './pipeline-worker-url.js'\n"
    try {
      fs.mkdirSync(path.join(outputDir, 'build'), { recursive: true })
    } catch (err) {
      if (err.code !== 'EEXIST') throw err
    }
    try {
      fs.mkdirSync(path.join(outputDir, 'test', 'browser', 'demo-app'), { recursive: true })
    } catch (err) {
      if (err.code !== 'EEXIST') throw err
    }

    const npmIgnorePath = path.join(outputDir, '.npmignore')
    if (!fs.existsSync(npmIgnorePath)) {
      fs.copyFileSync(bindgenResource('npmignore.bindgen'), npmIgnorePath)
    }

    const docsIndexPath = path.join(outputDir, 'index.html')
    if (!fs.existsSync(docsIndexPath)) {
      let docsIndexContent = fs.readFileSync(bindgenResource('index.html'), { encoding: 'utf8', flag: 'r' })
      docsIndexContent = docsIndexContent.replaceAll('<bindgenPackageName>', packageName)
      docsIndexContent = docsIndexContent.replaceAll('<bindgenPackageDescription>', options.packageDescription)
      fs.writeFileSync(docsIndexPath, docsIndexContent)
      fs.copyFileSync(bindgenResource('.nojekyll'), path.join(outputDir, '.nojekll'))
    }

    const logoPath = path.join(outputDir, 'test', 'browser', 'demo-app', 'logo.svg')
    if (!fs.existsSync(logoPath)) {
      fs.copyFileSync(bindgenResource(path.join('demo-app', 'logo.svg')), logoPath)
    }

    const demoStylePath = path.join(outputDir, 'test', 'browser', 'demo-app', 'style.css')
    if (!fs.existsSync(demoStylePath)) {
      fs.copyFileSync(bindgenResource(path.join('demo-app', 'style.css')), demoStylePath)
    }

    const rollupConfigPath = path.join(outputDir, 'build', 'rollup.browser.config.js')
    if (!fs.existsSync(rollupConfigPath)) {
      fs.copyFileSync(bindgenResource('rollup.browser.config.js'), rollupConfigPath)
    }

    const viteConfigPath = path.join(outputDir, 'build', 'vite.config.js')
    if (!fs.existsSync(viteConfigPath)) {
      fs.copyFileSync(bindgenResource('vite.config.js'), viteConfigPath)
    }
  }

  if (forNode) {
    const rollupConfigPath = path.join(outputDir, 'build', 'rollup.node.config.js')
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
    const prefix = wasmBinaryRelativePath.substring(0, wasmBinaryRelativePath.length-5)
    fs.copyFileSync(`${prefix}.js`, path.join(distPipelinesDir, `${path.basename(prefix)}.js`))
    fs.copyFileSync(`${prefix}.umd.js`, path.join(distPipelinesDir, `${path.basename(prefix)}.umd.js`))

    const { interfaceJson, parsedPath } = wasmBinaryInterfaceJson(outputDir, buildDir, wasmBinaryName)

    const moduleKebabCase = parsedPath.name
    const moduleCamelCase = camelCase(parsedPath.name)
    const modulePascalCase = `${moduleCamelCase[0].toUpperCase()}${moduleCamelCase.substring(1)}`
    const functionName = camelCase(interfaceJson.name)

    const functionDemoHtml = interfaceFunctionsDemoHtml(interfaceJson)
    if (functionDemoHtml) {
      demoFunctionsHtml += functionDemoHtml
      pipelinesFunctionsTabs += `    <sl-tab slot="nav" panel="${functionName}-panel">${functionName}</sl-tab>\n`
      const demoTypeScriptOutputPath = path.join(outputDir, 'test', 'browser', 'demo-app')
      interfaceFunctionsDemoTypeScript(packageName, interfaceJson, demoTypeScriptOutputPath)
      demoFunctionsTypeScript += `import './${interfaceJson.name}.js'\n`
    } else {
      pipelinesFunctionsTabs += `    <sl-tab slot="nav" panel="${functionName}-panel" disabled>${functionName}</sl-tab>\n`
    }

    readmeInterface += `  ${moduleCamelCase}${nodeTextCamel},\n`
    let readmeFunction = ''
    let readmeResult = ''
    let readmeOptions = ''

    // -----------------------------------------------------------------
    // Result module
    let resultContent = `interface ${modulePascalCase}${nodeTextCamel}Result {\n`
    const readmeResultTable = [ ['Property', 'Type', 'Description'], ]
    readmeResult += `\n**\`${modulePascalCase}${nodeTextCamel}Result\` interface:**\n\n`
    if (!forNode) {
      resultContent += `  /** WebWorker used for computation */\n  webWorker: Worker | null\n\n`
      readmeResultTable.push(['**webWorker**', '*Worker*', 'WebWorker used for computation'])
    }

    // track unique output types in this set
    const resultsImportTypes = new Set()

    interfaceJson.outputs.forEach((output) => {
      if (!interfaceJsonTypeToTypeScriptType.has(output.type)) {

        console.error(`Unexpected output type: ${output.type}`)
        process.exit(1)
      }
      resultContent += `  /** ${output.description} */\n`
      const outputType = interfaceJsonTypeToTypeScriptType.get(output.type)
      if(typesRequireImport.includes(outputType)) {
        resultsImportTypes.add(outputType)
      }
      resultContent += `  ${camelCase(output.name)}: ${outputType}\n\n`
      const readmeOutputArray = output.itemsExpectedMax > 1 ? "[]" : ""
      readmeResultTable.push([`\`${camelCase(output.name)}\``, `*${outputType}${readmeOutputArray}*`, output.description])
    })
    readmeResult += markdownTable(readmeResultTable, { align: ['c', 'c', 'l'] }) + '\n'

    // Insert the import statement in the beginning for the file.
    if(resultsImportTypes.size !== 0)
      resultContent = `import { ${Array.from(resultsImportTypes).join(',')} } from 'itk-wasm'\n\n` + resultContent;

    resultContent += `}\n\nexport default ${modulePascalCase}${nodeTextCamel}Result\n`
    fs.writeFileSync(path.join(srcOutputDir, `${moduleKebabCase}${nodeTextKebab}-result.ts`), resultContent)
    indexContent += `\n\nimport ${modulePascalCase}${nodeTextCamel}Result from './${moduleKebabCase}${nodeTextKebab}-result.js'\n`
    indexContent += `export type { ${modulePascalCase}${nodeTextCamel}Result }\n\n`

    // -----------------------------------------------------------------
    // Options module
    const filteredParameters = interfaceJson.parameters.filter(p => { return p.name !== 'memory-io' && p.name !== 'version'})
    const haveParameters = !!filteredParameters.length

    // track unique output types in this set
    const optionsImportTypes = new Set()

    if (haveParameters) {
      readmeOptions += `\n**\`${modulePascalCase}${nodeTextCamel}Options\` interface:**\n\n`
      const readmeOptionsTable = [ ['Property', 'Type', 'Description'], ]
      let optionsContent = ''
      let optionsInterfaceContent = `interface ${modulePascalCase}Options {\n`
      interfaceJson.parameters.forEach((parameter) => {
        if (parameter.name === 'memory-io' || parameter.name === 'version') {
          // Internal
          return
        }
        if (!interfaceJsonTypeToTypeScriptType.has(parameter.type)) {
          console.error(`Unexpected parameter type: ${parameter.type}`)
          process.exit(1)
        }
        optionsInterfaceContent += `  /** ${parameter.description} */\n`
        let parameterType = interfaceJsonTypeToTypeScriptType.get(parameter.type)
        if (typesRequireImport.includes(parameterType)) {
          optionsImportTypes.add(parameterType)
        }
        const isOptional = parameter.required ? '' : '?'
        const isArray = parameter.itemsExpectedMax > 1 ? "[]" : ""
        const fileType = forNode ? 'string' : 'File'
        if (parameterType === 'TextFile' || parameterType === 'BinaryFile') {
          parameterType = `${fileType}${isArray} | ${parameterType}${isArray}`
        } else {
          parameterType = `${parameterType}${isArray}`
        }
        optionsInterfaceContent += `  ${camelCase(parameter.name)}${isOptional}: ${parameterType}\n\n`
        readmeOptionsTable.push([`\`${camelCase(parameter.name)}\``, `*${parameterType}*`, parameter.description])
      })
      // Insert the import statement in the beginning for the file.
      if(optionsImportTypes.size !== 0) {
        optionsContent += `import { ${Array.from(optionsImportTypes).join(',')} } from 'itk-wasm'\n\n`;
      }
      optionsContent += optionsInterfaceContent
      optionsContent += `}\n\nexport default ${modulePascalCase}Options\n`
      fs.writeFileSync(path.join(srcOutputDir, `${moduleKebabCase}-options.ts`), optionsContent)

      indexContent += `import ${modulePascalCase}Options from './${moduleKebabCase}-options.js'\n`
      indexContent += `export type { ${modulePascalCase}Options }\n\n`
      readmeOptions += markdownTable(readmeOptionsTable, { align: ['c', 'c', 'l'] }) + '\n'
    }

    // -----------------------------------------------------------------
    // function module
    let functionContent = `// Generated file. Do not edit.

import {\n`
    const usedInterfaceTypes = new Set()
    const pipelineComponents = ['inputs', 'outputs', 'parameters']
    pipelineComponents.forEach((pipelineComponent) => {
      interfaceJson[pipelineComponent].forEach((value) => {
        if (interfaceJsonTypeToInterfaceType.has(value.type)) {
          const interfaceType = interfaceJsonTypeToInterfaceType.get(value.type)
          usedInterfaceTypes.add(interfaceType)
        }
      })
    })
    usedInterfaceTypes.forEach((interfaceType) => {
      if (forNode && (interfaceType === 'BinaryFile' || interfaceType === 'TextFile')) {
        return
      }
      functionContent += `  ${interfaceType},\n`
    })
    functionContent += `  InterfaceTypes,\n`
    functionContent += `  PipelineOutput,\n`
    functionContent += `  PipelineInput,\n`
    if (forNode) {
      functionContent += `  runPipelineNode\n`
    } else {
      functionContent += `  runPipeline\n`

    }
    functionContent += `} from 'itk-wasm'\n\n`
    if (haveParameters) {
      functionContent += `import ${modulePascalCase}Options from './${moduleKebabCase}-options.js'\n`
    }
    functionContent += `import ${modulePascalCase}${nodeTextCamel}Result from './${moduleKebabCase}${nodeTextKebab}-result.js'\n\n`
    if (forNode) {
      functionContent += "\nimport path from 'path'\n\n"
    } else {
      functionContent += "\nimport { getPipelinesBaseUrl } from './pipelines-base-url.js'\n\n"
      functionContent += "\nimport { getPipelineWorkerUrl } from './pipeline-worker-url.js'\n\n"
    }

    const readmeParametersTable = [['Parameter', 'Type', 'Description'],]
    functionContent += `/**\n * ${interfaceJson.description}\n *\n`
    interfaceJson.inputs.forEach((input) => {
      if (!interfaceJsonTypeToTypeScriptType.has(input.type)) {

        console.error(`Unexpected input type: ${input.type}`)
        process.exit(1)
      }
      let typescriptType = interfaceJsonTypeToTypeScriptType.get(input.type)
      const isArray = input.itemsExpectedMax > 1 ? "[]" : ""
      const fileType = forNode ? 'string' : 'File'
      if (typescriptType === 'TextFile' || typescriptType === 'BinaryFile') {
        if (forNode) {
          typescriptType = `${fileType}${isArray}`
        } else {
          typescriptType = `${fileType}${isArray} | ${typescriptType}${isArray}`
        }
      } else {
        typescriptType = `${typescriptType}${isArray}`
      }
      functionContent += ` * @param {${typescriptType}} ${camelCase(input.name)} - ${input.description}\n`
      readmeParametersTable.push([`\`${camelCase(input.name)}\``, `*${typescriptType}*`, input.description])
    })
    if (haveParameters) {
      functionContent += ` * @param {${modulePascalCase}Options} options - options object\n`
    }
    functionContent += ` *\n * @returns {Promise<${modulePascalCase}${nodeTextCamel}Result>} - result object\n`
    functionContent += ` */\n`

    readmeFunction += `\n#### ${moduleCamelCase}${nodeTextCamel}\n\n`
    let functionCall = ''
    functionCall += `async function ${moduleCamelCase}${nodeTextCamel}(\n`
    if (!forNode) {
      functionCall += '  webWorker: null | Worker,\n'

    }
    interfaceJson.inputs.forEach((input, index) => {
      let typescriptType = interfaceJsonTypeToTypeScriptType.get(input.type)
      const end = index === interfaceJson.inputs.length - 1 && !haveParameters ? `\n` : `,\n`
      const isArray = input.itemsExpectedMax > 1 ? "[]" : ""
      const fileType = forNode ? 'string' : 'File'
      if (typescriptType === 'TextFile' || typescriptType === 'BinaryFile') {
        if (forNode) {
          typescriptType = `${fileType}${isArray}`
        } else {
          typescriptType = `${fileType}${isArray} | ${typescriptType}${isArray}`
        }
      } else {
        typescriptType = `${typescriptType}${isArray}`
      }
      functionCall += `  ${camelCase(input.name)}: ${typescriptType}${end}`
    })
    if (haveParameters) {
      let requiredOptions = ""
      interfaceJson.parameters.forEach((parameter) => {
        if (parameter.required) {
          if (parameter.itemsExpectedMax > 1) {
            if (parameter.type === "FLOAT" || parameter.type === "INT") {
              requiredOptions += ` ${camelCase(parameter.name)}: [`
              for(let ii = 0; ii < parameter.itemsExpectedMin; ii++) {
                requiredOptions += `${parameter.default}, `
              }
              requiredOptions += `],`
            } else {
              const typescriptType = interfaceJsonTypeToTypeScriptType.get(parameter.type)
              let arrayType = typescriptType === 'TextFile' || typescriptType === 'BinaryFile' ? `${typescriptType}[] | string[]` : `${typescriptType}[]`
              if (forNode) {
                arrayType = typescriptType === 'TextFile' || typescriptType === 'BinaryFile' ? `string[]` : `${typescriptType}[]`

              }
              requiredOptions += ` ${camelCase(parameter.name)}: [] as ${arrayType},`
            }
          } else {
            if (parameter.type === "FLOAT" || parameter.type === "INT") {
              requiredOptions += ` ${camelCase(parameter.name)}: ${parameter.default},`
            }
          }

        }
      })
      if (requiredOptions.length > 0) {
        requiredOptions += " "
      }
      functionCall += `  options: ${modulePascalCase}Options = {${requiredOptions}}\n) : Promise<${modulePascalCase}${nodeTextCamel}Result>`

    } else {
      functionCall += `\n) : Promise<${modulePascalCase}${nodeTextCamel}Result>`
    }
    readmeFunction += `*${interfaceJson.description}*\n\n`
    readmeFunction += `\`\`\`ts\n${functionCall}\n\`\`\`\n\n`
    readmeFunction += markdownTable(readmeParametersTable, { align: ['c', 'c', 'l'] }) + '\n'
    functionContent += functionCall
    functionContent += ' {\n\n'

    if (forNode && (usedInterfaceTypes.has('BinaryFile') || usedInterfaceTypes.has('TextFile'))) {
      functionContent += '  const mountDirs: Set<string> = new Set()\n\n'
    }

    functionContent += `  const desiredOutputs: Array<PipelineOutput> = [\n`
    interfaceJson.outputs.forEach((output) => {
      if (interfaceJsonTypeToInterfaceType.has(output.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
        functionContent += `    { type: InterfaceTypes.${interfaceType} },\n`
      }
    })
    functionContent += `  ]\n`
    interfaceJson.inputs.forEach((input) => {
      if (interfaceJsonTypeToInterfaceType.has(input.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(input.type)
        if (interfaceType.includes('File')) {
          const camel = camelCase(input.name)
          functionContent += readFileIfNotInterfaceType(forNode, interfaceType, camel, '  ')
        }
      }
    })
    functionContent += `  const inputs: Array<PipelineInput> = [\n`
    interfaceJson.inputs.forEach((input) => {
      if (interfaceJsonTypeToInterfaceType.has(input.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(input.type)
        const camel = camelCase(input.name)
        if (interfaceType.includes('File')) {
          if (!forNode) {
            functionContent += `    { type: InterfaceTypes.${interfaceType}, data: ${camel}File as ${interfaceType} },\n`

          }
        } else {
          let data = camel
          if (interfaceType.includes('Stream')) {
            data = `{ data: ${camel} } `
          }
          functionContent += `    { type: InterfaceTypes.${interfaceType}, data: ${data} },\n`
        }
      }
    })
    functionContent += `  ]\n\n`

    let inputCount = 0
    functionContent += "  const args = []\n"
    functionContent += '  // ----------------------------------------------\n  // Inputs\n\n'
    interfaceJson.inputs.forEach((input) => {
      const camel = camelCase(input.name)
      if (interfaceJsonTypeToInterfaceType.has(input.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(input.type)
        let name = `  const ${camel}Name = '${inputCount.toString()}'\n`
        if (interfaceType.includes('File')) {
          if (forNode) {
            name = `  const ${camel}Name = ${camel}\n`
          } else {
            name = `  const ${camel}Name = ${camel} instanceof File ? ${camel}.name : ${camel}.path\n`
          }
        }
        functionContent += name
        functionContent += `  args.push(${camel}Name as string)\n`
        inputCount++
      } else {
        functionContent += `  args.push(${camel}.toString())\n`
      }
    })

    let outputCount = 0
    functionContent += "  // Outputs\n"
    interfaceJson.outputs.forEach((output) => {
      const camel = camelCase(output.name)
      if (interfaceJsonTypeToInterfaceType.has(output.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
        let name = `  const ${camel}Name = '${outputCount.toString()}'\n`
        if (interfaceType.includes('File')) {
          if (forNode) {
            name = `  const ${camel}Name = ${camel}\n`
          } else {
            name = `  const ${camel}Name = typeof ${camel}.path === 'undefined' ? ${camel}.name : ${camel}.path\n`
          }
        }
        functionContent += name
        functionContent += `  args.push(${camel}Name)\n`
        outputCount++
      } else {
        functionContent += `  args.push(${camel}.toString())\n`
      }
    })

    functionContent += "  // Options\n"
    functionContent += "  args.push('--memory-io')\n"
    interfaceJson.parameters.forEach((parameter) => {
      if (parameter.name === 'memory-io' || parameter.name === 'version') {
        // Internal
        return
      }
      const camel = camelCase(parameter.name)
      functionContent += `  if (typeof options.${camel} !== "undefined") {\n`
      if (parameter.type === "BOOL") {
        functionContent += `    options.${camel} && args.push('--${parameter.name}')\n`
      } else if (parameter.itemsExpectedMax > 1) {
        functionContent += `    if(options.${camel}.length < ${parameter.itemsExpectedMin}) {\n`
        functionContent += `      throw new Error('"${parameter.name}" option must have a length > ${parameter.itemsExpectedMin}')\n`
        functionContent += `    }\n`
        functionContent += `    args.push('--${parameter.name}')\n`
        if (forNode) {
          functionContent += `    options.${camel}.forEach((value) => {\n`

        } else {
          functionContent += `    options.${camel}.forEach(async (value) => {\n`

        }
        if (interfaceJsonTypeToInterfaceType.has(parameter.type)) {
          const interfaceType = interfaceJsonTypeToInterfaceType.get(parameter.type)
          if (interfaceType.includes('File')) {
            // for files
            functionContent += readFileIfNotInterfaceType(forNode, interfaceType, 'value', '      ')
            if (forNode) {
              functionContent += '      mountDirs.add(path.dirname(value as string))\n'
              functionContent += `      args.push(value as string)\n`
            } else {
              functionContent += `      inputs.push({ type: InterfaceTypes.${interfaceType}, data: valueFile })\n`
              functionContent += `      const name = value instanceof File ? value.name : (value as ${interfaceType}).path\n`

              functionContent += `      args.push(name)\n`
            }
          } else if (interfaceType.includes('Stream')) {
            // for Streams
            functionContent += `      const inputCountString = inputs.length.toString()\n`
            functionContent += `      inputs.push({ type: InterfaceTypes.${interfaceType}, data: { data: value } })\n`
            functionContent += `      args.push(inputCountString)\n`
          } else {
            // Image, Mesh, PolyData, JsonObject
            functionContent += `      const inputCountString = inputs.length.toString()\n`
            functionContent += `      inputs.push({ type: InterfaceTypes.${interfaceType}, data: value as ${interfaceType} })\n`
            functionContent += `      args.push(inputCountString)\n`
          }
        } else {
          functionContent += `      args.push(value.toString())\n`
        }
        functionContent += `    })\n`
      } else {
        if (interfaceJsonTypeToInterfaceType.has(parameter.type)) {
          const interfaceType = interfaceJsonTypeToInterfaceType.get(parameter.type)
          if (interfaceType.includes('File')) {
            // for files
            functionContent += `    const ${camel} = options.${camel}\n`
            functionContent += readFileIfNotInterfaceType(forNode, interfaceType, camel, '    ')
            functionContent += `    args.push('--${parameter.name}')\n`
            let name = `    const name = ${camel} as string\n`
            if (!forNode) {
              name = `    const name = ${camel} instanceof File ? ${camel}.name : (${camel} as ${interfaceType}).path\n`
              functionContent += `    inputs.push({ type: InterfaceTypes.${interfaceType}, data: ${camel}File as ${interfaceType} })\n`
            }
            functionContent += name
            functionContent += `    args.push(name)\n`
          } else if (interfaceType.includes('Stream')) {
            // for Streams
            functionContent += `    const inputCountString = inputs.length.toString()\n`
            functionContent += `    inputs.push({ type: InterfaceTypes.${interfaceType}, data: { data: options.${camel} } })\n`
            functionContent += `    args.push('--${parameter.name}', inputCountString)\n`
          } else {
            // Image, Mesh, PolyData, JsonObject
            functionContent += `    const inputCountString = inputs.length.toString()\n`
            functionContent += `    inputs.push({ type: InterfaceTypes.${interfaceType}, data: options.${camel} as ${interfaceType} })\n`
            functionContent += `    args.push('--${parameter.name}', inputCountString)\n`
          }
        } else {
          functionContent += `    args.push('--${parameter.name}', options.${camel}.toString())\n`
        }
      }
      functionContent += `  }\n`
    })

    const outputsVar = interfaceJson.outputs.length ? '    outputs\n' : ''
    if (forNode) {
      functionContent += `\n  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), '..', 'pipelines', '${moduleKebabCase}')\n\n`
      const mountDirsArg = usedInterfaceTypes.has('TextFile') || usedInterfaceTypes.has('BinaryFile') ? ', mountDirs' : ''
      functionContent += `  const {\n    returnValue,\n    stderr,\n${outputsVar}  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs${mountDirsArg})\n`
    } else {
      functionContent += `\n  const pipelinePath = '${moduleKebabCase}'\n\n`
      functionContent += `  const {\n    webWorker: usedWebWorker,\n    returnValue,\n    stderr,\n${outputsVar}  } = await runPipeline(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl() })\n`
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

    functionContent += `}\n\nexport default ${moduleCamelCase}${nodeTextCamel}\n`
    fs.writeFileSync(path.join(srcOutputDir, `${moduleKebabCase}${nodeTextKebab}.ts`), functionContent)
    indexContent += `import ${moduleCamelCase}${nodeTextCamel} from './${moduleKebabCase}${nodeTextKebab}.js'\n`
    indexContent += `export { ${moduleCamelCase}${nodeTextCamel} }\n`

    readmePipelines += readmeFunction
    readmePipelines += readmeOptions
    readmePipelines += readmeResult
  })

  readmeInterface += `  setPipelinesBaseUrl,
  getPipelinesBaseUrl,
  setPipelineWorkerUrl,
  getPipelineWorkerUrl,
`
  readmeInterface += `} from "${packageName}"\n\`\`\`\n`
  readmeInterface += readmePipelines

  const pipelinesBaseUrlPath = path.join(outputDir, 'src', 'pipelines-base-url.ts')
  if (!fs.existsSync(pipelinesBaseUrlPath)) {
    fs.copyFileSync(bindgenResource('pipelines-base-url.ts'), pipelinesBaseUrlPath)
    let pipelinesBaseUrlPathContent = fs.readFileSync(bindgenResource('pipelines-base-url.ts'), { encoding: 'utf8', flag: 'r' })
    pipelinesBaseUrlPathContent = pipelinesBaseUrlPathContent.replaceAll('<bindgenPackageName>', packageName)
    fs.writeFileSync(pipelinesBaseUrlPath, pipelinesBaseUrlPathContent)
  }
  const pipelineWorkerUrlPath = path.join(outputDir, 'src', 'pipeline-worker-url.ts')
  if (!fs.existsSync(pipelineWorkerUrlPath)) {
    let pipelineWorkerUrlPathContent = fs.readFileSync(bindgenResource('pipeline-worker-url.ts'), { encoding: 'utf8', flag: 'r' })
    pipelineWorkerUrlPathContent = pipelineWorkerUrlPathContent.replaceAll('<bindgenPackageName>', packageName)
    fs.writeFileSync(pipelineWorkerUrlPath, pipelineWorkerUrlPathContent)
  }

  const itkConfigPath = path.join(outputDir, 'src', 'itkConfig.js')
  if (!fs.existsSync(itkConfigPath)) {
    fs.copyFileSync(bindgenResource('itkConfig.js'), itkConfigPath)
  }

  fs.writeFileSync(path.join(srcOutputDir, `index${nodeTextKebab}.ts`), indexContent)

  if (!forNode) {
    const demoIndexPath = path.join(outputDir, 'test', 'browser', 'demo-app', 'index.html')
    let bindgenGitHubCorner = ''
    if (options.repository && options.repository.includes('github.com')) {
      bindgenGitHubCorner = `<!-- https://tholman.com/github-corners/ -->
<a href="${options.repository}" class="github-corner" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a>`
    }
    if (!fs.existsSync(demoIndexPath)) {
      let demoIndexContent = fs.readFileSync(bindgenResource(path.join('demo-app', 'index.html')), { encoding: 'utf8', flag: 'r' })
      demoIndexContent = demoIndexContent.replaceAll('@bindgenPackageName@', packageName)
      demoIndexContent = demoIndexContent.replaceAll('@bindgenPackageDescription@', options.packageDescription)
      demoIndexContent = demoIndexContent.replaceAll('@bindgenGitHubCorner@', bindgenGitHubCorner)
      demoIndexContent = demoIndexContent.replaceAll('@bindgenFunctions@', demoFunctionsHtml)
      demoIndexContent = demoIndexContent.replaceAll('@pipelinesFunctionsTabs@', pipelinesFunctionsTabs)
      fs.writeFileSync(demoIndexPath, demoIndexContent)
    }
    const demoTypeScriptPath = path.join(outputDir, 'test', 'browser', 'demo-app', 'index.ts')
    let demoTypeScriptContent = fs.readFileSync(bindgenResource(path.join('demo-app', 'index.ts')), { encoding: 'utf8', flag: 'r' })
    demoTypeScriptContent = demoTypeScriptContent.replaceAll('@bindgenBundleName@', bundleName)
    demoTypeScriptContent = demoTypeScriptContent.replaceAll('@bindgenBundleNameCamelCase@', camelCase(bundleName))
    demoTypeScriptContent = demoTypeScriptContent.replaceAll('@bindgenFunctionLogic@', demoFunctionsTypeScript)
    writeIfOverrideNotPresent(demoTypeScriptPath, demoTypeScriptContent)
  }

  return readmeInterface
}

export default typescriptBindings