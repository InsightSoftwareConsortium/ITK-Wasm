export default async function structuredReportToHtmlLoadSampleInputs(model) {
  const dicomButton = document.querySelector('#structuredReportToHtmlInputs sl-button[name=dicom-file-file-button]')
  dicomButton.loading = true
  const fileName = '88.33-comprehensive-SR.dcm'
  const dicomReponse = await fetch(`https://bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi.ipfs.w3s.link/ipfs/bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi/input/${fileName}`)
  const dicomData = new Uint8Array(await dicomReponse.arrayBuffer())
  model.inputs.set('dicomFile', { data: dicomData, path: fileName })
  const dicomElement = document.querySelector('#structuredReportToHtmlInputs  sl-input[name=dicom-file]')
  dicomElement.value = dicomData.subarray(0, 50).toString()
  dicomButton.loading = false
}