import allDemoTypesSupported from './all-demo-types-supported.js'
import outputDemoHtml from './output-demo-html.js'
import inputParametersDemoHtml from './input-parameters-demo-html.js'

function interfaceFunctionsDemoHtml(interfaceJson, functionName, useCamelCase) {
  let prefix = '    '
  let indent = '  '
  let result = ''

  const allTypesSupported = allDemoTypesSupported(interfaceJson)
  if (!allTypesSupported) {
    return result
  }

  result += `\n${prefix}<sl-tab-panel name="${functionName}-panel">\n`
  result += `\n${prefix}<small><i>${interfaceJson.description}</i></small><br /><br />\n`


  const inputsId = useCamelCase ? `${functionName}Inputs` : `${functionName}-inputs`
  result += `\n${prefix}<div id="${inputsId}"><form action="">\n`
  interfaceJson.inputs.forEach((input) => {
    result += inputParametersDemoHtml(functionName, prefix, indent, input, true, useCamelCase)
  })

  if (interfaceJson.parameters.length > 1) {
    interfaceJson.parameters.forEach((parameter) => {
      // Internal
      if (parameter.name === "memory-io" || parameter.name === "version") {
        return
      }
      result += inputParametersDemoHtml(functionName, prefix, indent, parameter, false, useCamelCase)
    })
  }
  interfaceJson.outputs.forEach((output) => {
    if (output.type.includes('FILE')) {
      result += inputParametersDemoHtml(functionName, prefix, indent, output, true, useCamelCase)
    }
  })

  result += `${prefix}<sl-divider></sl-divider>\n`
  const loadSampleInputsId = useCamelCase ? 'loadSampleInputs' : 'load-sample-inputs'
  result += `${prefix}  <br /><sl-tooltip content="Load example input data. This will overwrite data any existing input data."><sl-button name="${loadSampleInputsId}" variant="default" style="display: none;">Load sample inputs</sl-button></sl-tooltip>\n`
  result += `${prefix}  <sl-button type="button" variant="success" name="run">Run</sl-button><br /><br />
\n`
  result += `${prefix}</form></div>\n` // id="${functionName}Inputs"
  result += `${prefix}<sl-divider></sl-divider>\n`
  const outputsId = useCamelCase ? `${functionName}Outputs` : `${functionName}-outputs`
  result += `\n${prefix}<div id="${outputsId}">\n`
  interfaceJson.outputs.forEach((output) => {
    result += outputDemoHtml(functionName, prefix, indent, output)
  })
  result += `${prefix}</div>\n` // id="${functionName}Outputs"
  result += `\n${prefix}</sl-tab-panel>\n\n`

  return result
}

export default interfaceFunctionsDemoHtml
