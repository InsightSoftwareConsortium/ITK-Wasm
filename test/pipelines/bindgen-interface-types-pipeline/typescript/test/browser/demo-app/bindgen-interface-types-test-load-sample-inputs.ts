import { readImageArrayBuffer, readMeshArrayBuffer } from "itk-wasm"
import { web } from "webpack"

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

  const inputBinaryStream = { data: new Uint8Array([222, 173, 190, 239]) }
  model.inputs.set("inputBinaryStream", inputBinaryStream.data)
  const inputBinaryStreamElement = document.querySelector("#bindgenInterfaceTypesTestInputs sl-input[name=input-binary-stream]")
  inputBinaryStreamElement.value = model.inputs.get("inputBinaryStream").subarray(0, 50).toString()

  const inputJson = { key1: 'value1', key2: 2 }
  model.inputs.set("inputJson", inputJson)
  const inputJsonElement = document.getElementById('input-json-input')
  inputJsonElement.innerHTML = `<pre>${JSON.stringify(inputJson, globalThis.interfaceTypeJsonReplacer, 2)}</pre>`
  inputJsonElement.disabled = false

  const imageUrl = 'https://bafybeigja4wbultavomsvai433hln7uqabzl2mg24frxzqblx4y4cvd5am.ipfs.w3s.link/ipfs/bafybeigja4wbultavomsvai433hln7uqabzl2mg24frxzqblx4y4cvd5am/cthead1.png'
  let response = await fetch(imageUrl)
  let arrayBuffer = await response.arrayBuffer()
  const { image, webWorker } = await readImageArrayBuffer(null, arrayBuffer, 'cow.iwm.cbor')
  model.inputs.set("inputImage", image)
  const inputImageDetails = document.getElementById('input-image-input')
  inputImageDetails.innerHTML = `<pre>${JSON.stringify(image, globalThis.interfaceTypeJsonReplacer, 2)}</pre>`
  inputImageDetails.disabled = false

  const meshUrl = 'https://w3s.link/ipfs/bafkreieodo3n2damvbcbpm5ir3bsxcorqvbaqzcz33y63nn3zp6jxemske'
  response = await fetch(meshUrl)
  arrayBuffer = await response.arrayBuffer()
  const { mesh } = await readMeshArrayBuffer(webWorker, arrayBuffer, 'cow.iwm.cbor')
  webWorker.terminate()
  model.inputs.set("inputMesh", mesh)
  const inputMeshDetails = document.getElementById('input-mesh-input')
  inputMeshDetails.innerHTML = `<pre>${JSON.stringify(mesh, globalThis.interfaceTypeJsonReplacer, 2)}</pre>`
  inputMeshDetails.disabled = false
}
