export default async function readDicomEncapsulatedPdfLoadSampleInputs (model) {
  const dicomButton = document.querySelector('#readDicomEncapsulatedPdfInputs sl-button[name=dicom-file-file-button]')
  dicomButton.loading = true
  const fileName = '104.1-SR-printed-to-pdf.dcm'
  const dicomReponse = await fetch(`https://bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi.ipfs.w3s.link/ipfs/bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi/input/${fileName}`)
  const dicomData = new Uint8Array(await dicomReponse.arrayBuffer())
  model.inputs.set('dicomFile', { data: dicomData, path: fileName })
  const dicomElement = document.querySelector('#readDicomEncapsulatedPdf-dicom-file-details')
  dicomElement.innerHTML = `<pre>${globalThis.escapeHtml(dicomData.subarray(0, 50).toString())}</pre>`
  dicomElement.disabled = false
  dicomButton.loading = false

  return model
}
