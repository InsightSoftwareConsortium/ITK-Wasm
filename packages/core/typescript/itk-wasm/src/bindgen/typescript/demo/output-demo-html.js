import camelCase from '../../camel-case.js'

function outputDemoHtml(functionName, prefix, indent, parameter) {
  let result = ''
  const description = parameter.description.replaceAll('"', '&quot;')
  const parameterType = parameter.type.split(' ')[0].split(':')[0]
  switch (parameterType) {
    case 'OUTPUT_TEXT_FILE':
    case 'OUTPUT_TEXT_STREAM':
      result += `${prefix}${indent}<sl-details disabled id="${functionName}-${parameter.name}-details" summary="${camelCase(parameter.name)}: ${description}"></sl-details>\n`
      result += `${prefix}${indent}<sl-button variant="neutral" outline name="${parameter.name}-download" disabled>Download</sl-button>\n`
      result += `<br /><br />\n`
      break
    case 'OUTPUT_BINARY_FILE':
    case 'OUTPUT_BINARY_STREAM':
      result += `${prefix}${indent}<sl-details disabled id="${functionName}-${parameter.name}-details" summary="${camelCase(parameter.name)}: ${description}"></sl-details>\n`
      result += `${prefix}${indent}<sl-button variant="neutral" outline name="${parameter.name}-download" disabled>Download</sl-button>\n`
      result += `<br /><br />\n`
      break
    case 'TEXT':
      result += `${prefix}${indent}<sl-textarea resize="auto" filled disabled name="${parameter.name}" label="${camelCase(parameter.name)}" help-text="${description}"></sl-textarea>\n`
      break
    case 'INT':
    case 'UINT':
      if (
        parameter.itemsExpected !== 1 ||
        parameter.itemsExpectedMin !== 1 ||
        parameter.itemsExpectedMax !== 1
      ) {
        // TODO
        console.error(`INT items != 1 are currently not supported`)
        process.exit(1)
      }
      result += `${prefix}${indent}<sl-input disabled name="${parameter.name}" type="number" value="${parameter.default}" label="${camelCase(parameter.name)}" help-text="${description}"></sl-input>\n`
      result += `<br />\n`
      break
    case 'BOOL':
      result += `${prefix}${indent}<sl-checkbox disabled name="${parameter.name}">${camelCase(parameter.name)} - <i>${description}</i></sl-checkbox>\n`
      result += `<br /><br />\n`
      break
    case 'OUTPUT_JSON':
      result += `${prefix}${indent}<sl-details disabled id="${functionName}-${parameter.name}-details" summary="${camelCase(parameter.name)}: ${description}"></sl-details>\n`
      result += `${prefix}${indent}<sl-button variant="neutral" outline name="${parameter.name}-download" disabled>Download</sl-button>\n`
      result += `<br /><br />\n`
      break
    case 'OUTPUT_IMAGE':
      {
        result += `${prefix}${indent}<itk-image-details disabled id="${functionName}-${parameter.name}-details" summary="${camelCase(parameter.name)}: ${description}"></itk-image-details>\n`
        result += `${prefix}${indent}<sl-select id="${functionName}-${parameter.name}-output-format" placeholder="Format">\n`
        const formats = [
          'bmp',
          'dcm',
          'gipl',
          'hdf5',
          'jpg',
          'lsm',
          'mnc',
          'mnc.gz',
          'mgh',
          'mha',
          'mrc',
          'nii',
          'nii.gz',
          'png',
          'nrrd',
          'png',
          'pic',
          'tif',
          'isq',
          'fdf',
          'vtk'
        ]
        formats.forEach((format) => {
          result += `${prefix}${indent}${indent}<sl-option value="${format}">${format}</sl-option>\n`
        })
        result += `${prefix}${indent}</sl-select>\n`
        result += `${prefix}${indent}<sl-button variant="neutral" outline name="${parameter.name}-download" disabled>Download</sl-button>\n`
        result += `<br /><br />\n`
      }
      break
    case 'OUTPUT_MESH':
    case 'OUTPUT_POINT_SET':
      {
        result += `${prefix}${indent}<sl-details disabled id="${functionName}-${parameter.name}-details" summary="${camelCase(parameter.name)}: ${description}"></sl-details>\n`

        result += `${prefix}${indent}<sl-select id="${functionName}-${parameter.name}-output-format" placeholder="Format">\n`
        const formats =
          parameterType === 'OUTPUT_MESH'
            ? ['vtk', 'byu', 'fsa', 'fsb', 'obj', 'off', 'stl', 'swc']
            : ['vtk', 'obj', 'off']
        formats.forEach((format) => {
          result += `${prefix}${indent}${indent}<sl-option value="${format}">${format}</sl-option>\n`
        })
        result += `${prefix}${indent}</sl-select>\n`
        result += `${prefix}${indent}<sl-button variant="neutral" outline name="${parameter.name}-download" disabled>Download</sl-button>\n`
        result += `<br /><br />\n`
      }
      break
    case 'OUTPUT_TRANSFORM':
      {
        result += `${prefix}${indent}<sl-details disabled id="${functionName}-${parameter.name}-details" summary="${camelCase(parameter.name)}: ${description}"></sl-details>\n`

        result += `${prefix}${indent}<sl-select id="${functionName}-${parameter.name}-output-format" placeholder="Format">\n`
        const formats = ['h5', 'txt', 'mat', 'xfm']
        formats.forEach((format) => {
          result += `${prefix}${indent}${indent}<sl-option value="${format}">${format}</sl-option>\n`
        })
        result += `${prefix}${indent}</sl-select>\n`
        result += `${prefix}${indent}<sl-button variant="neutral" outline name="${parameter.name}-download" disabled>Download</sl-button>\n`
        result += `<br /><br />\n`
      }
      break
    default:
      console.error(
        `outputDemoHtml: Unexpected interface type: ${parameterType}`
      )
      process.exit(1)
  }
  return result
}

export default outputDemoHtml
