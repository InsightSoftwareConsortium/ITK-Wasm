export const parseStringDecompressLoadSampleInputsDefined = true

export function parseStringDecompressLoadSampleInputs (context) {
  const sampleInput = new TextEncoder().encode('data:application/iwi+cbor+zstd;base64,KLUv/SAEIQAA3q2+7w==')
  context.inputs.set("input", sampleInput)
  const input = document.querySelector("#parseStringDecompressInputs [name=input]")
  input.value = sampleInput.toString()

  const parseStringInput = document.querySelector('#parseStringDecompressInputs sl-checkbox[name=parse-string]')
  parseStringInput.checked = true
  context.options.set("parse-string", true)
}
