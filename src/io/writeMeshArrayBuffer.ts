import * as Comlink from 'comlink'

import createWorkerProxy from '../core/create-worker-proxy.js'
import WriteMeshPipelineResult from '../core/web-workers/write-mesh-pipeline-result.js'

import Mesh from '../core/interface-types/mesh.js'

import config from '../itkConfig.js'
import WriteArrayBufferResult from './WriteArrayBufferResult.js'
import WriteMeshOptions from './WriteMeshOptions.js'
import PipelineInput from '../pipeline/PipelineInput.js'
import PipelineOutput from '../pipeline/PipelineOutput.js'
import InterfaceTypes from '../core/InterfaceTypes.js'
import meshTransferables from '../core/internal/meshTransferables.js'
import getTransferables from '../core/get-transferables.js'

async function writeMeshArrayBuffer (webWorker: Worker | null, mesh: Mesh, fileName: string, mimeType: string, options: WriteMeshOptions): Promise<WriteArrayBufferResult> {
  if ('useCompression' in (mesh as any) || 'binaryFileType' in (mesh as any)) {
    throw new Error('options are now in the last argument position in itk-wasm')
  }

  let worker = webWorker
  const { workerProxy, worker: usedWorker } = await createWorkerProxy(worker, null)
  worker = usedWorker

  const filePath = `./${fileName}`
  const args = ['0', filePath, '--memory-io', '--quiet']
  if (options?.useCompression === true) {
    args.push('--use-compression')
  }
  if (options?.binaryFileType === true) {
    args.push('--binary-file-type')
  }
  const outputs = [
    { data: { path: filePath }, type: InterfaceTypes.BinaryFile }
  ] as PipelineOutput[]
  const inputs = [
    { type: InterfaceTypes.Mesh, data: mesh }
  ] as PipelineInput[]

  const transferables = meshTransferables(mesh)

  const result: WriteMeshPipelineResult = await workerProxy.writeMesh(
    config,
    mimeType,
    fileName,
    args,
    outputs,
    Comlink.transfer(inputs, getTransferables(transferables))
  )
  return { arrayBuffer: result.outputs[0].data.data.buffer as ArrayBuffer, webWorker: worker }
}

export default writeMeshArrayBuffer
