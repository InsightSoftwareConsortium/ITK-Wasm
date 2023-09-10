export default null

// export default async function compareDoubleImagesLoadSampleInputs (model) {

//   const testImageButton = document.querySelector('#compareImagesInputs sl-button[name=test-image-file-button]')
//   testImageButton.loading = true

//   const fileName = 'cake_easy.png'
//   const dataUrl = 'https://bafybeiffac7x3l25hbvne37tiq5sb76oyi6pogg3tm4hztwwoj2d7dlf7q.ipfs.w3s.link/ipfs/bafybeiffac7x3l25hbvne37tiq5sb76oyi6pogg3tm4hztwwoj2d7dlf7q/data/input'
//   const testImageReponse = await fetch(`${dataUrl}/${fileName}`)
//   // todo read Image with @itk-wasm/image-io
//   const dicomData = new Uint8Array(await dicomReponse.arrayBuffer())
//   inputFiles.push({ data: dicomData, path: fileName })
//   model.options.set('inputImages', inputFiles)

//   const dicomElement = document.getElementById('readImageDicomFileSeries-input-images-details')
//   dicomElement.innerHTML = `<pre>${globalThis.escapeHtml(inputFiles.map((file) => file.path).toString())}</pre>`
//   dicomElement.disabled = false

//   dicomButton.loading = false


//   // const baselineImagesButton = document.querySelector('#compareImagesInputs sl-button[name=baseline-images-file-button]')
//   // baselineImagesButton.loading = true

//   // todo

//   return model
// }

export const usePreRun = true
