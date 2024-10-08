export default async function readPointSetLoadSampleInputs (model, preRun=false) {
  const inputButton = document.querySelector('#readPointSetInputs sl-button[name=serialized-point-set-file-button]')
  if (!preRun) {
    inputButton.loading = true
  }
  const fileName = 'box-points.obj'
  const inputResponse = await fetch(`https://bafybeigniwg5zquxmw5izw22absoqvxwrrezr6wv3hc3gbrvgs6ywv4mdq.ipfs.w3s.link/ipfs/bafybeigniwg5zquxmw5izw22absoqvxwrrezr6wv3hc3gbrvgs6ywv4mdq/input/${fileName}`)
  const inputData = new Uint8Array(await inputResponse.arrayBuffer())
  model.inputs.set('serializedPointSet', { data: inputData, path: fileName })
  if (!preRun) {
    const inputElement = document.getElementById('readPointSet-serialized-point-set-details')
    inputElement.innerHTML = `<pre>${globalThis.escapeHtml(inputData.subarray(0, 50).toString())}</pre>`
    inputElement.disabled = false
    inputButton.loading = false
  }

  return model
}

export const usePreRun = true
