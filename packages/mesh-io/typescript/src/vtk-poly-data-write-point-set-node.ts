// Generated file. To retain edits, remove this comment.

import {
  PointSet,
  JsonCompatible,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import VtkPolyDataWritePointSetNodeOptions from './vtk-poly-data-write-point-set-node-options.js'
import VtkPolyDataWritePointSetNodeResult from './vtk-poly-data-write-point-set-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Write an ITK-Wasm file format converted to a point set file format
 *
 * @param {PointSet} pointSet - Input point set
 * @param {string} serializedPointSet - Output point set
 * @param {VtkPolyDataWritePointSetNodeOptions} options - options object
 *
 * @returns {Promise<VtkPolyDataWritePointSetNodeResult>} - result object
 */
async function vtkPolyDataWritePointSetNode(
  pointSet: PointSet,
  serializedPointSet: string,
  options: VtkPolyDataWritePointSetNodeOptions = {}
) : Promise<VtkPolyDataWritePointSetNodeResult> {

  const mountDirs: Set<string> = new Set()

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.PointSet, data: pointSet },
  ]

  const args = []
  // Inputs
  const pointSetName = '0'
  args.push(pointSetName)

  // Outputs
  const couldWriteName = '0'
  args.push(couldWriteName)

  const serializedPointSetName = serializedPointSet
  args.push(serializedPointSetName)
  mountDirs.add(path.dirname(serializedPointSetName))

  // Options
  args.push('--memory-io')
  if (options.informationOnly) {
    options.informationOnly && args.push('--information-only')
  }
  if (options.useCompression) {
    options.useCompression && args.push('--use-compression')
  }
  if (options.binaryFileType) {
    options.binaryFileType && args.push('--binary-file-type')
  }

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'vtk-poly-data-write-point-set')

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

export default vtkPolyDataWritePointSetNode
