export default async function readDicomTagsLoadSampleInputs (model, preRun=false) {
  const dicomButton = document.querySelector('#readDicomTagsInputs sl-button[name=dicom-file-file-button]')
  if (!preRun) {
    dicomButton.loading = true
  }
  const fileName = 'ultrasound.dcm'
  const dicomReponse = await fetch(`https://bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi.ipfs.w3s.link/ipfs/bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi/input/dicom-images/${fileName}`)
  const dicomData = new Uint8Array(await dicomReponse.arrayBuffer())
  model.inputs.set('dicomFile', { data: dicomData, path: fileName })
  if (!preRun) {
    const dicomElement = document.getElementById('readDicomTags-dicom-file-details')
    dicomElement.innerHTML = `<pre>${globalThis.escapeHtml(dicomData.subarray(0, 50).toString())}</pre>`
    dicomElement.disabled = false
    dicomButton.loading = false
  }

  return model
}

export const usePreRun = false
