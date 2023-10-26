import createWebWorkerPromise from '../core/createWebWorkerPromise.js'
import Mesh from '../core/interface-types/mesh.js'
import InterfaceTypes from '../core/InterfaceTypes.js'
import PolyData from '../core/interface-types/poly-data.js'
import meshTransferables from '../core/internal/meshTransferables.js'
import PipelineInput from '../pipeline/PipelineInput.js'
import config from '../itkConfig.js'
import getTransferables from '../core/getTransferables.js'

async function meshToPolyData (webWorker: Worker | null, mesh: Mesh): Promise<{ polyData: PolyData, webWorker: Worker }> {
  let worker = webWorker
  const { webworkerPromise, worker: usedWorker } = await createWebWorkerPromise(worker, null)
  worker = usedWorker

  const args = ['0', '0', '--memory-io']
  const outputs = [
    { type: InterfaceTypes.PolyData }
  ]
  const inputs = [
    { type: InterfaceTypes.Mesh, data: mesh }
  ] as PipelineInput[]

  const transferables = meshTransferables(mesh)
  interface RunMeshToPolyDataPipelineResult {
    outputs: any[]
  }

  const result: RunMeshToPolyDataPipelineResult = await webworkerPromise.postMessage(
    {
      operation: 'meshToPolyData',
      config: config,
      pipelinePath: 'mesh-to-polydata', // placeholder
      args,
      outputs,
      inputs
    },
    getTransferables(transferables)
  )
  return { polyData: result.outputs[0].data as PolyData, webWorker: worker }
}

export default meshToPolyData
