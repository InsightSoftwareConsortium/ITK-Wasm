// Generated file. To retain edits, remove this comment.

import {
  JsonCompatible,
  TransformList,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import MncReadTransformNodeOptions from './mnc-read-transform-node-options.js'
import MncReadTransformNodeResult from './mnc-read-transform-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Read an transform file format and convert it to the ITK-Wasm transform file format
 *
 * @param {string} serializedTransform - Input transform serialized in the file format
 * @param {MncReadTransformNodeOptions} options - options object
 *
 * @returns {Promise<MncReadTransformNodeResult>} - result object
 */
async function mncReadTransformNode(
  serializedTransform: string,
  options: MncReadTransformNodeOptions = {}
) : Promise<MncReadTransformNodeResult> {

  const mountDirs: Set<string> = new Set()

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
    { type: InterfaceTypes.TransformList },
  ]

  mountDirs.add(path.dirname(serializedTransform as string))
  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // Inputs
  const serializedTransformName = serializedTransform
  args.push(serializedTransformName)
  mountDirs.add(path.dirname(serializedTransformName))

  // Outputs
  const couldReadName = '0'
  args.push(couldReadName)

  const transformName = '1'
  args.push(transformName)

  // Options
  args.push('--memory-io')
  if (options.floatParameters) {
    options.floatParameters && args.push('--float-parameters')
  }

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'mnc-read-transform')

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
    transform: outputs[1]?.data as TransformList,
  }
  return result
}

export default mncReadTransformNode
