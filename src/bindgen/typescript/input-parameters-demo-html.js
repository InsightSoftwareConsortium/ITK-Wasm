import camelCase from '../camel-case.js'

function inputParametersDemoHtml(prefix, indent, parameter, required) {
  let result = ''
  const requiredAttr = required ? 'required ' : ''
  switch(parameter.type) {
    case 'INPUT_TEXT_FILE:FILE':
    case 'INPUT_TEXT_STREAM':
      result += `${prefix}${indent}<sl-input ${requiredAttr}name="${parameter.name}" type="text" label="${camelCase(parameter.name)}" help-text="${parameter.description}"></sl-input>\n`
      result += `${prefix}${indent}<label for="${parameter.name}-file"><sl-button variant="primary" outline onclick="this.parentElement.nextElementSibling.click()">Upload</sp-button></label><input type="file" name="${parameter.name}-file" style="display: none"/>\n`
      result += `<br /><br />\n`
      break
    case 'INPUT_BINARY_FILE:FILE':
    case 'INPUT_BINARY_STREAM':
      result += `${prefix}${indent}<sl-input ${requiredAttr}name="${parameter.name}" type="text" label="${camelCase(parameter.name)}" help-text="${parameter.description}" disabled></sl-input>\n`
      result += `${prefix}${indent}<label for="${parameter.name}-file"><sl-button ${requiredAttr}variant="primary" outline onclick="this.parentElement.nextElementSibling.click()">Upload</sl-button></label><input type="file" name="${parameter.name}-file" style="display: none"/>\n`
      result += `<br /><br />\n`
      break
    case 'TEXT':
      result += `${prefix}${indent}<sl-input ${requiredAttr}name="${parameter.name}" type="text" label="${camelCase(parameter.name)}" help-text="${parameter.description}"></sl-input>\n`
      break
    case 'INT':
      if (parameter.itemsExpected !== 1 || parameter.itemsExpectedMin !== 1 || parameter.itemsExpectedMax !== 1) {
        // TODO
        console.error(`INT items != 1 are currently not supported`)
        process.exit(1)
      }
      result += `${prefix}${indent}<sl-input ${requiredAttr}name="${parameter.name}" type="number" value="${parameter.default}" label="${camelCase(parameter.name)}" help-text="${parameter.description}"></sl-input>\n`
      result += `<br />\n`
      break
    case 'BOOL':
      result += `${prefix}${indent}<sl-checkbox name="${parameter.name}">${camelCase(parameter.name)} - <i>${parameter.description}</i></sl-checkbox>\n`
      result += `<br /><br />\n`
      break
    default:
      console.error(`Unexpected interface type: ${parameter.type}`)
      process.exit(1)
  }
  return result
}

export default inputParametersDemoHtml