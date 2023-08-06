export default async function readImageDicomFileSeriesLoadSampleInputs (model) {
  const dicomButton = document.querySelector('#readImageDicomFileSeriesInputs sl-button[name=input-images-file-button]')
  dicomButton.loading = true

  const inputFiles = []
  for(let i = 1; i < 4; i++) {
    const fileName = `ImageOrientation.${i}.dcm`
    const dicomReponse = await fetch(`https://bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi.ipfs.w3s.link/ipfs/bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi/input/DicomImageOrientationTest/${fileName}`)
    const dicomData = new Uint8Array(await dicomReponse.arrayBuffer())
    inputFiles.push({ data: dicomData, path: fileName })
  }

  model.options.set('inputImages', inputFiles)

  const dicomElement = document.querySelector('#readImageDicomFileSeriesInputs  sl-input[name=input-images]')
  dicomElement.value = inputFiles.map((file) => file.path).toString()

  dicomButton.loading = false

  return model
}