import IOTypes from './IOTypes.js'
import Image from './Image.js'
import Mesh from './Mesh.js'
import PolyData from './vtkPolyData.js'

interface PipelineOutput {
  path: string;
  type: typeof IOTypes[keyof typeof IOTypes];
  data?: string | Uint8Array | Image | Mesh | PolyData;
}

export default PipelineOutput
