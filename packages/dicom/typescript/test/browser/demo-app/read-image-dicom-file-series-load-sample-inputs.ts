export default async function readImageDicomFileSeriesLoadSampleInputs (model, preRun=false) {
  const dicomButton = document.querySelector('#readImageDicomFileSeriesInputs sl-button[name=input-images-file-button]')
  if (!preRun) {
    dicomButton.loading = true
  }

  const inputFiles = []
  for (let i = 1; i < 4; i++) {
    const fileName = `ImageOrientation.${i}.dcm`
    const dicomReponse = await fetch(`https://bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi.ipfs.w3s.link/ipfs/bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi/input/DicomImageOrientationTest/${fileName}`)
    const dicomData = new Uint8Array(await dicomReponse.arrayBuffer())
    inputFiles.push({ data: dicomData, path: fileName })
  }

  model.options.set('inputImages', inputFiles)

  if (!preRun) {
    const dicomElement = document.getElementById('readImageDicomFileSeries-input-images-details')
    dicomElement.innerHTML = `<pre>${globalThis.escapeHtml(inputFiles.map((file) => file.path).toString())}</pre>`
    dicomElement.disabled = false

    dicomButton.loading = false
  }

  return model
}

export const usePreRun = true
