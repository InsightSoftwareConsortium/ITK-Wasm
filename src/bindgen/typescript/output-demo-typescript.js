import camelCase from "../camel-case.js"

function outputDemoTypeScript(functionName, prefix, indent, parameter) {
  const parameterName = camelCase(parameter.name)
  let result = '\n'

  switch(parameter.type) {
    // case 'OUTPUT_TEXT_FILE:FILE':
    // case 'OUTPUT_TEXT_STREAM':
      // result += `${indent}<sl-textarea disabled name="${parameter.name}" label="${camelCase(parameter.name)}" help-text="${parameter.description}"></sl-textarea>\n`
      // result += `${indent}<sl-button variant="neutral" name="${parameter.name}-download">${camelCase(parameter.name)}</sl-button>\n`
      // result += `<br /><br />\n`
      // break
    case 'OUTPUT_BINARY_FILE:FILE':
    case 'OUTPUT_BINARY_STREAM':
      result += `${prefix}${indent}const ${parameterName}OutputDownload = document.querySelector('#${functionName}Outputs sl-button[name=${parameter.name}-download]')\n`
      result += `${prefix}${indent}${parameterName}OutputDownload.addEventListener('click', (event) => {\n`
      result += `${prefix}${indent}${indent}event.preventDefault()\n`
      result += `${prefix}${indent}${indent}event.stopPropagation()\n`
      result += `${prefix}${indent}${indent}if (context.outputs.has("${parameterName}")) {\n`
      result += `${prefix}${indent}${indent}${indent}globalThis.downloadFile(context.outputs.get("${parameterName}"), "${parameterName}.bin")\n`
      result += `${prefix}${indent}${indent}}\n`
      result += `${prefix}${indent}})\n`
      break
    // case 'TEXT':
    //   result += `${prefix}${indent}<sl-textarea disabled name="${parameter.name}" label="${camelCase(parameter.name)}" help-text="${parameter.description}"></sl-textarea>\n`
    //   break
    // case 'INT':
    // case 'UINT':
    //   if (parameter.itemsExpected !== 1 || parameter.itemsExpectedMin !== 1 || parameter.itemsExpectedMax !== 1) {
    //     // TODO
    //     console.error(`INT items != 1 are currently not supported`)
    //     process.exit(1)
    //   }
    //   result += `${prefix}${indent}<sl-input disabled name="${parameter.name}" type="number" value="${parameter.default}" label="${camelCase(parameter.name)}" help-text="${parameter.description}"></sl-input>\n`
    //   result += `<br />\n`
    //   break
    // case 'BOOL':
    //   result += `${prefix}${indent}<sl-checkbox disabled name="${parameter.name}">${camelCase(parameter.name)} - <i>${parameter.description}</i></sl-checkbox>\n`
    //   result += `<br />\n`
    //   break
    // case 'OUTPUT_JSON':
    //   result += `${prefix}${indent}<sl-tree ><sl-tree-item>${camelCase(parameter.name)} - <i>${parameter.description}</i></sl-tree-item></sl-tree>\n`
    //   result += `${prefix}${indent}<sl-button variant="neutral" name="${parameter.name}-download">${camelCase(parameter.name)}</sl-button>\n`
    //   result += `<br /><br />\n`
    //   break
    default:
      console.error(`Unexpected interface type: ${parameter.type}`)
      process.exit(1)
  }
  return result
}

export default outputDemoTypeScript