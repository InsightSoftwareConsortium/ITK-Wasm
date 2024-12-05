import path from 'path'

import { markdownTable } from 'markdown-table'

import camelCase from '../camel-case.js'
import interfaceJsonTypeToInterfaceType from '../interface-json-type-to-interface-type.js'
import interfaceJsonTypeToTypeScriptType from './interface-json-type-to-typescript-type.js'
import writeIfOverrideNotPresent from '../write-if-override-not-present.js'

function readFileIfNotInterfaceType(
  forNode,
  interfaceType,
  varName,
  indent,
  isArray
) {
  if (forNode) {
    if (isArray) {
      return `${indent}${varName}.forEach((p) => mountDirs.add(path.dirname(p) as string))\n`
    } else {
      return `${indent}mountDirs.add(path.dirname(${varName} as string))\n`
    }
  } else {
    if (interfaceType === 'TextFile') {
      if (isArray) {
        return `${indent}const ${varName}File = await Promise.all(${varName}.map(async (v) => {\n${indent}${indent}let vFile = v\n${indent}${indent}if (v instanceof File) {\n${indent}${indent}  const vBuffer = await v.arrayBuffer()\n${indent}${indent}  vFile = { path: v.name, data: new TextDecoder().decode(vBuffer) }\n${indent}${indent}}\n${indent}${indent}return vFile\n${indent}}))\n`
      } else {
        return `${indent}let ${varName}File = ${varName}\n${indent}if (${varName} instanceof File) {\n${indent}  const ${varName}Buffer = await ${varName}.arrayBuffer()\n${indent}  ${varName}File = { path: ${varName}.name, data: new TextDecoder().decode(${varName}Buffer) }\n${indent}}\n`
      }
    } else {
      if (isArray) {
        return `${indent}const ${varName}File = await Promise.all(${varName}.map(async (v) => {\n${indent}let vFile = v\n${indent}${indent}if (v instanceof File) {\n${indent}${indent}  const vBuffer = await v.arrayBuffer()\n${indent}${indent}  vFile = { path: v.name, data: new Uint8Array(vBuffer) }\n${indent}${indent}}${indent}${indent}\nreturn vFile\n${indent}}))\n`
      } else {
        return `${indent}let ${varName}File = ${varName}\n${indent}if (${varName} instanceof File) {\n${indent}  const ${varName}Buffer = await ${varName}.arrayBuffer()\n${indent}  ${varName}File = { path: ${varName}.name, data: new Uint8Array(${varName}Buffer) }\n${indent}}\n`
      }
    }
  }
}

