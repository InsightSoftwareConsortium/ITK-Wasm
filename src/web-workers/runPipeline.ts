import registerWebworker from 'webworker-promise/lib/register.js'

import PipelineEmscriptenModule from '../pipeline/PipelineEmscriptenModule.js'
import runPipelineEmscripten from '../pipeline/internal/runPipelineEmscripten.js'
import IOTypes from '../core/IOTypes.js'
import getTransferables from '../core/getTransferables.js'

import PipelineInput from '../pipeline/PipelineInput.js'
import PipelineOutput from '../pipeline/PipelineOutput.js'

import InterfaceTypes from '../core/InterfaceTypes.js'
import Image from '../core/Image.js'
import Mesh from '../core/Mesh.js'
import PolyData from '../core/PolyData.js'
import TypedArray from '../core/TypedArray.js'
import imageTransferables from '../core/internal/imageTransferables.js'
import meshTransferables from '../core/internal/meshTransferables.js'
import polyDataTransferables from '../core/internal/polyDataTransferables.js'

async function runPipeline(pipelineModule: PipelineEmscriptenModule, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]) {
  const result = runPipelineEmscripten(pipelineModule, args, outputs, inputs)

  const transferables: (ArrayBuffer | TypedArray | null)[] = []
  if (result.outputs) {
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
      } else if (output.type === IOTypes.Binary) {
        // Binary data
        const binary = output.data as Uint8Array
        transferables.push(binary)
      } else if (output.type === IOTypes.Image) {
        // Image data
        const image = output.data as Image
        transferables.push(...imageTransferables(image))
      } else if (output.type === IOTypes.Mesh) {
        // Mesh data
        const mesh = output.data as Mesh
        transferables.push(...meshTransferables(mesh))
      }
    })
  }

  return new registerWebworker.TransferableResponse(
    result,
    getTransferables(transferables)
  )
}

export default runPipeline
