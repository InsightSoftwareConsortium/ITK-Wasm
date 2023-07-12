import allDemoTypesSupported from './all-demo-types-supported.js'
import outputDemoHtml from './output-demo-html.js'
import inputParametersDemoHtml from './input-parameters-demo-html.js'
import camelCase from '../../camel-case.js'

function interfaceFunctionsDemoHtml(interfaceJson) {
  let prefix = '    '
  let indent = '  '
  let result = ''

  const allTypesSupported = allDemoTypesSupported(interfaceJson)
  if (!allTypesSupported) {
    return result
  }

  const nameCamelCase = camelCase(interfaceJson.name)
  result += `\n${prefix}<sl-tab-panel name="${nameCamelCase}-panel">\n`
  result += `\n${prefix}<small><i>${interfaceJson.description}</i></small><br /><br />\n`

  result += `\n${prefix}<div id="${nameCamelCase}Inputs"><form>\n`
  interfaceJson.inputs.forEach((input) => {
    result += inputParametersDemoHtml(prefix, indent, input, true)
  })

  if (interfaceJson.parameters.length > 1) {
    interfaceJson.parameters.forEach((parameter) => {
      // Internal
      if (parameter.name === "memory-io" || parameter.name === "version") {
        return
      }
      result += inputParametersDemoHtml(prefix, indent, parameter, false)
    })
  }

  result += `${prefix}<sl-divider></sl-divider>\n`
  result += `${prefix}  <br /><sl-button name="loadSampleInputs" variant="default" style="display: none;">Load sample inputs</sl-button>\n`
  result += `${prefix}  <sl-button type="submit" variant="success">Run</sl-button>\n`
  result += `${prefix}  <br /><br /><sl-progress-bar value="0" style="visibility: hidden;"></sl-progress-bar>`
  result += `${prefix}</form></div>\n` // id="${nameCamelCase}Inputs"
  result += `${prefix}<sl-divider></sl-divider>\n`
  result += `\n${prefix}<div id="${nameCamelCase}Outputs">\n`
  interfaceJson.outputs.forEach((output) => {
    result += outputDemoHtml(prefix, indent, output)
  })
  result += `${prefix}</div>\n` // id="${nameCamelCase}Outputs"
  result += `\n${prefix}</sl-tab-panel>\n\n`

  return result
}

export default interfaceFunctionsDemoHtml