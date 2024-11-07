// Generated file. To retain edits, remove this comment.

import {
  TransformList,
  JsonCompatible,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import MncWriteTransformNodeOptions from './mnc-write-transform-node-options.js'
import MncWriteTransformNodeResult from './mnc-write-transform-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Write an ITK-Wasm transform file format converted to a transform file format
 *
 * @param {TransformList} transform - Input transform
 * @param {string} serializedTransform - Output transform serialized in the file format.
 * @param {MncWriteTransformNodeOptions} options - options object
 *
 * @returns {Promise<MncWriteTransformNodeResult>} - result object
 */
async function mncWriteTransformNode(
  transform: TransformList,
  serializedTransform: string,
  options: MncWriteTransformNodeOptions = {}
) : Promise<MncWriteTransformNodeResult> {

  const mountDirs: Set<string> = new Set()

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.TransformList, data: transform },
  ]

  const args = []
  // Inputs
  const transformName = '0'
  args.push(transformName)

  // Outputs
  const couldWriteName = '0'
  args.push(couldWriteName)

  const serializedTransformName = serializedTransform
  args.push(serializedTransformName)
  mountDirs.add(path.dirname(serializedTransformName))

  // Options
  args.push('--memory-io')
  if (options.floatParameters) {
    options.floatParameters && args.push('--float-parameters')
  }
  if (options.useCompression) {
    options.useCompression && args.push('--use-compression')
  }

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'mnc-write-transform')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs, mountDirs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    couldWrite: outputs[0]?.data as JsonCompatible,
  }
  return result
}

export default mncWriteTransformNode
