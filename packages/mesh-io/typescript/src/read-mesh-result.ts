import { Mesh } from 'itk-wasm'

interface ReadMeshResult {
  mesh: Mesh
  webWorker: Worker
}

export default ReadMeshResult
