export default function parseStringDecompressLoadSampleInputs (context) {
  // const sampleInput = TextDecoder().decode('data:application/iwi+cbor+zstd;base64,KLUv/SAEIQAA3q2+7w==')
  const sampleInput = new Uint8Array([100,97,116,97,58,97,112,112,108,105,99,97,116,105,111,110,47,105,119,105,43,99,98,111,114,43,122,115,116,100,59,98,97,115,101,54,52,44,75,76,85,118,47,83,65,69,73,81,65,65,51,113,50,43,55,119,61,61])
  context.inputs.set("input", sampleInput)
  const inputElement = document.querySelector('#parseStringDecompressInputs sl-input[name=input]')
  inputElement.value = sampleInput.toString()

  const parseString = true
  context.options.set("parseString", parseString)
  const parseStringElement = document.querySelector('#parseStringDecompressInputs sl-checkbox[name=parse-string]')
  parseStringElement.checked = parseString
}