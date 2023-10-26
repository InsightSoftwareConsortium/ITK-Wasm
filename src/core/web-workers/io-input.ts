import RunPipelineInput from "./run-pipeline-input.js"

interface IOInput extends RunPipelineInput {
  fileName: string
  mimeType: string
}

export default IOInput
