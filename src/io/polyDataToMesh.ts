import * as Comlink from 'comlink'

import createWorkerProxy from '../core/create-worker-proxy.js'
import PolyDataToMeshPipelineResult from '../core/web-workers/poly-data-to-mesh-pipeline-result.js'
import Mesh from '../core/interface-types/mesh.js'
import InterfaceTypes from '../core/InterfaceTypes.js'
import PolyData from '../core/interface-types/poly-data.js'
import polyDataTransferables from '../core/internal/polyDataTransferables.js'
import PipelineInput from '../pipeline/PipelineInput.js'
import config from '../itkConfig.js'
import getTransferables from '../core/get-transferables.js'

async function polyDataToMesh (webWorker: Worker | null, polyData: PolyData): Promise<{ mesh: Mesh, webWorker: Worker }> {
  let worker = webWorker
  const { workerProxy, worker: usedWorker } = await createWorkerProxy(worker, null)
  worker = usedWorker

  const args = ['0', '0', '--memory-io']
  const outputs = [
    { type: InterfaceTypes.Mesh }
  ]
  const inputs = [
    { type: InterfaceTypes.PolyData, data: polyData }
  ] as PipelineInput[]

  const transferables = polyDataTransferables(polyData)

  const result: PolyDataToMeshPipelineResult = await workerProxy.polyDataToMesh(
    config,
    args,
    outputs,
    Comlink.transfer(inputs, getTransferables(transferables))
  )
  return { mesh: result.outputs[0].data as Mesh, webWorker: worker }
}

export default polyDataToMesh
