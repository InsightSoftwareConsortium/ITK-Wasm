import snakeCase from '../snake-case.js'

function outputPython(functionName, prefix, indent, parameter) {
  const parameterName = snakeCase(parameter.name)
  let initResult = ''
  let methodResult = ''
  let runResult = ''

  switch (parameter.type) {
    // case 'OUTPUT_TEXT_FILE:FILE':
    // case 'OUTPUT_TEXT_STREAM':
    // result += `${indent}<sl-textarea disabled name="${parameter.name}" label="${snakeCase(parameter.name)}" help-text="${parameter.description}"></sl-textarea>\n`
    // result += `${indent}<sl-button variant="neutral" name="${parameter.name}-download">${snakeCase(parameter.name)}</sl-button>\n`
    // result += `<br /><br />\n`
    // break
    case 'OUTPUT_BINARY_FILE:FILE':
    case 'OUTPUT_BINARY_STREAM':
      initResult += `${indent}    ${parameterName}_download_element = js.document.querySelector('#${functionName}-outputs sl-button[name=${parameter.name}-download]')\n`
      initResult += `${indent}    self.${parameterName}_download_element = ${parameterName}_download_element\n`
      initResult += `${indent}    add_event_listener(${parameterName}_download_element, 'click', self.on_${parameterName}_click)\n\n`
      methodResult += `${indent}def on_${parameterName}_click(self, event):\n`
      methodResult += `${indent}    if '${parameterName}' not in self.model.outputs:\n`
      methodResult += `${indent}        return\n`
      methodResult += `${indent}    ${parameterName} = pyodide.ffi.to_js(self.model.outputs['${parameterName}'])\n`
      methodResult += `${indent}    js.globalThis.downloadFile(${parameterName}, '${parameterName}.bin')\n\n`
      runResult += `${indent}        self.model.outputs["${parameterName}"] = ${parameterName}\n`
      runResult += `${indent}        self.${parameterName}_download_element.variant = "success"\n`
      runResult += `${indent}        self.${parameterName}_download_element.disabled = False\n`
      runResult += `${indent}        ${parameterName}_element = js.document.getElementById('${functionName}-${parameter.name}-details')\n`
      runResult += `${indent}        ${parameterName}_element.innerHTML = f"<pre>{str(np.frombuffer(${parameterName}[:200], dtype=np.uint8)) + ' ...'}</pre>"\n`
      runResult += `${indent}        ${parameterName}_element.disabled = False\n`
      break
    // case 'TEXT':
    //   result += `${prefix}${indent}<sl-textarea disabled name="${parameter.name}" label="${snakeCase(parameter.name)}" help-text="${parameter.description}"></sl-textarea>\n`
    //   break
    // case 'INT':
    // case 'UINT':
    //   if (parameter.itemsExpected !== 1 || parameter.itemsExpectedMin !== 1 || parameter.itemsExpectedMax !== 1) {
    //     // TODO
    //     console.error(`INT items != 1 are currently not supported`)
    //     process.exit(1)
    //   }
    //   result += `${prefix}${indent}<sl-input disabled name="${parameter.name}" type="number" value="${parameter.default}" label="${snakeCase(parameter.name)}" help-text="${parameter.description}"></sl-input>\n`
    //   result += `<br />\n`
    //   break
    // case 'BOOL':
    //   result += `${prefix}${indent}<sl-checkbox disabled name="${parameter.name}">${snakeCase(parameter.name)} - <i>${parameter.description}</i></sl-checkbox>\n`
    //   result += `<br />\n`
    //   break
    // case 'OUTPUT_JSON':
    //   result += `${prefix}${indent}<sl-tree ><sl-tree-item>${snakeCase(parameter.name)} - <i>${parameter.description}</i></sl-tree-item></sl-tree>\n`
    //   result += `${prefix}${indent}<sl-button variant="neutral" name="${parameter.name}-download">${snakeCase(parameter.name)}</sl-button>\n`
    //   result += `<br /><br />\n`
    //   break
    default:
      console.error(
        `outputPython: Unexpected interface type: ${parameter.type}`
      )
      process.exit(1)
  }
  return { init: initResult, method: methodResult, run: runResult }
}

export default outputPython
