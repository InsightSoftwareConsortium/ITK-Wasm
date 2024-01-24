import { WorkerPoolFunctionResult } from 'itk-wasm'

interface GaussianKernelRadiusResult extends WorkerPoolFunctionResult {
  /** Output kernel radius. */
  radius: number[]

}

export default GaussianKernelRadiusResult
