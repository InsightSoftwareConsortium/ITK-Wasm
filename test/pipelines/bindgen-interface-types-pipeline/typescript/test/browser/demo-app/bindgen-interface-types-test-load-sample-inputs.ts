import { readMeshArrayBuffer } from "itk-wasm"

export default async function bindgenInterfaceTypesTestLoadSampleInputs (model) {
  const inputTextFile = { path: 'input.txt', data: 'Hello bindgen World!' }
  model.inputs.set("inputTextFile", inputTextFile)
  const inputTextFileElement = document.querySelector("#bindgenInterfaceTypesTestInputs sl-input[name=input-text-file]")
  inputTextFileElement.value = model.inputs.get("inputTextFile").data.substring(0, 50)

  const inputBinaryFile = { path: 'input.bin', data: new Uint8Array([222, 173, 190, 239]) }
  model.inputs.set("inputBinaryFile", inputBinaryFile)
  const inputBinaryFileElement = document.querySelector("#bindgenInterfaceTypesTestInputs sl-input[name=input-binary-file]")
  inputBinaryFileElement.value = model.inputs.get("inputBinaryFile").data.subarray(0, 50).toString()

  const inputTextStream = { data: 'Hola bindgen World!' }
  model.inputs.set("inputTextStream", inputTextStream.data)
  const inputTextStreamElement = document.querySelector("#bindgenInterfaceTypesTestInputs sl-input[name=input-text-stream]")
  inputTextStreamElement.value = model.inputs.get("inputTextStream").substring(0, 50)

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
