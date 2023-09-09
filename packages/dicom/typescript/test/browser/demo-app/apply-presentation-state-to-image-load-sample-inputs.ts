export default async function applyPresentationStateToImageLoadSampleInputs (model, preRun=false) {
  const imageInButton = document.querySelector('#applyPresentationStateToImageInputs sl-button[name=image-in-file-button]')
  if (!preRun) {
    imageInButton.loading = true
  }
  const imageInReponse = await fetch('https://bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi.ipfs.w3s.link/ipfs/bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi/input/gsps-pstate-test-input-image.dcm')
  const imageInData = new Uint8Array(await imageInReponse.arrayBuffer())
  model.inputs.set('imageIn', { data: imageInData, path: 'gsps-pstate-test-input-image.dcm' })
  const imageInElement = document.getElementById('applyPresentationStateToImage-image-in-details')
  if (!preRun) {
    imageInElement.innerHTML = `<pre>${globalThis.escapeHtml(imageInData.subarray(0, 50).toString())}</pre>`
    imageInElement.disabled = false
    imageInButton.loading = false
  }

  const pstateButton = document.querySelector('#applyPresentationStateToImageInputs sl-button[name=presentation-state-file-file-button]')
  if (!preRun) {
    pstateButton.loading = true
  }
  const pstateReponse = await fetch('https://bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi.ipfs.w3s.link/ipfs/bafybeihmnqsufckyjxt2z3yunppqggtq2rle7fta27rbetmf7fgviytghi/input/gsps-pstate-test-input-pstate.dcm')
  const pstateData = new Uint8Array(await pstateReponse.arrayBuffer())
  model.inputs.set('presentationStateFile', { data: pstateData, path: 'gsps-pstate-test-input-pstate.dcm' })
  if (!preRun) {
    const pstateElement = document.getElementById('applyPresentationStateToImage-presentation-state-file-details')
    pstateElement.innerHTML = `<pre>${globalThis.escapeHtml(pstateData.subarray(0, 50).toString())}</pre>`
    pstateElement.disabled = false
    pstateButton.loading = false
  }

  return model
}

export const usePreRun = true
