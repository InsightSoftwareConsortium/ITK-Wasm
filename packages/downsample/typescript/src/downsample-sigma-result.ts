import { WorkerPoolFunctionResult } from 'itk-wasm'

interface DownsampleSigmaResult extends WorkerPoolFunctionResult {
  /** Output sigmas in pixel units. */
  sigma: number[]

}

export default DownsampleSigmaResult
