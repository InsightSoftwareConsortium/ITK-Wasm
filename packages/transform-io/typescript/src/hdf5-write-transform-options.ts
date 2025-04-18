// Generated file. To retain edits, remove this comment.

import { WorkerPoolFunctionOption } from 'itk-wasm'

interface Hdf5WriteTransformOptions extends WorkerPoolFunctionOption {
  /** Use float for the parameter value type. The default is double. */
  floatParameters?: boolean

  /** Use compression in the written file */
  useCompression?: boolean

}

export default Hdf5WriteTransformOptions
