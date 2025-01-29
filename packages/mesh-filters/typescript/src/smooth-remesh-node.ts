// Generated file. To retain edits, remove this comment.

import {
  Mesh,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import SmoothRemeshNodeOptions from './smooth-remesh-node-options.js'
import SmoothRemeshNodeResult from './smooth-remesh-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Smooth and remesh a mesh to improve quality.
 *
 * @param {Mesh} inputMesh - The input mesh
 * @param {SmoothRemeshNodeOptions} options - options object
 *
 * @returns {Promise<SmoothRemeshNodeResult>} - result object
 */
async function smoothRemeshNode(
  inputMesh: Mesh,
  options: SmoothRemeshNodeOptions = {}
) : Promise<SmoothRemeshNodeResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.Mesh },
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.Mesh, data: inputMesh },
  ]

  const args = []
  // Inputs
  const inputMeshName = '0'
  args.push(inputMeshName)

  // Outputs
  const outputMeshName = '0'
  args.push(outputMeshName)

  // Options
  args.push('--memory-io')
  if (options.numberPoints) {
    args.push('--number-points', options.numberPoints.toString())

  }
  if (options.triangleShapeAdaptation) {
    args.push('--triangle-shape-adaptation', options.triangleShapeAdaptation.toString())

  }
  if (options.triangleSizeAdaptation) {
    args.push('--triangle-size-adaptation', options.triangleSizeAdaptation.toString())

  }
  if (options.normalIterations) {
    args.push('--normal-iterations', options.normalIterations.toString())

  }
  if (options.lloydIterations) {
    args.push('--lloyd-iterations', options.lloydIterations.toString())

  }
  if (options.newtonIterations) {
    args.push('--newton-iterations', options.newtonIterations.toString())

  }
  if (options.newtonM) {
    args.push('--newton-m', options.newtonM.toString())

  }
  if (options.lfsSamples) {
    args.push('--lfs-samples', options.lfsSamples.toString())

  }

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'smooth-remesh')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    outputMesh: outputs[0]?.data as Mesh,
  }
  return result
}

export default smoothRemeshNode
