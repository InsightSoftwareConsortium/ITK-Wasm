// Evenutally we will support them all
const demoSupportedInputTypes = new Set([
  'INPUT_TEXT_FILE',
  'INPUT_TEXT_FILE:FILE',
  'INPUT_TEXT_STREAM',
  'INPUT_BINARY_FILE',
  'INPUT_BINARY_FILE:FILE',
  'INPUT_BINARY_STREAM',
  'TEXT',
  'INT',
  'UINT',
  'BOOL',
  'INPUT_MESH',
])
const demoSupportedOutputTypes = new Set([
  'OUTPUT_TEXT_FILE',
  'OUTPUT_TEXT_FILE:FILE',
  'OUTPUT_TEXT_STREAM',
  'OUTPUT_BINARY_FILE',
  'OUTPUT_BINARY_FILE:FILE',
  'OUTPUT_BINARY_STREAM',
  'OUTPUT_JSON',
  'OUTPUT_MESH',
])

function allDemoTypesSupported(interfaceJson) {
  let allTypesSupported = true
  allTypesSupported = allTypesSupported && interfaceJson.inputs.every((input) => demoSupportedInputTypes.has(input.type))
  allTypesSupported = allTypesSupported && interfaceJson.parameters.every((parameter) => demoSupportedInputTypes.has(parameter.type))
  allTypesSupported = allTypesSupported && interfaceJson.outputs.every((parameter) => demoSupportedOutputTypes.has(parameter.type))
  return allTypesSupported
}

export default allDemoTypesSupported