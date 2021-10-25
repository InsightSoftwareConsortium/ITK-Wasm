import registerWebworker from 'webworker-promise/lib/register.js'

import { ReadMeshInput, WriteMeshInput, readMesh, writeMesh } from "./mesh-io-operations.js"

registerWebworker(async function (input: ReadMeshInput | WriteMeshInput) {
  if (input.operation === 'readMesh') {
    return readMesh(input as ReadMeshInput)
  } else if (input.operation === 'writeMesh') {
    return writeMesh(input as WriteMeshInput)
  } else {
    throw new Error('Unknown worker operation')
  }
})
