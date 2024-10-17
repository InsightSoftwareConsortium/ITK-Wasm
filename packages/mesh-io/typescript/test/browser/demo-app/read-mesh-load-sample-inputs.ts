export default async function readMeshLoadSampleInputs (model, preRun=false) {
  const inputButton = document.querySelector('#readMeshInputs sl-button[name=serialized-mesh-file-button]')
  if (!preRun) {
    inputButton.loading = true
  }
  const fileName = 'cow.vtk'
  const inputResponse = await fetch(`https://bafybeierpxwvno36fwb4t53xoh3u33xctemtaw55cnbk2yj3ujlrf76jpy.ipfs.w3s.link/ipfs/bafybeierpxwvno36fwb4t53xoh3u33xctemtaw55cnbk2yj3ujlrf76jpy/data/input/${fileName}`)
  const inputData = new Uint8Array(await inputResponse.arrayBuffer())
  model.inputs.set('serializedMesh', { data: inputData, path: fileName })
  if (!preRun) {
    const inputElement = document.getElementById('readMesh-serialized-mesh-details')
    inputElement.innerHTML = `<pre>${globalThis.escapeHtml(inputData.subarray(0, 50).toString())}</pre>`
    inputElement.disabled = false
    inputButton.loading = false
  }

  return model
}

export const usePreRun = true
