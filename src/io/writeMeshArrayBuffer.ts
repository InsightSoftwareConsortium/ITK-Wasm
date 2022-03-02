import createWebWorkerPromise from '../core/internal/createWebWorkerPromise.js'

import Mesh from '../core/Mesh.js'

import config from '../itkConfig.js'
import WriteArrayBufferResult from './WriteArrayBufferResult.js'
import WriteMeshOptions from './WriteMeshOptions.js'
import PipelineInput from '../pipeline/PipelineInput.js'
import PipelineOutput from '../pipeline/PipelineOutput.js'
import InterfaceTypes from '../core/InterfaceTypes.js'

async function writeMeshArrayBuffer (webWorker: Worker | null, options: WriteMeshOptions, mesh: Mesh, fileName: string, mimeType: string): Promise<WriteArrayBufferResult> {
  let worker = webWorker
  const { webworkerPromise, worker: usedWorker } = await createWebWorkerPromise('pipeline', worker)
  worker = usedWorker

  const filePath = `./${fileName}`
  const args = ['0', filePath, '--memory-io', '--quiet']
  if (options.useCompression === true) {
    args.push('--use-compression')
  }
  if (options.binaryFileType === true) {
    args.push('--binary-file-type')
  }
  const outputs = [
    { data: { path: filePath }, type: InterfaceTypes.BinaryFile }
  ] as PipelineOutput[]
  const inputs = [
    { type: InterfaceTypes.Mesh, data: mesh }
  ] as PipelineInput[]

  const transferables: ArrayBuffer[] = []
  if (mesh.points != null) {
    transferables.push(mesh.points.buffer)
  }
  if (mesh.pointData != null) {
    transferables.push(mesh.pointData.buffer)
  }
  if (mesh.cells != null) {
    transferables.push(mesh.cells.buffer)
  }
  if (mesh.cellData != null) {
    transferables.push(mesh.cellData.buffer)
  }

  interface RunWriteMeshPipelineResult {
    stdout: string
    stderr: string
    outputs: any[]
  }
  const result: RunWriteMeshPipelineResult = await webworkerPromise.postMessage(
    {
      operation: 'writeMesh',
      config: config,
      mimeType,
      fileName,
      pipelinePath: 'WriteMesh', // placeholder
      args,
      outputs,
      inputs
    },
    transferables
  )
  return { arrayBuffer: result.outputs[0].data.data.buffer as ArrayBuffer, webWorker: worker }
}

export default writeMeshArrayBuffer
