const IOTypes = require('./IOTypes.js')
const bufferToTypedArray = require('./bufferToTypedArray.js')

const runPipelineEmscripten = (module, args, outputs, inputs) => {
  if (inputs) {
    inputs.forEach(function (input) {
      switch (input.type) {
        case IOTypes.Text:
          module.writeFile(input.path, input.data)
          break
        case IOTypes.Binary:
          module.writeFile(input.path, input.data)
          break
        case IOTypes.Image:
          let imageJSON = {}
          for (let key in input.data) {
            if (input.data.hasOwnProperty(key) && key !== 'data') {
              imageJSON[key] = input.data[key]
            }
          }
          imageJSON['data'] = input.path + '.data'
          module.writeFile(input.path, JSON.stringify(imageJSON))
          module.writeFile(imageJSON.data, new Uint8Array(input.data.data.buffer))
          break
        case IOTypes.Mesh:
          let meshJSON = {}
          for (let key in input.data) {
            if (input.data.hasOwnProperty(key) &&
              key !== 'points' &&
              key !== 'pointData' &&
              key !== 'cells' &&
              key !== 'cellData') {
              meshJSON[key] = input.data[key]
            }
          }
          meshJSON['points'] = input.path + '.points.data'
          meshJSON['pointData'] = input.path + '.pointData.data'
          meshJSON['cells'] = input.path + '.cells.data'
          meshJSON['cellData'] = input.path + '.cellData.data'
          module.writeFile(input.path, JSON.stringify(meshJSON))
          if (meshJSON.numberOfPoints) {
            module.writeFile(meshJSON.points, new Uint8Array(input.data.points.buffer))
          }
          if (meshJSON.numberOfPointPixels) {
            module.writeFile(meshJSON.pointData, new Uint8Array(input.data.pointData.buffer))
          }
          if (meshJSON.numberOfCells) {
            module.writeFile(meshJSON.cells, new Uint8Array(input.data.cells.buffer))
          }
          if (meshJSON.numberOfCellPixels) {
            module.writeFile(meshJSON.cellData, new Uint8Array(input.data.cellData.buffer))
          }
          break
        default:
          throw Error('Unsupported input IOType')
      }
    })
  }

  module.resetModuleStdout()
  module.resetModuleStderr()
  module.callMain(args)
  const stdout = module.getModuleStdout()
  const stderr = module.getModuleStderr()

  let populatedOutputs = []
  if (outputs) {
    outputs.forEach(function (output) {
      let populatedOutput = {}
      Object.assign(populatedOutput, output)
      switch (output.type) {
        case IOTypes.Text:
          populatedOutput['data'] = module.readFile(output.path, { encoding: 'utf8' })
          break
        case IOTypes.Binary:
          populatedOutput['data'] = module.readFile(output.path, { encoding: 'binary' })
          break
        case IOTypes.Image:
          const imageJSON = module.readFile(output.path, { encoding: 'utf8' })
          let image = JSON.parse(imageJSON)
          const dataUint8 = module.readFile(image.data, { encoding: 'binary' })
          image['data'] = bufferToTypedArray(image.imageType.componentType, dataUint8.buffer)
          populatedOutput['data'] = image
          break
        case IOTypes.Mesh:
          const meshJSON = module.readFile(output.path, { encoding: 'utf8' })
          let mesh = JSON.parse(meshJSON)
          if (mesh.numberOfPoints) {
            const dataUint8Points = module.readFile(mesh.points, { encoding: 'binary' })
            mesh['points'] = bufferToTypedArray(mesh.meshType.pointComponentType, dataUint8Points.buffer)
          } else {
            mesh['points'] = bufferToTypedArray(mesh.meshType.pointComponentType, new ArrayBuffer(0))
          }
          if (mesh.numberOfPointPixels) {
            const dataUint8PointData = module.readFile(mesh.pointData, { encoding: 'binary' })
            mesh['pointData'] = bufferToTypedArray(mesh.meshType.pointPixelComponentType, dataUint8PointData.buffer)
          } else {
            mesh['pointData'] = bufferToTypedArray(mesh.meshType.pointPixelComponentType, new ArrayBuffer(0))
          }
          if (mesh.numberOfCells) {
            const dataUint8Cells = module.readFile(mesh.cells, { encoding: 'binary' })
            mesh['cells'] = bufferToTypedArray(mesh.meshType.cellComponentType, dataUint8Cells.buffer)
          } else {
            mesh['cells'] = bufferToTypedArray(mesh.meshType.cellComponentType, new ArrayBuffer(0))
          }
          if (mesh.numberOfCellPixels) {
            const dataUint8CellData = module.readFile(mesh.cellData, { encoding: 'binary' })
            mesh['cellData'] = bufferToTypedArray(mesh.meshType.cellPixelComponentType, dataUint8CellData.buffer)
          } else {
            mesh['cellData'] = bufferToTypedArray(mesh.meshType.cellPixelComponentType, new ArrayBuffer(0))
          }
          populatedOutput['data'] = mesh
          break
        default:
          throw Error('Unsupported output IOType')
      }
      populatedOutputs.push(populatedOutput)
    })
  }

  return { stdout, stderr, outputs: populatedOutputs }
}

module.exports = runPipelineEmscripten
