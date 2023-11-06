import * as Comlink from 'comlink'

import createWorkerProxy from '../core/create-worker-proxy.js'
import getTransferables from '../core/get-transferables.js'
import Mesh from '../core/interface-types/mesh.js'
import InterfaceTypes from '../core/InterfaceTypes.js'
import PipelineInput from '../pipeline/PipelineInput.js'
import ReadMeshPipelineResult from '../core/web-workers/read-mesh-pipeline-result.js'

import config from '../itkConfig.js'

import ReadMeshResult from './ReadMeshResult.js'

async function readMeshArrayBuffer (webWorker: Worker | null, arrayBuffer: ArrayBuffer, fileName: string, mimeType: string): Promise<ReadMeshResult> {
  let worker = webWorker
  const { workerProxy, worker: usedWorker } = await createWorkerProxy(worker, null)
  worker = usedWorker

  const filePath = `./${fileName}`
  const args = [filePath, '0', '--memory-io', '--quiet']
  const outputs = [
    { type: InterfaceTypes.Mesh }
  ]
  const inputs = [
    { type: InterfaceTypes.BinaryFile, data: { path: filePath, data: new Uint8Array(arrayBuffer) } }
  ] as PipelineInput[]

  const transferables: ArrayBuffer[] = [arrayBuffer]

  const result: ReadMeshPipelineResult = await workerProxy.readMesh(
    config,
    mimeType,
    fileName,
    args,
    outputs,
    Comlink.transfer(inputs, getTransferables(transferables))
  )
  return { mesh: result.outputs[0].data as Mesh, webWorker: worker }
}

export default readMeshArrayBuffer
