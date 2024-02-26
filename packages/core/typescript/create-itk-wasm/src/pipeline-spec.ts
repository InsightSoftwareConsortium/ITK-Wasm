import Dispatch from './dispatch.js'
import DispatchPixels from './dispatch-pixels.js'
import OptionSpec from './option-spec.js'

interface PipelineSpec {
  name: string
  description: string
  dispatch: Dispatch
  dispatchPixels?: DispatchPixels[]
  dispatchDimensions?: number[]
  inputs: OptionSpec[]
  parameters: OptionSpec[]
  outputs: OptionSpec[]
}

export default PipelineSpec
