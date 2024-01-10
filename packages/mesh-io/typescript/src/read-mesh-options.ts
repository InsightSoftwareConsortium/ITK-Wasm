import { WorkerPoolFunctionOption } from "itk-wasm"

interface ReadMeshOptions extends WorkerPoolFunctionOption {
  /** Only read mesh metadata -- do not read pixel data. */
  informationOnly?: boolean
}

export default ReadMeshOptions
