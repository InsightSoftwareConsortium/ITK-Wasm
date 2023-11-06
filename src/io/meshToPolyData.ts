import * as Comlink from 'comlink'

import createWorkerProxy from '../core/create-worker-proxy.js'
import Mesh from '../core/interface-types/mesh.js'
import InterfaceTypes from '../core/InterfaceTypes.js'
import PolyData from '../core/interface-types/poly-data.js'
import meshTransferables from '../core/internal/meshTransferables.js'
import PipelineInput from '../pipeline/PipelineInput.js'
import MeshToPolyDataPipelineResult from '../core/web-workers/mesh-to-poly-data-pipeline-result.js'
import config from '../itkConfig.js'
import getTransferables from '../core/get-transferables.js'

async function meshToPolyData (webWorker: Worker | null, mesh: Mesh): Promise<{ polyData: PolyData, webWorker: Worker }> {
  let worker = webWorker
  const { workerProxy, worker: usedWorker } = await createWorkerProxy(worker, null)
  worker = usedWorker

  const args = ['0', '0', '--memory-io']
  const outputs = [
    { type: InterfaceTypes.PolyData }
  ]
  const inputs = [
    { type: InterfaceTypes.Mesh, data: mesh }
  ] as PipelineInput[]

  const transferables = meshTransferables(mesh)

  const result: MeshToPolyDataPipelineResult = await workerProxy.meshToPolyData(
    config,
    args,
    outputs,
    Comlink.transfer(inputs, getTransferables(transferables))
  )
  return { polyData: result.outputs[0].data as PolyData, webWorker: worker }
}

export default meshToPolyData
