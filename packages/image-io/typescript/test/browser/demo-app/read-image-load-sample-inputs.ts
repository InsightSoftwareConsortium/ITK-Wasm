export default async function readImageLoadSampleInputs (model, preRun=false) {
  const inputButton = document.querySelector('#readImageInputs sl-button[name=serialized-image-file-button]')
  if (!preRun) {
    inputButton.loading = true
  }
  const fileName = 'cthead1.png'
  const inputResponse = await fetch(`https://bafybeigrnfohpfr2kqooyjsozsva6jh2663riwrxsum5x3ltow42r6j2o4.ipfs.w3s.link/ipfs/bafybeigrnfohpfr2kqooyjsozsva6jh2663riwrxsum5x3ltow42r6j2o4/data/input/${fileName}`)
  const inputData = new Uint8Array(await inputResponse.arrayBuffer())
  model.inputs.set('serializedImage', { data: inputData, path: fileName })
  if (!preRun) {
    const inputElement = document.getElementById('readImage-serialized-image-details')
    inputElement.innerHTML = `<pre>${globalThis.escapeHtml(inputData.subarray(0, 50).toString())}</pre>`
    inputElement.disabled = false
    inputButton.loading = false
  }

  return model
}

export const usePreRun = true
