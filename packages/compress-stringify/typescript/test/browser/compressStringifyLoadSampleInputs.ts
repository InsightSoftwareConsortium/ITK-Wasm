export const compressStringifyLoadSampleInputsDefined = true

export function compressStringifyLoadSampleInputs (context) {
  const sampleInput = new Uint8Array([222, 173, 190, 239])
  context.inputs.set("input", sampleInput)
  const input = document.querySelector("#compressStringifyInputs [name=input]")
  input.value = context.inputs.get("input").toString()

  const stringify = document.querySelector("#compressStringifyInputs [name=stringify]")
  stringify.checked = true
  context.options.set("stringify", true)

  const compressionLevel = document.querySelector("#compressStringifyInputs [name=compression-level]")
  compressionLevel.value = 5
  context.options.set("compressionLevel" , 5)

  const dataUrlPrefix = document.querySelector("#compressStringifyInputs [name=data-url-prefix]")
  const dataUrlPrefixValue = 'data:application/iwi+cbor+zstd;base64,'
  dataUrlPrefix.value = dataUrlPrefixValue
  context.options.set("dataUrlPrefix", dataUrlPrefixValue)
}
