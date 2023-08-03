import camelCase from '../../camel-case.js'
import snakeCase from '../../snake-case.js'

function inputParametersDemoHtml(prefix, indent, parameter, required, useCamelCase) {
  let result = ''
  const description = parameter.description.replaceAll('"', '&quot;')
  const requiredAttr = required ? 'required ' : ''
  const label = useCamelCase ? camelCase(parameter.name) : snakeCase(parameter.name)
  switch(parameter.type) {
    case 'INPUT_TEXT_FILE':
    case 'INPUT_TEXT_FILE:FILE':
    case 'INPUT_TEXT_STREAM':
      result += `${prefix}${indent}<sl-input ${requiredAttr}name="${parameter.name}" type="text" label="${label}" help-text="${description}" disabled></sl-input>\n`
      result += `${prefix}${indent}<label for="${parameter.name}-file"><sl-button name="${parameter.name}-file-button" variant="primary" outline onclick="this.parentElement.nextElementSibling.click()">Upload</sp-button></label><input type="file" name="${parameter.name}-file" style="display: none"/>\n`
      result += `<br /><br />\n`
      break
    case 'INPUT_BINARY_FILE':
    case 'INPUT_BINARY_FILE:FILE':
    case 'INPUT_BINARY_STREAM':
      result += `${prefix}${indent}<sl-input ${requiredAttr}name="${parameter.name}" type="text" label="${label}" help-text="${description}" disabled></sl-input>\n`
      result += `${prefix}${indent}<label for="${parameter.name}-file"><sl-button name="${parameter.name}-file-button" ${requiredAttr}variant="primary" outline onclick="this.parentElement.nextElementSibling.click()">Upload</sl-button></label><input type="file" name="${parameter.name}-file" style="display: none"/>\n`
      result += `<br /><br />\n`
      break
    case 'TEXT':
      result += `${prefix}${indent}<sl-input ${requiredAttr}name="${parameter.name}" type="text" label="${label}" help-text="${description}"></sl-input>\n`
      break
    case 'INT':
      if (parameter.itemsExpected !== 1 || parameter.itemsExpectedMin !== 1 || parameter.itemsExpectedMax !== 1) {
        // TODO
        console.error(`INT items != 1 are currently not supported`)
        process.exit(1)
      }
      result += `${prefix}${indent}<sl-input ${requiredAttr}name="${parameter.name}" type="number" value="${parameter.default}" label="${label}" help-text="${description}"></sl-input>\n`
      result += `<br />\n`
      break
    case 'BOOL':
      result += `${prefix}${indent}<sl-checkbox name="${parameter.name}">${label} - <i>${description}</i></sl-checkbox>\n`
      result += `<br /><br />\n`
      break
    case 'INPUT_JSON':
    case 'INPUT_IMAGE':
    case 'INPUT_MESH':
      result += `${prefix}${indent}<sl-details id="${parameter.name}-input" summary="${label}: ${description}" disabled></sl-details>\n`
      result += `${prefix}${indent}<label for="${parameter.name}-file"><sl-button name="${parameter.name}-file-button" variant="primary" outline onclick="this.parentElement.nextElementSibling.click()">Upload</sp-button></label><input type="file" name="${parameter.name}-file" style="display: none"/>\n`
      result += `<br /><br />\n`
      break
    default:
      console.error(`Unexpected interface type: ${parameter.type}`)
      process.exit(1)
  }
  return result
}

export default inputParametersDemoHtml