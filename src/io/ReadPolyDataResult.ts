import vtkPolyData from '../core/vtkPolyData.js'

interface ReadPolyDataResult {
  polyData: vtkPolyData
  webWorker: Worker
}

export default ReadPolyDataResult
