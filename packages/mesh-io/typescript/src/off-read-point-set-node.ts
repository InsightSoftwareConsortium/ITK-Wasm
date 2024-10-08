// Generated file. To retain edits, remove this comment.

import {
  JsonCompatible,
  PointSet,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import OffReadPointSetNodeOptions from './off-read-point-set-node-options.js'
import OffReadPointSetNodeResult from './off-read-point-set-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Read a point set file format and convert it to the itk-wasm file format
 *
 * @param {string} serializedPointSet - Input point set serialized in the file format
 * @param {OffReadPointSetNodeOptions} options - options object
 *
 * @returns {Promise<OffReadPointSetNodeResult>} - result object
 */
async function offReadPointSetNode(
  serializedPointSet: string,
  options: OffReadPointSetNodeOptions = {}
) : Promise<OffReadPointSetNodeResult> {

  const mountDirs: Set<string> = new Set()

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
    { type: InterfaceTypes.PointSet },
  ]

  mountDirs.add(path.dirname(serializedPointSet as string))
  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // Inputs
  const serializedPointSetName = serializedPointSet
  args.push(serializedPointSetName)
  mountDirs.add(path.dirname(serializedPointSetName))

  // Outputs
  const couldReadName = '0'
  args.push(couldReadName)

  const pointSetName = '1'
  args.push(pointSetName)

  // Options
  args.push('--memory-io')
  if (options.informationOnly) {
    options.informationOnly && args.push('--information-only')
  }

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'off-read-point-set')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs, mountDirs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    couldRead: outputs[0]?.data as JsonCompatible,
    pointSet: outputs[1]?.data as PointSet,
  }
  return result
}

export default offReadPointSetNode
