export default function compressStringifyLoadSampleInputs (model) {
  const sampleInput = new Uint8Array([222, 173, 190, 239])
  model.inputs.set("input", sampleInput)
  const inputElement = document.querySelector("#compressStringifyInputs [name=input]")
  inputElement.value = sampleInput.toString()

  const stringify = true
  model.options.set("stringify", stringify)
  const stringifyElement = document.querySelector('#compressStringifyInputs sl-checkbox[name=stringify]')
  stringifyElement.checked = stringify

  const compressionLevel = 5
  model.options.set("compressionLevel", compressionLevel)
  const compressionLevelElement = document.querySelector('#compressStringifyInputs sl-input[name=compression-level]')
  compressionLevelElement.value = compressionLevel

  const dataUrlPrefix = 'data:application/iwi+cbor+zstd;base64,'
  model.options.set("dataUrlPrefix", dataUrlPrefix)
  const dataUrlPrefixElement = document.querySelector('#compressStringifyInputs sl-input[name=data-url-prefix]')
  dataUrlPrefixElement.value = dataUrlPrefix
}