import camelCase from "../camel-case.js"

function outputDemoRunTypeScript(functionName, prefix, indent, parameter) {
  const parameterName = camelCase(parameter.name)
  let result = `\n${prefix}${indent}context.outputs.set("${parameterName}", ${parameterName})\n`

  switch(parameter.type) {
    // case 'OUTPUT_TEXT_FILE:FILE':
    // case 'OUTPUT_TEXT_STREAM':
      // result += `${indent}<sl-textarea disabled name="${parameter.name}" label="${camelCase(parameter.name)}" help-text="${parameter.description}"></sl-textarea>\n`
      // result += `${indent}<sl-button variant="neutral" name="${parameter.name}-download">${camelCase(parameter.name)}</sl-button>\n`
      // result += `<br /><br />\n`
      // break
    case 'OUTPUT_BINARY_FILE:FILE':
    case 'OUTPUT_BINARY_STREAM':
      result += `${prefix}${indent}${parameterName}OutputDownload.variant = "success"\n`
      result += `${prefix}${indent}${parameterName}OutputDownload.disabled = false\n`
      result += `${prefix}${indent}const ${parameterName}Output = document.querySelector('#${functionName}Outputs sl-textarea[name=${parameter.name}]')\n`
      result += `${prefix}${indent}${parameterName}Output.value = ${parameterName}.toString().substring(0, 200) + ' ...'\n`
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

export default outputDemoRunTypeScript