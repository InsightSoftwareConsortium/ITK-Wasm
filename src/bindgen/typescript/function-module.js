import path from 'path'

import { markdownTable } from 'markdown-table'

import camelCase from '../camel-case.js'
import interfaceJsonTypeToInterfaceType from '../interface-json-type-to-interface-type.js'
import interfaceJsonTypeToTypeScriptType from './interface-json-type-to-typescript-type.js'
import writeIfOverrideNotPresent from '../write-if-override-not-present.js'

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

function functionModule (srcOutputDir, forNode, interfaceJson, modulePascalCase, moduleKebabCase, moduleCamelCase, nodeTextCamel, nodeTextKebab, haveOptions) {
  let readmeFunction = ''

  let functionContent = `import {\n`
  const usedInterfaceTypes = new Set()
  let needMountDirs = false
  const pipelineComponents = ['inputs', 'outputs', 'parameters']
  pipelineComponents.forEach((pipelineComponent) => {
    interfaceJson[pipelineComponent].forEach((value) => {
      if (interfaceJsonTypeToInterfaceType.has(value.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(value.type)
        if (interfaceType.includes('File') && forNode) {
          needMountDirs = true
          return
        }
        usedInterfaceTypes.add(interfaceType)
      }
    })
  })
  usedInterfaceTypes.forEach((interfaceType) => {
    functionContent += `  ${interfaceType},\n`
  })
  functionContent += '  InterfaceTypes,\n'
  functionContent += '  PipelineOutput,\n'
  functionContent += '  PipelineInput,\n'
  if (forNode) {
    functionContent += '  runPipelineNode\n'
  } else {
    functionContent += '  runPipeline\n'
  }
  functionContent += "} from 'itk-wasm'\n\n"
  if (haveOptions) {
    functionContent += `import ${modulePascalCase}Options from './${moduleKebabCase}-options.js'\n`
  }
  functionContent += `import ${modulePascalCase}${nodeTextCamel}Result from './${moduleKebabCase}${nodeTextKebab}-result.js'\n\n`
  if (forNode) {
    functionContent += "\nimport path from 'path'\n\n"
  } else {
    functionContent += "\nimport { getPipelinesBaseUrl } from './pipelines-base-url.js'"
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
    const isArray = input.itemsExpectedMax > 1 ? '[]' : ''
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
  if (haveOptions) {
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
    const end = index === interfaceJson.inputs.length - 1 && !haveOptions ? '\n' : ',\n'
    const isArray = input.itemsExpectedMax > 1 ? '[]' : ''
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
  if (haveOptions) {
    let requiredOptions = ''
    interfaceJson.parameters.forEach((parameter) => {
      if (parameter.required) {
        if (parameter.itemsExpectedMax > 1) {
          if (parameter.type === 'FLOAT' || parameter.type === 'INT') {
            requiredOptions += ` ${camelCase(parameter.name)}: [`
            for(let ii = 0; ii < parameter.itemsExpectedMin; ii++) {
              requiredOptions += `${parameter.default}, `
            }
            requiredOptions += '],'
          } else {
            const typescriptType = interfaceJsonTypeToTypeScriptType.get(parameter.type)
            let arrayType = typescriptType === 'TextFile' || typescriptType === 'BinaryFile' ? `${typescriptType}[] | File[] | string[]` : `${typescriptType}[]`
            if (forNode) {
              arrayType = typescriptType === 'TextFile' || typescriptType === 'BinaryFile' ? 'string[]' : `${typescriptType}[]`
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
      requiredOptions += ' '
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

  if (needMountDirs) {
    functionContent += '  const mountDirs: Set<string> = new Set()\n\n'
  }

  if (!forNode) {
    interfaceJson.outputs.forEach((output) => {
      if (interfaceJsonTypeToInterfaceType.has(output.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
        if (interfaceType.includes('File')) {
          const camel = camelCase(output.name)
          functionContent += `  const ${camel}Path = typeof options.${camel}Path === 'undefined' ? '${camel}' : options.${camel}Path\n`
        }
      }
    })
  }
  functionContent += '  const desiredOutputs: Array<PipelineOutput> = [\n'
  interfaceJson.outputs.forEach((output) => {
    if (interfaceJsonTypeToInterfaceType.has(output.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
      if (!forNode && interfaceType.includes('File')) {
        const camel = camelCase(output.name)
        const defaultData = interfaceType === 'BinaryFile' ? 'new Uint8Array()' : "''"
        functionContent += `    { type: InterfaceTypes.${interfaceType}, data: { path: ${camel}Path, data: ${defaultData} }},\n`
      } else {
        functionContent += `    { type: InterfaceTypes.${interfaceType} },\n`
      }
    }
  })
  functionContent += '  ]\n\n'
  interfaceJson.inputs.forEach((input) => {
    if (interfaceJsonTypeToInterfaceType.has(input.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(input.type)
      if (interfaceType.includes('File')) {
        const camel = camelCase(input.name)
        functionContent += readFileIfNotInterfaceType(forNode, interfaceType, camel, '  ')
      }
    }
  })
  functionContent += '  const inputs: Array<PipelineInput> = [\n'
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
        } else if (interfaceType === 'JsonObject') {
          data = `{ data: ${camel} as any } `
        }
        functionContent += `    { type: InterfaceTypes.${interfaceType}, data: ${data} },\n`
      }
    }
  })
  functionContent += '  ]\n\n'

  let inputCount = 0
  functionContent += '  const args = []\n'
  functionContent += '  // Inputs\n'
  interfaceJson.inputs.forEach((input) => {
    const camel = camelCase(input.name)
    if (interfaceJsonTypeToInterfaceType.has(input.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(input.type)
      let name = `  const ${camel}Name = '${inputCount.toString()}'\n`
      if (interfaceType.includes('File')) {
        if (forNode) {
          name = `  const ${camel}Name = ${camel}\n`
        } else {
          name = `  const ${camel}Name = (${camel}File as ${interfaceType}).path\n`
        }
      }
      functionContent += name
      functionContent += `  args.push(${camel}Name as string)\n\n`
      inputCount++
    } else {
      functionContent += `  args.push(${camel}.toString())\n\n`
    }
  })

  let outputCount = 0
  functionContent += '  // Outputs\n'
  interfaceJson.outputs.forEach((output) => {
    const camel = camelCase(output.name)
    if (interfaceJsonTypeToInterfaceType.has(output.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
      let name = `  const ${camel}Name = '${outputCount.toString()}'\n`
      if (interfaceType.includes('File')) {
        if (forNode) {
          name = `  const ${camel}Name = typeof options.${camel}Path === 'undefined' ? '${camel}' : options.${camel}Path\n`
        } else {
          name = `  const ${camel}Name = ${camel}Path\n`
        }
      }
      functionContent += name
      functionContent += `  args.push(${camel}Name)\n`
      if (forNode && interfaceType.includes('File')) {
        functionContent += `  mountDirs.add(path.dirname(${camel}Name))\n`
      }
      functionContent += '\n'
      outputCount++
    } else {
      functionContent += `  args.push(${camel}.toString())\n\n`
    }
  })

  functionContent += '  // Options\n'
  functionContent += "  args.push('--memory-io')\n"
  interfaceJson.parameters.forEach((parameter) => {
    if (parameter.name === 'memory-io' || parameter.name === 'version') {
      // Internal
      return
    }
    const camel = camelCase(parameter.name)
    functionContent += `  if (typeof options.${camel} !== "undefined") {\n`
    if (parameter.type === 'BOOL') {
      functionContent += `    options.${camel} && args.push('--${parameter.name}')\n`
    } else if (parameter.itemsExpectedMax > 1) {
      functionContent += `    if(options.${camel}.length < ${parameter.itemsExpectedMin}) {\n`
      functionContent += `      throw new Error('"${parameter.name}" option must have a length > ${parameter.itemsExpectedMin}')\n`
      functionContent += '    }\n'
      functionContent += `    args.push('--${parameter.name}')\n\n`
      if (forNode) {
        functionContent += `    options.${camel}.forEach((value) => {\n`
      } else {
        functionContent += `    await Promise.all(options.${camel}.map(async (value) => {\n`
      }
      if (interfaceJsonTypeToInterfaceType.has(parameter.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(parameter.type)
        if (interfaceType.includes('File')) {
          // for files
          functionContent += readFileIfNotInterfaceType(forNode, interfaceType, 'value', '      ')
          if (forNode) {
            functionContent += '      mountDirs.add(path.dirname(value as string))\n'
            functionContent += '      args.push(value as string)\n\n'
          } else {
            functionContent += `      inputs.push({ type: InterfaceTypes.${interfaceType}, data: valueFile as ${interfaceType} })\n`
            functionContent += `      const name = value instanceof File ? value.name : (valueFile as ${interfaceType}).path\n`

            functionContent += '      args.push(name)\n\n'
          }
        } else if (interfaceType.includes('Stream')) {
          // for Streams
          functionContent += '      const inputCountString = inputs.length.toString()\n'
          functionContent += `      inputs.push({ type: InterfaceTypes.${interfaceType}, data: { data: value } })\n`
          functionContent += '      args.push(inputCountString)\n\n'
        } else {
          // Image, Mesh, PolyData, JsonObject
          functionContent += '      const inputCountString = inputs.length.toString()\n'
          functionContent += `      inputs.push({ type: InterfaceTypes.${interfaceType}, data: value as ${interfaceType} })\n`
          functionContent += '      args.push(inputCountString)\n\n'
        }
      } else {
        functionContent += '      args.push(value.toString())\n\n'
      }
      functionContent += forNode ? '    })\n' : '    }))\n';
    } else {
      if (interfaceJsonTypeToInterfaceType.has(parameter.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(parameter.type)
        if (interfaceType.includes('File')) {
          // for files
          functionContent += `    const ${camel} = options.${camel}\n`
          functionContent += readFileIfNotInterfaceType(forNode, interfaceType, camel, '    ')
          functionContent += `    args.push('--${parameter.name}')\n\n`
          let name = `    const name = ${camel} as string\n`
          if (!forNode) {
            name = `    const name = ${camel} instanceof File ? ${camel}.name : (${camel} as ${interfaceType}).path\n`
            functionContent += `    inputs.push({ type: InterfaceTypes.${interfaceType}, data: ${camel}File as ${interfaceType} })\n`
          }
          functionContent += name
          functionContent += '    args.push(name)\n\n'
        } else if (interfaceType.includes('Stream')) {
          // for Streams
          functionContent += '    const inputCountString = inputs.length.toString()\n'
          functionContent += `    inputs.push({ type: InterfaceTypes.${interfaceType}, data: { data: options.${camel} } })\n`
          functionContent += `    args.push('--${parameter.name}', inputCountString)\n\n`
        } else {
          // Image, Mesh, PolyData, JsonObject
          functionContent += '    const inputCountString = inputs.length.toString()\n'
          functionContent += `    inputs.push({ type: InterfaceTypes.${interfaceType}, data: options.${camel} as ${interfaceType} })\n`
          functionContent += `    args.push('--${parameter.name}', inputCountString)\n\n`
        }
      } else {
        functionContent += `    args.push('--${parameter.name}', options.${camel}.toString())\n\n`
      }
    }
    functionContent += '  }\n'
  })

  const outputsVar = interfaceJson.outputs.length ? '    outputs\n' : ''
  if (forNode) {
    functionContent += `\n  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), '..', 'pipelines', '${moduleKebabCase}')\n\n`
    const mountDirsArg = needMountDirs ? ', mountDirs' : ''
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
    if (interfaceType.includes('TextStream') || interfaceType.includes('BinaryStream') || interfaceType.includes('JsonObject')) {
      functionContent += `    ${camel}: (outputs[${index.toString()}].data as ${interfaceType}).data,\n`
    } else if (forNode && interfaceType.includes('File')) {
      functionContent += `    ${camel}: outputs[${index.toString()}].data as string,\n`
    } else {
      functionContent += `    ${camel}: outputs[${index.toString()}].data as ${interfaceType},\n`
    }
  })
  functionContent += '  }\n'
  functionContent += '  return result\n'

  functionContent += `}\n\nexport default ${moduleCamelCase}${nodeTextCamel}\n`
  writeIfOverrideNotPresent(path.join(srcOutputDir, `${moduleKebabCase}${nodeTextKebab}.ts`), functionContent)

  return { readmeFunction }
}

export default functionModule
