import registerWebworker from 'webworker-promise/lib/register'

import loadEmscriptenModule from '../loadEmscriptenModuleBrowser'
import runPipelineEmscripten from '../runPipelineEmscripten'
import IOTypes from '../IOTypes'
import getTransferable from '../getTransferable'

// To cache loaded pipeline modules
const pipelinePathToModule = {}

function loadPipelineModule (moduleDirectory, pipelinePath, config, isAbsoluteURL) {
  let pipelineModule = null
  if (pipelinePath in pipelinePathToModule) {
    pipelineModule = pipelinePathToModule[pipelinePath]
  } else {
    pipelinePathToModule[pipelinePath] = loadEmscriptenModule(config.itkModulesPath, moduleDirectory, pipelinePath, isAbsoluteURL)
    pipelineModule = pipelinePathToModule[pipelinePath]
  }
  return pipelineModule
}

async function runPipeline (pipelineModule, args, outputs, inputs) {
  const result = runPipelineEmscripten(pipelineModule, args, outputs, inputs)

  const transferables = []
  if (result.outputs) {
    result.outputs.forEach(function (output) {
      if (output.type === IOTypes.Binary) {
          // Binary data
          const transferable = getTransferable(output.data)
          if (transferable) {
            transferables.push(transferable)
          }
      } else if (output.type === IOTypes.Image) {
          // Image data
          const transferable = getTransferable(output.data.data)
          if (transferable) {
            transferables.push(transferable)
          }
      } else if (output.type === IOTypes.Mesh) {
          // Mesh data
          if (output.data.points) {
            const transferable = getTransferable(output.data.points)
            if (transferable) {
              transferables.push(transferable)
            }
          }
          if (output.data.pointData) {
            const transferable = getTransferable(output.data.pointData)
            if (transferable) {
              transferables.push(transferable)
            }
          }
          if (output.data.cells) {
            const transferable = getTransferable(output.data.cells)
            if (transferable) {
              transferables.push(transferable)
            }
          }
          if (output.data.cellData) {
            const transferable = getTransferable(output.data.cellData)
            if (transferable) {
              transferables.push(transferable)
            }
          }
      } else if (output.type === IOTypes.vtkPolyData) {
          // vtkPolyData data
          const polyData = output.data
          const cellTypes = ['points', 'verts', 'lines', 'polys', 'strips']
          cellTypes.forEach((cellName) => {
            if (polyData[cellName]) {
              const transferable = getTransferable(polyData[cellName])
              if (transferable) {
                transferables.push(transferable)
              }
            }
          })

          const dataSetType = ['pointData', 'cellData', 'fieldData']
          dataSetType.forEach((dataName) => {
            if (polyData[dataName]) {
              const data = polyData[dataName]
              data.arrays.forEach((array) => {
                const transferable = getTransferable(array.data)
                if (transferable) {
                  transferables.push(transferable)
                }
              })
            }
          })
      }
    })
  }

  return new registerWebworker.TransferableResponse(result, transferables)
}

registerWebworker(async function (input) {
  let pipelineModule = null
  if (input.operation === 'runPipeline') {
    pipelineModule = loadPipelineModule('Pipelines', input.pipelinePath, input.config, input.isAbsoluteURL)
  } else if (input.operation === 'runPolyDataIOPipeline') {
    pipelineModule = loadPipelineModule('PolyDataIOs', input.pipelinePath, input.config, input.isAbsoluteURL)
  } else {
    throw new Error('Unknown worker operation')
  }
  return runPipeline(pipelineModule, input.args, input.outputs, input.inputs)
})
