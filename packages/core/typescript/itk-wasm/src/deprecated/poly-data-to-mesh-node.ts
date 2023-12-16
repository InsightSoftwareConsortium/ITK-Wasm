// @ts-nocheck

import Mesh from '../interface-types/mesh.js'
import PolyData from '../interface-types/poly-data.js'

/**
 * @deprecated Use polyDataToMeshNode from @itk-wasm/mesh-to-poly-data instead
 */
async function polyDataToMeshNode (polyData: PolyData): Promise<Mesh> {
  const meshIOsPath = findLocalMeshIOPath()

  const args = ['0', '0', '--memory-io']
  const desiredOutputs = [
    { type: InterfaceTypes.Mesh }
  ]
  const inputs = [
    { type: InterfaceTypes.PolyData, data: polyData }
  ] as PipelineInput[]

  const modulePath = path.join(meshIOsPath, 'polydata-to-mesh.js')
  const emModule = await loadEmscriptenModule(modulePath) as PipelineEmscriptenModule
  const { outputs } = runPipelineEmscripten(emModule, args, desiredOutputs, inputs)
  return outputs[0].data as Mesh
}

export default polyDataToMeshNode
