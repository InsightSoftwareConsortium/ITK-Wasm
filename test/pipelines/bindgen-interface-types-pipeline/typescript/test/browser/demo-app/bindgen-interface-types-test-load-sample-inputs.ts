import { readMeshArrayBuffer } from "itk-wasm"

export default async function bindgenInterfaceTypesTestLoadSampleInputs (model) {
  const url = 'https://w3s.link/ipfs/bafkreieodo3n2damvbcbpm5ir3bsxcorqvbaqzcz33y63nn3zp6jxemske'
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  const { mesh, webWorker } = await readMeshArrayBuffer(null, arrayBuffer, 'cow.iwm.cbor')
  webWorker.terminate()
  model.inputs.set("inputMesh", mesh)
  const inputMeshDetails = document.getElementById('input-mesh-input')
  inputMeshDetails.innerHTML = `<pre>${JSON.stringify(mesh, globalThis.interfaceTypeJsonReplacer, 2)}</pre>`
  inputMeshDetails.disabled = false
}
