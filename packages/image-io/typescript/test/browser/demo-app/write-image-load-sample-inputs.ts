import * as imageIo from '../../../dist/index.js'

export default async function writeImageLoadSampleInputs (model, preRun=false) {

  const inputButton = document.querySelector('#writeImageInputs sl-button[name=image-file-button]')
  if (!preRun) {
    inputButton.loading = true
  }
  const fileName = 'cthead1.iwi.cbor'
  const inputResponse = await fetch(`https://bafybeigrnfohpfr2kqooyjsozsva6jh2663riwrxsum5x3ltow42r6j2o4.ipfs.w3s.link/ipfs/bafybeigrnfohpfr2kqooyjsozsva6jh2663riwrxsum5x3ltow42r6j2o4/data/input/${fileName}`)
  const inputData = new Uint8Array(await inputResponse.arrayBuffer())
  const { image: inputImage, webWorker } = await imageIo.readImage({ data: inputData, path: fileName })
  webWorker.terminate()
  model.inputs.set('image', inputImage)
  const serializedImage = 'cthead1.png'
  model.inputs.set('serializedImage', serializedImage)
  if (!preRun) {
    const detailsElement = document.querySelector('#writeImage-image-details')
    detailsElement.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(inputImage, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
    detailsElement.disabled = false
    const inputElement = document.querySelector('#writeImageInputs sl-input[name="serialized-image"]')
    inputElement.value = serializedImage
    inputButton.loading = false
  }

  return model
}

export const usePreRun = true
