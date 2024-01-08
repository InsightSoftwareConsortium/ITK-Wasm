import * as Comlink from 'comlink'

import PipelineEmscriptenModule from '../pipeline-emscripten-module.js'
import runPipelineEmscripten from '../internal/run-pipeline-emscripten.js'
import getTransferables from '../../get-transferables.js'

import PipelineInput from '../pipeline-input.js'
import PipelineOutput from '../pipeline-output.js'
import RunPipelineResult from '../run-pipeline-result.js'

import InterfaceTypes from '../../interface-types/interface-types.js'
import Image from '../../interface-types/image.js'
import Mesh from '../../interface-types/mesh.js'
import PolyData from '../../interface-types/poly-data.js'
import TypedArray from '../../typed-array.js'
import imageTransferables from '../internal/image-transferables.js'
import meshTransferables from '../internal/mesh-transferables.js'
import polyDataTransferables from '../internal/poly-data-transferables.js'

async function runPipeline (pipelineModule: PipelineEmscriptenModule, args: string[], outputs: PipelineOutput[] | null, inputs: PipelineInput[] | null): Promise<RunPipelineResult> {
  const result = runPipelineEmscripten(pipelineModule, args, outputs, inputs)

  const transferables: Array<ArrayBuffer | TypedArray | null> = []
  result.outputs.forEach(function (output) {
    if (output.type === InterfaceTypes.BinaryStream || output.type === InterfaceTypes.BinaryFile) {
      // Binary data
      const binary = output.data as Uint8Array
      transferables.push(binary)
    } else if (output.type === InterfaceTypes.Image) {
      // Image data
      const image = output.data as Image
      transferables.push(...imageTransferables(image))
    } else if (output.type === InterfaceTypes.Mesh) {
      const mesh = output.data as Mesh
      transferables.push(...meshTransferables(mesh))
    } else if (output.type === InterfaceTypes.PolyData) {
      const polyData = output.data as PolyData
      transferables.push(...polyDataTransferables(polyData))
    }
  })

  return Comlink.transfer(result, getTransferables(transferables, true))
}

export default runPipeline
