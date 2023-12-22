import path from 'path'

import { markdownTable } from 'markdown-table'

import camelCase from '../camel-case.js'
import writeIfOverrideNotPresent from "../write-if-override-not-present.js"
import interfaceJsonTypeToTypeScriptType from './interface-json-type-to-typescript-type.js'
import typesRequireImport from './types-require-import.js'

function resultsModule (srcOutputDir, interfaceJson, forNode, modulePascalCase, nodeTextCamel, resultsModuleFileName) {
  let readmeResult = ''

  const resultExtends = forNode ? '' : ' extends WorkerPoolFunctionResult'
  let resultContent = ''
  let resultInterfaceContent = `interface ${modulePascalCase}${nodeTextCamel}Result${resultExtends} {\n`
  const readmeResultTable = [['Property', 'Type', 'Description'],]
  readmeResult += `\n**\`${modulePascalCase}${nodeTextCamel}Result\` interface:**\n\n`

  // track unique output types in this set
  const resultsImportTypes = new Set()

  interfaceJson.outputs.forEach((output) => {
    if (!interfaceJsonTypeToTypeScriptType.has(output.type)) {
      console.error(`Unexpected output type: ${output.type}`)
      process.exit(1)
    }
    resultInterfaceContent += `  /** ${output.description} */\n`
    const outputType = interfaceJsonTypeToTypeScriptType.get(output.type)
    if (outputType === 'JsonCompatible') {
      resultsImportTypes.add('JsonCompatible')
    }
    const outputArray = output.itemsExpectedMax > 1 ? '[]' : ''
    if (forNode && outputType.includes('File')) {
      // Written to disk
    } else {
      if (typesRequireImport.includes(outputType)) {
        resultsImportTypes.add(outputType)
      }
      resultInterfaceContent += `  ${camelCase(output.name)}: ${outputType}${outputArray}\n\n`
    }
    readmeResultTable.push([`\`${camelCase(output.name)}\``, `*${outputType}${outputArray}*`, output.description])
  })
  if (!forNode) {
    readmeResultTable.push(['`webWorker`', '*Worker*', 'WebWorker used for computation.'])
  }
  readmeResult += markdownTable(readmeResultTable, { align: ['c', 'c', 'l'] }) + '\n'

  // Insert the import statement in the beginning for the file.
  const workerPoolImport = forNode ? '' : ', WorkerPoolFunctionResult'
  if (resultsImportTypes.size !== 0) {
    resultContent += `import { ${Array.from(resultsImportTypes).join(', ')}${workerPoolImport} } from 'itk-wasm'\n\n` + resultContent
  } else if (!forNode) {
    resultContent += `import { WorkerPoolFunctionResult } from 'itk-wasm'\n\n`
  }

  resultContent += resultInterfaceContent
  resultContent += `}\n\nexport default ${modulePascalCase}${nodeTextCamel}Result\n`
  writeIfOverrideNotPresent(path.join(srcOutputDir, `${resultsModuleFileName}.ts`), resultContent)

  return { readmeResult }
}

export default resultsModule
