export default function compressStringifyLoadSampleInputs (context) {
  const sampleInput = new Uint8Array([222, 173, 190, 239])
  context.inputs.set("input", sampleInput)
  const inputElement = document.querySelector("#compressStringifyInputs [name=input]")
  inputElement.value = sampleInput.toString()

  const stringify = true
  context.options.set("stringify", stringify)
  const stringifyElement = document.querySelector('#compressStringifyInputs sl-checkbox[name=stringify]')
  stringifyElement.checked = stringify

  const compressionLevel = 5
  context.options.set("compressionLevel", compressionLevel)
  const compressionLevelElement = document.querySelector('#compressStringifyInputs sl-input[name=compression-level]')
  compressionLevelElement.value = compressionLevel

  const dataUrlPrefix = 'data:application/iwi+cbor+zstd;base64,'
  context.options.set("dataUrlPrefix", dataUrlPrefix)
  const dataUrlPrefixElement = document.querySelector('#compressStringifyInputs sl-input[name=data-url-prefix]')
  dataUrlPrefixElement.value = dataUrlPrefix
}