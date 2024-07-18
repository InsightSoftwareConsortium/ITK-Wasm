
import {
  JsonCompatible,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import WriteMultiSegmentationNodeOptions from './write-multi-segmentation-node-options.js'
import WriteMultiSegmentationNodeResult from './write-multi-segmentation-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Write DICOM segmentation object using multiple input images.
 *
 * @param {JsonCompatible} metaInfo - JSON file containing the meta-information that describesthe measurements to be encoded. See DCMQI documentation for details.
 * @param {string} outputDicomFile - File name of the DICOM SEG object that will store theresult of conversion.
 * @param {WriteMultiSegmentationNodeOptions} options - options object
 *
 * @returns {Promise<WriteMultiSegmentationNodeResult>} - result object
 */
async function writeMultiSegmentationNode(
  metaInfo: JsonCompatible,
  outputDicomFile: string,
  options: WriteMultiSegmentationNodeOptions = { refDicomSeries: [] as string[], segImages: [] as string[], }
) : Promise<WriteMultiSegmentationNodeResult> {

  const mountDirs: Set<string> = new Set()

  const desiredOutputs: Array<PipelineOutput> = [
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.JsonCompatible, data: metaInfo as JsonCompatible  },
  ]

  const args = []
  // Inputs
  const metaInfoName = '0'
  args.push(metaInfoName)

  // Outputs
  const outputDicomFileName = outputDicomFile
  args.push(outputDicomFileName)
  mountDirs.add(path.dirname(outputDicomFileName))

  // Options
  args.push('--memory-io')
  if (options.refDicomSeries) {
    if(options.refDicomSeries.length < 1) {
      throw new Error('"ref-dicom-series" option must have a length > 1')
    }
    args.push('--ref-dicom-series')

    options.refDicomSeries.forEach((value) => {
      mountDirs.add(path.dirname(value as string))
      args.push(value as string)
    })
  }
  if (options.segImages) {
    if(options.segImages.length < 1) {
      throw new Error('"seg-images" option must have a length > 1')
    }
    args.push('--seg-images')

    options.segImages.forEach((value) => {
      mountDirs.add(path.dirname(value as string))
      args.push(value as string)
    })
  }
  if (options.skipEmptySlices) {
    options.skipEmptySlices && args.push('--skip-empty-slices')
  }
  if (options.useLabelidAsSegmentnumber) {
    options.useLabelidAsSegmentnumber && args.push('--use-labelid-as-segmentnumber')
  }

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'write-multi-segmentation')

  const {
    returnValue,
    stderr,
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs, mountDirs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
  }
  return result
}

export default writeMultiSegmentationNode
