import path from 'path'

import { markdownTable } from 'markdown-table'

import interfaceJsonTypeToTypeScriptType from './interface-json-type-to-typescript-type.js'
import typesRequireImport from './types-require-import.js'
import camelCase from '../camel-case.js'
import canonicalType from '../canonical-type.js'
import writeIfOverrideNotPresent from '../write-if-override-not-present.js'

function optionsModule (srcOutputDir, interfaceJson, modulePascalCase, nodeTextCamel, moduleKebabCase, haveOptions) {
  let readmeOptions = ''
  if (!haveOptions) {
    return { readmeOptions }
  }

  // track unique output types in this set
  const optionsImportTypes = new Set()

  readmeOptions += `\n**\`${modulePascalCase}${nodeTextCamel}Options\` interface:**\n\n`
  const readmeOptionsTable = [['Property', 'Type', 'Description'],]

  let optionsContent = ''
  let optionsInterfaceContent = `interface ${modulePascalCase}Options {\n`
  interfaceJson.parameters.forEach((parameter) => {
    if (parameter.name === 'memory-io' || parameter.name === 'version') {
      // Internal
      return
    }

    const canonical = canonicalType(parameter.type)
    if (!interfaceJsonTypeToTypeScriptType.has(canonical)) {
      console.error(`Unexpected parameter type: ${canonical}`)
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

  const outputFiles = interfaceJson.outputs.filter(o => { return o.type.includes('FILE') })
  outputFiles.forEach((output) => {
    const outputDescription = `${output.description} path`
    optionsInterfaceContent += `  /** ${outputDescription} */\n`
    const isArray = output.itemsExpectedMax > 1 ? '[]' : ''
    const parameterType = `string${isArray}`
    const optionName = `${output.name}-path`
    optionsInterfaceContent += `  ${camelCase(optionName)}?: ${parameterType}\n\n`
    readmeOptionsTable.push([`\`${camelCase(optionName)}\``, `*${parameterType}*`, outputDescription])
  })

  // Insert the import statement in the beginning for the file.
  if (optionsImportTypes.size !== 0) {
    optionsContent += `import { ${Array.from(optionsImportTypes).join(',')} } from 'itk-wasm'\n\n`
  }
  optionsContent += optionsInterfaceContent
  optionsContent += `}\n\nexport default ${modulePascalCase}Options\n`
  writeIfOverrideNotPresent(path.join(srcOutputDir, `${moduleKebabCase}-options.ts`), optionsContent)

  readmeOptions += markdownTable(readmeOptionsTable, { align: ['c', 'c', 'l'] }) + '\n'

  return { readmeOptions }
}

export default optionsModule