function functionModule(
  srcOutputDir,
  forNode,
  interfaceJson,
  modulePascalCase,
  moduleKebabCase,
  moduleCamelCase,
  nodeTextCamel,
  nodeTextKebab,
  haveOptions
) {
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
        if (
          !(pipelineComponent === 'inputs' && interfaceType === 'BinaryStream')
        ) {
          usedInterfaceTypes.add(interfaceType)
        }
      }
    })
  })
  usedInterfaceTypes.forEach((interfaceType) => {
    functionContent += `  ${interfaceType},\n`
  })
  if (usedInterfaceTypes.size) {
    functionContent += '  InterfaceTypes,\n'
  }
  functionContent += '  PipelineOutput,\n'
  functionContent += '  PipelineInput,\n'
  if (forNode) {
    functionContent += '  runPipelineNode\n'
  } else {
    functionContent += '  runPipeline\n'
  }
  functionContent += "} from 'itk-wasm'\n\n"
  if (haveOptions) {
    functionContent += `import ${modulePascalCase}${nodeTextCamel}Options from './${moduleKebabCase}${nodeTextKebab}-options.js'\n`
  }
  functionContent += `import ${modulePascalCase}${nodeTextCamel}Result from './${moduleKebabCase}${nodeTextKebab}-result.js'\n\n`
  if (forNode) {
    functionContent += "import path from 'path'\n"
    functionContent += "import { fileURLToPath } from 'url'\n\n"
  } else {
    functionContent +=
      "import { getPipelinesBaseUrl } from './pipelines-base-url.js'\n"
    functionContent +=
      "import { getPipelineWorkerUrl } from './pipeline-worker-url.js'\n\n"
    functionContent +=
      "import { getDefaultWebWorker } from './default-web-worker.js'\n\n"
  }

  const readmeParametersTable = [['Parameter', 'Type', 'Description']]
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
    readmeParametersTable.push([
      `\`${camelCase(input.name)}\``,
      `*${typescriptType}*`,
      input.description
    ])
  })
  const outputFiles = interfaceJson.outputs.filter((o) => {
    return o.type.includes('FILE')
  })
  outputFiles.forEach((output) => {
    const isArray = output.itemsExpectedMax > 1 ? '[]' : ''
    const typescriptType = `string${isArray}`
    functionContent += ` * @param {${typescriptType}} ${camelCase(output.name)} - ${output.description}\n`
    readmeParametersTable.push([
      `\`${camelCase(output.name)}\``,
      `*${typescriptType.replaceAll('|', 'or')}*`,
      output.description
    ])
  })

  if (haveOptions) {
    functionContent += ` * @param {${modulePascalCase}${nodeTextCamel}Options} options - options object\n`
  }
  functionContent += ` *\n * @returns {Promise<${modulePascalCase}${nodeTextCamel}Result>} - result object\n`
  functionContent += ` */\n`

  readmeFunction += `\n#### ${moduleCamelCase}${nodeTextCamel}\n\n`
  let functionCall = ''
  functionCall += `async function ${moduleCamelCase}${nodeTextCamel}(\n`
  interfaceJson.inputs.forEach((input, index) => {
    let typescriptType = interfaceJsonTypeToTypeScriptType.get(input.type)
    const end =
      index === interfaceJson.inputs.length - 1 &&
      !haveOptions &&
      !outputFiles.length
        ? '\n'
        : ',\n'
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
  outputFiles.forEach((output, index) => {
    const end =
      index === interfaceJson.outputs.length - 1 && !haveOptions ? '\n' : ',\n'
    const isArray = output.itemsExpectedMax > 1 ? '[]' : ''
    const typescriptType = `string${isArray}`
    functionCall += `  ${camelCase(output.name)}: ${typescriptType}${end}`
  })
  if (haveOptions) {
    let requiredOptions = ''
    interfaceJson.parameters.forEach((parameter) => {
      if (parameter.required) {
        if (
          parameter.itemsExpectedMax > 1 &&
          parameter.type !== 'FLOAT' &&
          parameter.type !== 'INT' &&
          parameter.type !== 'UINT'
        ) {
          const typescriptType = interfaceJsonTypeToTypeScriptType.get(
            parameter.type
          )
          let arrayType =
            typescriptType === 'TextFile' || typescriptType === 'BinaryFile'
              ? `${typescriptType}[] | File[] | string[]`
              : `${typescriptType}[]`
          if (forNode) {
            arrayType =
              typescriptType === 'TextFile' || typescriptType === 'BinaryFile'
                ? 'string[]'
                : `${typescriptType}[]`
          }
          requiredOptions += ` ${camelCase(parameter.name)}: [] as ${arrayType},`
        } else {
          if (
            parameter.type === 'FLOAT' ||
            parameter.type === 'INT' ||
            parameter.type === 'UINT'
          ) {
            if (!parameter.default || parameter.default === '{}') {
              requiredOptions += ` ${camelCase(parameter.name)}: [] as number[],`
            } else {
              requiredOptions += ` ${camelCase(parameter.name)}: ${parameter.default},`
            }
          }
        }
      }
    })
    if (requiredOptions.length > 0) {
      requiredOptions += ' '
    }
    functionCall += `  options: ${modulePascalCase}${nodeTextCamel}Options = {${requiredOptions}}\n) : Promise<${modulePascalCase}${nodeTextCamel}Result>`
  } else {
    functionCall += `) : Promise<${modulePascalCase}${nodeTextCamel}Result>`
  }
  readmeFunction += `*${interfaceJson.description}*\n\n`
  readmeFunction += `\`\`\`ts\n${functionCall}\n\`\`\`\n\n`
  readmeFunction +=
    markdownTable(readmeParametersTable, { align: ['c', 'c', 'l'] }) + '\n'
  functionContent += functionCall
  functionContent += ' {\n\n'

  if (needMountDirs) {
    functionContent += '  const mountDirs: Set<string> = new Set()\n\n'
  }

  if (!forNode) {
    interfaceJson.outputs.forEach((output) => {
      if (interfaceJsonTypeToInterfaceType.has(output.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
        const isArray = output.itemsExpectedMax > 1
        if (interfaceType.includes('File')) {
          const camel = camelCase(output.name)
          if (isArray) {
            const defaultData =
              interfaceType === 'BinaryFile' ? 'new Uint8Array()' : "''"
            functionContent += `  const ${camel}PipelineOutputs = ${camel}.map((p) => { return { type: InterfaceTypes.${interfaceType}, data: { path: p, data: ${defaultData} }}})\n`
          }
        }
      }
    })
  }
  let haveArray = false
  functionContent += '  const desiredOutputs: Array<PipelineOutput> = [\n'
  interfaceJson.outputs.forEach((output) => {
    if (interfaceJsonTypeToInterfaceType.has(output.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
      if (!forNode && interfaceType.includes('File')) {
        const camel = camelCase(output.name)
        const defaultData =
          interfaceType === 'BinaryFile' ? 'new Uint8Array()' : "''"
        const isArray = output.itemsExpectedMax > 1
        if (isArray) {
          haveArray = true
          functionContent += `    ...${camel}PipelineOutputs,\n`
        } else {
          functionContent += `    { type: InterfaceTypes.${interfaceType}, data: { path: ${camel}, data: ${defaultData} }},\n`
        }
      } else if (!interfaceType.includes('File')) {
        functionContent += `    { type: InterfaceTypes.${interfaceType} },\n`
      }
    }
  })
  functionContent += '  ]\n\n'
  if (haveArray) {
    functionContent += `  let outputIndex = 0\n`
    interfaceJson.outputs.forEach((output) => {
      if (interfaceJsonTypeToInterfaceType.has(output.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
        if (!forNode && interfaceType.includes('File')) {
          const camel = camelCase(output.name)
          const isArray = output.itemsExpectedMax > 1
          if (isArray) {
            functionContent += `  const ${camel}Start = outputIndex\n`
            functionContent += `  outputIndex += ${camel}.length\n`
            functionContent += `  const ${camel}End = outputIndex\n`
          } else {
            functionContent += `  const ${camel}Index = outputIndex\n`
            functionContent += `  ++outputIndex\n`
          }
        } else if (!interfaceType.includes('File')) {
          functionContent += `  const ${camel}Index = outputIndex\n`
          functionContent += `  ++outputIndex\n`
        }
      }
    })
    functionContent += '\n'
  }
  interfaceJson.inputs.forEach((input) => {
    if (interfaceJsonTypeToInterfaceType.has(input.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(input.type)
      if (interfaceType.includes('File')) {
        const camel = camelCase(input.name)
        const isArray = input.itemsExpectedMax > 1
        functionContent += readFileIfNotInterfaceType(
          forNode,
          interfaceType,
          camel,
          '  ',
          isArray
        )
        if (!forNode && isArray) {
          functionContent += `  const ${camel}PipelineInputs = ${camel}File.map(i => { return { type: InterfaceTypes.${interfaceType}, data: i as ${interfaceType} }})\n`
        }
      }
    }
  })
  functionContent += '  const inputs: Array<PipelineInput> = [\n'
  interfaceJson.inputs.forEach((input) => {
    if (interfaceJsonTypeToInterfaceType.has(input.type)) {
      const interfaceType = interfaceJsonTypeToInterfaceType.get(input.type)
      const camel = camelCase(input.name)
      const isArray = input.itemsExpectedMax > 1
      if (interfaceType.includes('File')) {
        if (!forNode) {
          if (isArray) {
            functionContent += `    ...${camel}PipelineInputs,\n`
          } else {
            functionContent += `    { type: InterfaceTypes.${interfaceType}, data: ${camel}File as ${interfaceType} },\n`
          }
        }
      } else {
        let data = camel
        if (interfaceType.includes('Stream')) {
          data = `{ data: ${camel} } `
        } else if (interfaceType === 'JsonCompatible') {
          data = `${camel} as JsonCompatible `
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
      const isArray = input.itemsExpectedMax > 1
      let name = `  const ${camel}Name = '${inputCount.toString()}'\n`
      if (interfaceType.includes('File')) {
        if (isArray) {
          name = ''
        } else {
          if (forNode) {
            name = `  const ${camel}Name = ${camel}\n`
          } else {
            name = `  const ${camel}Name = (${camel}File as ${interfaceType}).path\n`
          }
        }
      }
      functionContent += name
      if (isArray) {
        if (forNode) {
          functionContent += `  ${camel}.forEach((p) => args.push(p))\n`
        } else {
          functionContent += `  ${camel}File.forEach((p) => args.push((p as ${interfaceType}).path))\n`
        }
        if (forNode && interfaceType.includes('File')) {
          functionContent += `  ${camel}.forEach((p) => mountDirs.add(path.dirname(p)))\n`
        }
      } else {
        functionContent += `  args.push(${camel}Name)\n`
        if (forNode && interfaceType.includes('File')) {
          functionContent += `  mountDirs.add(path.dirname(${camel}Name))\n`
        }
      }
      functionContent += '\n'
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
      const isArray = output.itemsExpectedMax > 1
      if (interfaceType.includes('File')) {
        if (isArray) {
          name = ''
        } else {
          name = `  const ${camel}Name = ${camel}\n`
        }
      }
      functionContent += name
      if (isArray) {
        functionContent += `  ${camel}.forEach((p) => args.push(p))\n`
        if (forNode && interfaceType.includes('File')) {
          functionContent += `  ${camel}.forEach((p) => mountDirs.add(path.dirname(p)))\n`
        }
      } else {
        functionContent += `  args.push(${camel}Name)\n`
        if (forNode && interfaceType.includes('File')) {
          functionContent += `  mountDirs.add(path.dirname(${camel}Name))\n`
        }
      }
      functionContent += '\n'
      if (!(forNode && interfaceType.includes('File'))) {
        outputCount++
      }
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
    functionContent += `  if (options.${camel}) {\n`
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
        const interfaceType = interfaceJsonTypeToInterfaceType.get(
          parameter.type
        )
        if (interfaceType.includes('File')) {
          // for files
          if (forNode) {
            functionContent += `      mountDirs.add(path.dirname(value as string))\n`
            functionContent += '      args.push(value as string)\n'
          } else {
            functionContent += readFileIfNotInterfaceType(
              forNode,
              interfaceType,
              'value',
              '      ',
              false
            )
            functionContent += `      inputs.push({ type: InterfaceTypes.${interfaceType}, data: valueFile as ${interfaceType} })\n`
            functionContent += `      const name = value instanceof File ? value.name : (valueFile as ${interfaceType}).path\n`

            functionContent += '      args.push(name)\n'
          }
        } else if (interfaceType.includes('Stream')) {
          // for Streams
          functionContent +=
            '      const inputCountString = inputs.length.toString()\n'
          functionContent += `      inputs.push({ type: InterfaceTypes.${interfaceType}, data: { data: value } })\n`
          functionContent += '      args.push(inputCountString)\n\n'
        } else {
          // Image, Mesh, PointSet, PolyData, TransformList, JsonCompatible
          functionContent +=
            '      const inputCountString = inputs.length.toString()\n'
          functionContent += `      inputs.push({ type: InterfaceTypes.${interfaceType}, data: value as ${interfaceType} })\n`
          functionContent += '      args.push(inputCountString)\n\n'
        }
      } else {
        if (parameter.type.startsWith('TEXT:{')) {
          const choices = parameter.type.split('{')[1].split('}')[0].split(',')
          functionContent += `    if (![${choices.map((c) => `'${c}'`).join(', ')}].includes(options.${camel})) {\n`
          functionContent += `      throw new Error('"${parameter.name}" option must be one of ${choices.join(', ')}')\n`
          functionContent += '    }\n'
        }
        functionContent += '      args.push(value.toString())\n'
      }
      functionContent += forNode ? '    })\n' : '    }))\n'
    } else {
      if (interfaceJsonTypeToInterfaceType.has(parameter.type)) {
        const interfaceType = interfaceJsonTypeToInterfaceType.get(
          parameter.type
        )
        if (interfaceType.includes('File')) {
          // for files
          functionContent += `    const ${camel} = options.${camel}\n`
          functionContent += readFileIfNotInterfaceType(
            forNode,
            interfaceType,
            camel,
            '    ',
            false
          )
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
          functionContent +=
            '    const inputCountString = inputs.length.toString()\n'
          functionContent += `    inputs.push({ type: InterfaceTypes.${interfaceType}, data: { data: options.${camel} } })\n`
          functionContent += `    args.push('--${parameter.name}', inputCountString)\n\n`
        } else {
          // Image, Mesh, PointSet, PolyData, TransformList, JsonCompatible
          functionContent +=
            '    const inputCountString = inputs.length.toString()\n'
          functionContent += `    inputs.push({ type: InterfaceTypes.${interfaceType}, data: options.${camel} as ${interfaceType} })\n`
          functionContent += `    args.push('--${parameter.name}', inputCountString)\n\n`
        }
      } else {
        if (parameter.type.startsWith('TEXT:{')) {
          const choices = parameter.type.split('{')[1].split('}')[0].split(',')
          functionContent += `    if (![${choices.map((c) => `'${c}'`).join(', ')}].includes(options.${camel})) {\n`
          functionContent += `      throw new Error('"${parameter.name}" option must be one of ${choices.join(', ')}')\n`
          functionContent += '    }\n'
        }
        functionContent += `    args.push('--${parameter.name}', options.${camel}.toString())\n\n`
      }
    }
    functionContent += '  }\n'
  })

  const outputsVar = interfaceJson.outputs.filter(
    (o) => !o.type.includes('FILE') || !forNode
  ).length
    ? '    outputs\n'
    : ''
  if (forNode) {
    functionContent += `\n  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', '${moduleKebabCase}')\n\n`
    const mountDirsArg = needMountDirs ? ', mountDirs' : ''
    functionContent += `  const {\n    returnValue,\n    stderr,\n${outputsVar}  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs${mountDirsArg})\n`
  } else {
    functionContent += `\n  const pipelinePath = '${moduleKebabCase}'\n\n`
    functionContent += `  let workerToUse = options?.webWorker\n  if (workerToUse === undefined) {\n    workerToUse = await getDefaultWebWorker()\n  }\n`
    functionContent += `  const {\n    webWorker: usedWebWorker,\n    returnValue,\n    stderr,\n${outputsVar}  } = await runPipeline(pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl(), webWorker: workerToUse, noCopy: options?.noCopy })\n`
  }

  functionContent +=
    '  if (returnValue !== 0 && stderr !== "") {\n    throw new Error(stderr)\n  }\n\n'

  functionContent += '  const result = {\n'
  if (!forNode) {
    functionContent += '    webWorker: usedWebWorker as Worker,\n'
  }
  outputCount = 0
  interfaceJson.outputs.forEach((output) => {
    const camel = camelCase(output.name)
    const interfaceType = interfaceJsonTypeToInterfaceType.get(output.type)
    const outputIndex = haveArray ? `${camel}Index` : outputCount.toString()
    if (
      interfaceType.includes('TextStream') ||
      interfaceType.includes('BinaryStream')
    ) {
      if (haveArray) {
        const isArray = output.itemsExpectedMax > 1
        if (isArray) {
          functionContent += `    ${camel}: (outputs.slice(${camel}Start, ${camel}End).map(o => (o?.data as ${interfaceType})?.data)),\n`
        } else {
          functionContent += `    ${camel}: (outputs[${camel}Index]?.data as ${interfaceType}).data),\n`
        }
      } else {
        functionContent += `    ${camel}: (outputs[${outputIndex}]?.data as ${interfaceType}).data,\n`
      }
    } else if (forNode && interfaceType.includes('File')) {
      // Written to disk
    } else {
      if (haveArray) {
        const isArray = output.itemsExpectedMax > 1
        if (isArray) {
          functionContent += `    ${camel}: outputs.slice(${camel}Start, ${camel}End).map(o => (o?.data as ${interfaceType})),\n`
        } else {
          functionContent += `    ${camel}: outputs[${camel}Index]?.data as ${interfaceType},\n`
        }
      } else {
        functionContent += `    ${camel}: outputs[${outputIndex}]?.data as ${interfaceType},\n`
      }
    }
    if (!(forNode && interfaceType.includes('File'))) {
      outputCount++
    }
  })
  functionContent += '  }\n'
  functionContent += '  return result\n'

  functionContent += `}\n\nexport default ${moduleCamelCase}${nodeTextCamel}\n`
  writeIfOverrideNotPresent(
    path.join(srcOutputDir, `${moduleKebabCase}${nodeTextKebab}.ts`),
    functionContent
  )

  return { readmeFunction, usedInterfaceTypes }
}

export default functionModule
