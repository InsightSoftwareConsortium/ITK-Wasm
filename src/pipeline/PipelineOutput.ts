import IOTypes from '../core/IOTypes.js'
import Image from '../core/Image.js'
import Mesh from '../core/Mesh.js'
import PolyData from '../core/vtkPolyData.js'

interface PipelineOutput {
  path: string;
  type: typeof IOTypes[keyof typeof IOTypes];
  data?: string | Uint8Array | Image | Mesh | PolyData;
}

export default PipelineOutput
