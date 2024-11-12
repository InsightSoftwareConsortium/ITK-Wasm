// Evenutally we will support them all
const demoSupportedInputTypes = new Set([
  'INPUT_TEXT_FILE',
  'INPUT_TEXT_STREAM',
  'INPUT_BINARY_FILE',
  'INPUT_BINARY_STREAM',
  'TEXT',
  'INT',
  'UINT',
  'FLOAT',
  'BOOL',
  'INPUT_JSON',
  'INPUT_IMAGE',
  'INPUT_MESH',
  'INPUT_POINT_SET',
  'INPUT_TRANSFORM'
])
const demoSupportedOutputTypes = new Set([
  'OUTPUT_TEXT_FILE',
  'OUTPUT_TEXT_STREAM',
  'OUTPUT_BINARY_FILE',
  'OUTPUT_BINARY_STREAM',
  'OUTPUT_JSON',
  'OUTPUT_IMAGE',
  'OUTPUT_MESH',
  'OUTPUT_POINT_SET',
  'OUTPUT_TRANSFORM'
])

function allDemoTypesSupported(interfaceJson) {
  let allTypesSupported = true
  allTypesSupported =
    allTypesSupported &&
    interfaceJson.inputs.every((input) =>
      demoSupportedInputTypes.has(input.type.split(' ')[0].split(':')[0])
    )
  allTypesSupported =
    allTypesSupported &&
    interfaceJson.parameters.every((parameter) =>
      demoSupportedInputTypes.has(parameter.type.split(' ')[0].split(':')[0])
    )
  allTypesSupported =
    allTypesSupported &&
    interfaceJson.outputs.every((parameter) =>
      demoSupportedOutputTypes.has(parameter.type.split(' ')[0].split(':')[0])
    )
  return allTypesSupported
}

export default allDemoTypesSupported
