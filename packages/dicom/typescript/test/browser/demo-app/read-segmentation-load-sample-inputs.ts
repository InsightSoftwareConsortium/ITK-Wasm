export default async function readSegmentationLoadSampleInputs (model, preRun=false) {
  const dicomButton = document.querySelector('#readSegmentationInputs sl-button[name=dicom-file-file-button]')
  if (!preRun) {
    dicomButton.loading = true
  }

  const fileName = `tumor_seg_MR_ref_3DSAGT2SPACE.dcm`
  const dicomReponse = await fetch(`https://data.kitware.com/api/v1/file/66be75caf87a980650f422a4/download`)
  const dicomData = new Uint8Array(await dicomReponse.arrayBuffer())
  const inputFile = { data: dicomData, path: fileName }
  model.inputs.set('dicomFile', inputFile)

  if (!preRun) {
    const dicomElement = document.getElementById('readSegmentation-dicom-file-details')
    dicomElement.innerHTML = `<pre>${globalThis.escapeHtml(inputFile.path.toString())}</pre>`
    dicomElement.disabled = false
    dicomButton.loading = false
  }

  return model
}

export const usePreRun = true
