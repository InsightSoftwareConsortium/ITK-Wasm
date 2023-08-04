export default async function applyPresentationStateToImageLoadSampleInputs (model) {
  const imageInButton = document.querySelector('#applyPresentationStateToImageInputs sl-button[name=image-in-file-button]')
  console.log(imageInButton)
  imageInButton.loading = true
  const imageInReponse = await fetch('https://bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi.ipfs.w3s.link/ipfs/bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi/input/gsps-pstate-test-input-image.dcm')
  const imageInData = new Uint8Array(await imageInReponse.arrayBuffer())
  model.inputs.set('imageIn', { data: imageInData, path: 'gsps-pstate-test-input-image.dcm' })
  const imageInElement = document.querySelector('#applyPresentationStateToImageInputs sl-input[name=image-in]')
  imageInElement.value = imageInData.subarray(0, 50).toString()
  imageInButton.loading = false

  const pstateButton = document.querySelector('#applyPresentationStateToImageInputs sl-button[name=presentation-state-file-file-button]')
  console.log(pstateButton)
  pstateButton.loading = true
  const pstateReponse = await fetch('https://bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi.ipfs.w3s.link/ipfs/bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi/input/gsps-pstate-test-input-pstate.dcm')
  const pstateData = new Uint8Array(await pstateReponse.arrayBuffer())
  model.inputs.set('presentationStateFile', { data: pstateData, path: 'gsps-pstate-test-input-pstate.dcm' })
  const pstateElement = document.querySelector('#applyPresentationStateToImageInputs sl-input[name=presentation-state-file]')
  pstateElement.value = pstateData.subarray(0, 50).toString()
  pstateButton.loading = false

  return model
}
