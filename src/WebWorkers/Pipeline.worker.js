import registerWebworker from 'webworker-promise/lib/register'

import loadEmscriptenModule from '../loadEmscriptenModuleBrowser'
import runPipelineEmscripten from '../runPipelineEmscripten'
import IOTypes from '../IOTypes'

// To cache loaded pipeline modules
let pipelinePathToModule = {}

const runPipeline = (pipelinePath, args, outputs, inputs, config) => {
  let pipelineModule = null
  if (pipelinePath in pipelinePathToModule) {
    pipelineModule = pipelinePathToModule[pipelinePath]
  } else {
    pipelinePathToModule[pipelinePath] = loadEmscriptenModule(config.itkModulesPath, 'Pipelines', pipelinePath)
    pipelineModule = pipelinePathToModule[pipelinePath]
  }
  const result = runPipelineEmscripten(pipelineModule, args, outputs, inputs)

  const transferables = []
  if (result.outputs) {
    result.outputs.forEach(function (output) {
      switch(output.type) {
      // Binary data
      case IOTypes.Binary:
        if (output.data.buffer) {
          transferables.push(output.data.buffer)
        } else if (output.data.byteLength) {
          transferables.push(output.data)
        }
        break
      // Image data
      case IOTypes.Image:
        if (output.data.data.buffer) {
          transferables.push(output.data.data.buffer)
        } else if (output.data.data.byteLength) {
          transferables.push(output.data.data)
        }
        break
      // Mesh data
      case IOTypes.Mesh:
        if (output.data.points) {
          if (output.data.points.buffer) {
            transferables.push(output.data.points.buffer)
          } else if (output.data.points.byteLength) {
            transferables.push(output.data.points)
          }
        }
        if (output.data.pointData) {
          if (output.data.pointData.buffer) {
            transferables.push(output.data.pointData.buffer)
          } else if (output.data.pointData.byteLength) {
            transferables.push(output.data.pointData)
          }
        }
        if (output.data.cells) {
          if (output.data.cells.buffer) {
            transferables.push(output.data.cells.buffer)
          } else if (output.data.cells.byteLength) {
            transferables.push(output.data.cells)
          }
        }
        if (output.data.cellData) {
          if (output.data.cellData.buffer) {
            transferables.push(output.data.cellData.buffer)
          } else if (output.data.cellData.byteLength) {
            transferables.push(output.data.cellData)
          }
        }
        break
      // vtkPolyData data
      case IOTypes.vtkPolyData:
        const polyData = output.data
        const cellTypes = ['points', 'verts', 'lines', 'polys', 'strips']
        cellTypes.forEach((cellName) => {
          if (polyData[cellName]) {
            if (polyData[cellName]['buffer']) {
              transferables.push(polyData[cellName]['buffer'])
            }
          }
        })

        const dataSetType = ['pointData', 'cellData', 'fieldData']
        dataSetType.forEach((dataName) => {
          if (polyData[dataName]) {
            const data = polyData[dataName]
            data.arrays.forEach((array) => {
              if (array.data['buffer']) {
                transferables.push(array.data['buffer'])
              }
            })
          }
        })
        break
      }
    })
  }

  return new registerWebworker.TransferableResponse(result, transferables)
}

registerWebworker(function (input) {
  if (input.operation === 'runPipeline') {
    return Promise.resolve(runPipeline(input.pipelinePath, input.args, input.outputs, input.inputs, input.config))
  } else {
    return Promise.resolve(new Error('Unknown worker operation'))
  }
})
