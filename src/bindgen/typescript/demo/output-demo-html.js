import camelCase from '../../camel-case.js'

function outputDemoHtml(prefix, indent, parameter) {
  let result = ''
  switch(parameter.type) {
    case 'OUTPUT_TEXT_FILE':
    case 'OUTPUT_TEXT_FILE:FILE':
    case 'OUTPUT_TEXT_STREAM':
      result += `${prefix}${indent}<sl-textarea resize="auto" filled disabled name="${parameter.name}" label="${camelCase(parameter.name)}" help-text="${parameter.description}"><sl-skeleton effect="none"></sl-skeleton></sl-textarea>\n`
      result += `${prefix}${indent}<sl-button variant="neutral" outline name="${parameter.name}-download" disabled>Download</sl-button>\n`
      result += `<br /><br />\n`
      break
    case 'OUTPUT_BINARY_FILE':
    case 'OUTPUT_BINARY_FILE:FILE':
    case 'OUTPUT_BINARY_STREAM':
      result += `${prefix}${indent}<sl-textarea resize="auto" filled disabled name="${parameter.name}" label="${camelCase(parameter.name)}" help-text="${parameter.description}"><sl-skeleton effect="none"></sl-skeleton></sl-textarea>\n`
      result += `${prefix}${indent}<sl-button variant="neutral" outline name="${parameter.name}-download" disabled>Download</sl-button>\n`
      result += `<br /><br />\n`
      break
    case 'TEXT':
      result += `${prefix}${indent}<sl-textarea resize="auto" filled disabled name="${parameter.name}" label="${camelCase(parameter.name)}" help-text="${parameter.description}"></sl-textarea>\n`
      break
    case 'INT':
    case 'UINT':
      if (parameter.itemsExpected !== 1 || parameter.itemsExpectedMin !== 1 || parameter.itemsExpectedMax !== 1) {
        // TODO
        console.error(`INT items != 1 are currently not supported`)
        process.exit(1)
      }
      result += `${prefix}${indent}<sl-input disabled name="${parameter.name}" type="number" value="${parameter.default}" label="${camelCase(parameter.name)}" help-text="${parameter.description}"></sl-input>\n`
      result += `<br />\n`
      break
    case 'BOOL':
      result += `${prefix}${indent}<sl-checkbox disabled name="${parameter.name}">${camelCase(parameter.name)} - <i>${parameter.description}</i></sl-checkbox>\n`
      result += `<br /><br />\n`
      break
    case 'OUTPUT_JSON':
      result += `${prefix}${indent}<sl-tree ><sl-tree-item>${camelCase(parameter.name)} - <i>${parameter.description}</i></sl-tree-item></sl-tree>\n`
      result += `${prefix}${indent}<sl-button variant="neutral" outline name="${parameter.name}-download" disabled>${camelCase(parameter.name)}</sl-button>\n`
      result += `<br /><br />\n`
      break
    case 'OUTPUT_MESH':
      result += `${prefix}${indent}<sl-details disabled id="${parameter.name}-output" summary="${camelCase(parameter.name)}: ${parameter.description}"><sl-skeleton effect="none"></sl-skeleton></sl-details>\n`

      result += `${prefix}${indent}<sl-select id="${parameter.name}-output-format" placeholder="Format">\n`
      const formats = ['vtk', 'byu', 'fsa', 'fsb', 'obj', 'off', 'stl', 'swc'];
      formats.forEach((format) => {
        result += `${prefix}${indent}${indent}<sl-option value="${format}">${format}</sl-option>\n`
      })
      result += `${prefix}${indent}</sl-select>\n`
      result += `${prefix}${indent}<sl-button variant="neutral" outline name="${parameter.name}-download" disabled>Download</sl-button>\n`
      result += `<br /><br />\n`
      break
    default:
      console.error(`Unexpected interface type: ${parameter.type}`)
      process.exit(1)
  }
  return result
}

export default outputDemoHtml