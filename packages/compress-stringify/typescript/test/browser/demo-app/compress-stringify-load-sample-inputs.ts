export default async function compressStringifyLoadSampleInputs (model, preRun=false) {
  const sampleInput = new Uint8Array([222, 173, 190, 239])
  model.inputs.set("input", sampleInput)
  if (!preRun) {
    const inputElement = document.getElementById("compressStringify-input-details")
    inputElement.innerHTML = `<pre>${globalThis.escapeHtml(sampleInput.toString())}</pre>`
    inputElement.disabled = false
  }

  const stringify = true
  model.options.set("stringify", stringify)
  if (!preRun) {
    const stringifyElement = document.querySelector('#compressStringifyInputs sl-checkbox[name=stringify]')
    stringifyElement.checked = stringify
  }

  const compressionLevel = 5
  model.options.set("compressionLevel", compressionLevel)
  if (!preRun) {
    const compressionLevelElement = document.querySelector('#compressStringifyInputs sl-input[name=compression-level]')
    compressionLevelElement.value = compressionLevel
  }

  const dataUrlPrefix = 'data:application/iwi+cbor+zstd;base64,'
  model.options.set("dataUrlPrefix", dataUrlPrefix)
  if (!preRun) {
    const dataUrlPrefixElement = document.querySelector('#compressStringifyInputs sl-input[name=data-url-prefix]')
    dataUrlPrefixElement.value = dataUrlPrefix
  }

  return model
}

export const usePreRun = true
