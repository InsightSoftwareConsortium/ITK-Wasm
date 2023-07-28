// Generated file. To retain edits, remove this comment.

import {
  Image,
  JsonObject,
  BinaryFile,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import ReadImageDicomFileSeriesOptions from './read-image-dicom-file-series-options.js'
import ReadImageDicomFileSeriesResult from './read-image-dicom-file-series-result.js'


import { getPipelinesBaseUrl } from './pipelines-base-url.js'


import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

/**
 * Read a DICOM image series and return the associated image volume
 *
 * @param {ReadImageDicomFileSeriesOptions} options - options object
 *
 * @returns {Promise<ReadImageDicomFileSeriesResult>} - result object
 */
async function readImageDicomFileSeries(
  webWorker: null | Worker,
  options: ReadImageDicomFileSeriesOptions = { inputImages: [] as BinaryFile[] | File[] | string[], }
) : Promise<ReadImageDicomFileSeriesResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.Image },
    { type: InterfaceTypes.JsonObject },
  ]
  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // ----------------------------------------------
  // Inputs

  // Outputs
  const outputImageName = '0'
  args.push(outputImageName)
  const sortedFilenamesName = '1'
  args.push(sortedFilenamesName)
  // Options
  args.push('--memory-io')
  if (typeof options.inputImages !== "undefined") {
    if(options.inputImages.length < 1) {
      throw new Error('"input-images" option must have a length > 1')
    }
    args.push('--input-images')
    options.inputImages.forEach(async (value) => {
      let valueFile = value
      if (value instanceof File) {
        const valueBuffer = await value.arrayBuffer()
        valueFile = { path: value.name, data: new Uint8Array(valueBuffer) }
      }
      inputs.push({ type: InterfaceTypes.BinaryFile, data: valueFile as BinaryFile })
      const name = value instanceof File ? value.name : (valueFile as BinaryFile).path
      args.push(name)
    })
  }
  if (typeof options.singleSortedSeries !== "undefined") {
    options.singleSortedSeries && args.push('--single-sorted-series')
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
    sortedFilenames: (outputs[1].data as JsonObject).data,
  }
  return result
}

export default readImageDicomFileSeries
