export default async function readSegmentationLoadSampleInputs (model, preRun=false) {
  const dicomButton = document.querySelector('#readOverlappingSegmentationInputs sl-button[name=dicom-file-file-button]')
  if (!preRun) {
    dicomButton.loading = true
  }

  const fileName = `liver_heart_seg.dcm`
  const dicomReponse = await fetch(`https://data.kitware.com/api/v1/file/66be8247f87a980650f422a7/download`)
  const dicomData = new Uint8Array(await dicomReponse.arrayBuffer())
  const inputFile = { data: dicomData, path: fileName }
  model.inputs.set('dicomFile', inputFile)

  if (!preRun) {
    const dicomElement = document.getElementById('readOverlappingSegmentation-dicom-file-details')
    dicomElement.innerHTML = `<pre>${globalThis.escapeHtml(inputFile.path.toString())}</pre>`
    dicomElement.disabled = false
    dicomButton.loading = false
  }

  return model
}

export const usePreRun = true
