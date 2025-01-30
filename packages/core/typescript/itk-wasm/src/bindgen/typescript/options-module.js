import path from 'path'

import { markdownTable } from 'markdown-table'

import interfaceJsonTypeToTypeScriptType from './interface-json-type-to-typescript-type.js'
import typesRequireImport from './types-require-import.js'
import camelCase from '../camel-case.js'
import canonicalType from '../canonical-type.js'
import writeIfOverrideNotPresent from '../write-if-override-not-present.js'

function optionsModule (srcOutputDir, interfaceJson, modulePascalCase, nodeTextCamel, haveOptions, forNode, optionsModuleFileName) {
  let readmeOptions = ''
  if (!haveOptions) {
    return { readmeOptions }
  }

  // track unique output types in this set
  const optionsImportTypes = new Set()

  readmeOptions += `\n**\`${modulePascalCase}${nodeTextCamel}Options\` interface:**\n\n`
  const readmeOptionsTable = [['Property', 'Type', 'Description'],]

  let optionsContent = ''
  const optionsExtends = forNode ? '' : ' extends WorkerPoolFunctionOption'
  let optionsInterfaceContent = `interface ${modulePascalCase}${nodeTextCamel}Options${optionsExtends} {\n`
  interfaceJson.parameters.forEach((parameter) => {
    if (parameter.name === 'memory-io' || parameter.name === 'version') {
      // Internal
      return
    }

    const canonical = canonicalType(parameter.type)
    if (!interfaceJsonTypeToTypeScriptType.has(canonical)) {
      console.error(`typescript/options-module: Unexpected parameter type: ${canonical}`)
      process.exit(1)
    }
    optionsInterfaceContent += `  /** ${parameter.description} */\n`
    let parameterType = interfaceJsonTypeToTypeScriptType.get(canonical)
    if (typesRequireImport.includes(parameterType)) {
      optionsImportTypes.add(parameterType)
    }
    const isOptional = parameter.required ? '' : '?'
    const isArray = parameter.itemsExpectedMax > 1 ? '[]' : ''
    if (parameterType === 'TextFile' || parameterType === 'BinaryFile') {
      parameterType = `string${isArray} | File${isArray} | ${parameterType}${isArray}`
    } else {
      parameterType = `${parameterType}${isArray}`
    }
    optionsInterfaceContent += `  ${camelCase(parameter.name)}${isOptional}: ${parameterType}\n\n`
    readmeOptionsTable.push([`\`${camelCase(parameter.name)}\``, `*${parameterType}*`, parameter.description])
  })

  if (!forNode) {
    readmeOptionsTable.push(['`webWorker`', '*null or Worker or boolean*', 'WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker.'])
    readmeOptionsTable.push(['`noCopy`', '*boolean*', 'When SharedArrayBuffer\'s are not available, do not copy inputs.'])
  }

  // Insert the import statement in the beginning for the file.
  const workerPoolImport = forNode ? '' : ', WorkerPoolFunctionOption'
  if (optionsImportTypes.size !== 0) {
    optionsContent += `import { ${Array.from(optionsImportTypes).join(',')}${workerPoolImport} } from 'itk-wasm'\n\n`
  } else if(!forNode) {
    optionsContent += `import { WorkerPoolFunctionOption } from 'itk-wasm'\n\n`
  }
  optionsContent += optionsInterfaceContent
  optionsContent += `}\n\nexport default ${modulePascalCase}${nodeTextCamel}Options\n`
  writeIfOverrideNotPresent(path.join(srcOutputDir, `${optionsModuleFileName}.ts`), optionsContent)

  readmeOptions += markdownTable(readmeOptionsTable, { align: ['c', 'c', 'l'] }) + '\n'

  return { readmeOptions }
}

export default optionsModule
