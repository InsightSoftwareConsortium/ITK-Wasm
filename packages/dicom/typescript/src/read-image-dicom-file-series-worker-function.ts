import {
  BinaryFile,
  runPipeline,
  PipelineOutput,
  PipelineInput,
  InterfaceTypes,
  Image,
} from 'itk-wasm'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

interface WorkerFunctionResult {
  webWorker: Worker
  outputImage: Image
  sortedFilenames: string[]
}

async function readImageDicomFileSeriesWorkerFunction(
  webWorker: Worker | null,
  inputImages: BinaryFile[],
  singleSortedSeries: boolean = false
): Promise<WorkerFunctionResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.Image },
    { type: InterfaceTypes.JsonCompatible },
  ]

  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // Inputs
  // Outputs
  const outputImageName = '0'
  args.push(outputImageName)

  const sortedFilenamesName = '1'
  args.push(sortedFilenamesName)

  // Options
  args.push('--memory-io')
  args.push('--input-images')
  inputImages.forEach((value) => {
    inputs.push({ type: InterfaceTypes.BinaryFile, data: value as BinaryFile })
    args.push(value.path)
  })
  if (typeof singleSortedSeries !== "undefined") {
    singleSortedSeries && args.push('--single-sorted-series')
  }

  const pipelinePath = 'read-image-dicom-file-series'

  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl() })
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    outputImage: outputs[0].data as Image,
    sortedFilenames: outputs[1].data as string[],
  }
  return result
}

export default readImageDicomFileSeriesWorkerFunction
