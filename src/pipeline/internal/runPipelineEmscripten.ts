import InterfaceTypes from '../../core/InterfaceTypes.js'
import IOTypes from '../../core/IOTypes.js'
import bufferToTypedArray from '../../core/bufferToTypedArray.js'
import TypedArray from '../../core/TypedArray.js'
import TextStream from '../../core/TextStream.js'
import BinaryStream from '../../core/BinaryStream.js'
import TextFile from '../../core/TextFile.js'
import BinaryFile from '../../core/BinaryFile.js'
import Image from '../../core/Image.js'
import Mesh from '../../core/Mesh.js'
import PolyData from '../../core/vtkPolyData.js'
import FloatTypes from '../../core/FloatTypes.js'
import IntTypes from '../../core/IntTypes.js'

import PipelineEmscriptenModule from '../PipelineEmscriptenModule.js'
import PipelineInput from '../PipelineInput.js'
import PipelineOutput from '../PipelineOutput.js'
import RunPipelineResult from '../RunPipelineResult.js'

const haveSharedArrayBuffer = typeof globalThis.SharedArrayBuffer === 'function'
const encoder = new TextEncoder()
const decoder = new TextDecoder('utf-8')

function typedArrayForBuffer (typedArrayType: string, buffer: ArrayBuffer): TypedArray {
  let TypedArrayFunction = null
  // Node.js
  // @ts-expect-error: error TS7053: Element implicitly has an 'any' type because
  // expression of type 'string' can't be used to index type 'Global &
  // typeof globalThis'.
  TypedArrayFunction = globalThis[typedArrayType] as TypedArray
  // @ts-expect-error: error TS2351: This expression is not constructable.
  return new TypedArrayFunction(buffer)
}

function readFileSharedArray (emscriptenModule: PipelineEmscriptenModule, path: string): Uint8Array {
  const opts = { flags: 'r', encoding: 'binary' }
  const stream = emscriptenModule.fs_open(path, opts.flags)
  const stat = emscriptenModule.fs_stat(path)
  const length = stat.size
  let arrayBufferData = null
  if (haveSharedArrayBuffer) {
    arrayBufferData = new SharedArrayBuffer(length) // eslint-disable-line
  } else {
    arrayBufferData = new ArrayBuffer(length)
  }
  const array = new Uint8Array(arrayBufferData)
  emscriptenModule.fs_read(stream, array, 0, length, 0)
  emscriptenModule.fs_close(stream)
  return array
}

function memoryUint8SharedArray (emscriptenModule: PipelineEmscriptenModule, byteOffset: number, length: number): Uint8Array {
  let arrayBufferData = null
  if (haveSharedArrayBuffer) {
    arrayBufferData = new SharedArrayBuffer(length) // eslint-disable-line
  } else {
    arrayBufferData = new ArrayBuffer(length)
  }
  const array = new Uint8Array(arrayBufferData)
  const dataArrayView = new Uint8Array(emscriptenModule.HEAPU8.buffer, byteOffset, length)
  array.set(dataArrayView)
  return array
}

function setPipelineModuleInputArray (emscriptenModule: PipelineEmscriptenModule, dataArray: TypedArray | null, inputIndex: number, subIndex: number): number {
  let dataPtr = 0
  if (dataArray !== null) {
    dataPtr = emscriptenModule.ccall('itk_wasm_input_array_alloc', 'number', ['number', 'number', 'number', 'number'], [0, inputIndex, subIndex, dataArray.buffer.byteLength])
    emscriptenModule.HEAPU8.set(new Uint8Array(dataArray.buffer), dataPtr)
  }
  return dataPtr
}

function setPipelineModuleInputJSON (emscriptenModule: PipelineEmscriptenModule, dataObject: object, inputIndex: number): void {
  const dataJSON = JSON.stringify(dataObject)
  const jsonPtr = emscriptenModule.ccall('itk_wasm_input_json_alloc', 'number', ['number', 'number', 'number'], [0, inputIndex, dataJSON.length])
  emscriptenModule.writeAsciiToMemory(dataJSON, jsonPtr, false)
}

function getPipelineModuleOutputArray (emscriptenModule: PipelineEmscriptenModule, outputIndex: number, subIndex: number, componentType: typeof IntTypes[keyof typeof IntTypes] | typeof FloatTypes[keyof typeof FloatTypes]): TypedArray | null {
  const dataPtr = emscriptenModule.ccall('itk_wasm_output_array_address', 'number', ['number', 'number', 'number'], [0, outputIndex, subIndex])
  const dataSize = emscriptenModule.ccall('itk_wasm_output_array_size', 'number', ['number', 'number', 'number'], [0, outputIndex, subIndex])
  const dataUint8 = memoryUint8SharedArray(emscriptenModule, dataPtr, dataSize)
  const data = bufferToTypedArray(componentType, dataUint8.buffer)
  return data
}

function getPipelineModuleOutputJSON (emscriptenModule: PipelineEmscriptenModule, outputIndex: number): object {
  const jsonPtr = emscriptenModule.ccall('itk_wasm_output_json_address', 'number', ['number', 'number'], [0, outputIndex])
  const dataJSON = emscriptenModule.AsciiToString(jsonPtr)
  const dataObject = JSON.parse(dataJSON)
  return dataObject
}

function runPipelineEmscripten (pipelineModule: PipelineEmscriptenModule, args: string[], outputs: PipelineOutput[] | null, inputs: PipelineInput[] | null): RunPipelineResult {
  if (!(inputs == null) && inputs.length > 0) {
    inputs.forEach(function (input, index) {
      switch (input.type) {
        case InterfaceTypes.TextStream:
        {
          const dataArray = encoder.encode((input.data as TextStream).data)
          const arrayPtr = setPipelineModuleInputArray(pipelineModule, dataArray, index, 0)
          const dataJSON = { size: dataArray.buffer.byteLength, data: `data:application/vnd.itk.address,0:${arrayPtr}` }
          setPipelineModuleInputJSON(pipelineModule, dataJSON, index)
          break
        }
        case InterfaceTypes.BinaryStream:
        {
          const dataArray = (input.data as BinaryStream).data
          const arrayPtr = setPipelineModuleInputArray(pipelineModule, dataArray, index, 0)
          const dataJSON = { size: dataArray.buffer.byteLength, data: `data:application/vnd.itk.address,0:${arrayPtr}` }
          setPipelineModuleInputJSON(pipelineModule, dataJSON, index)
          break
        }
        case InterfaceTypes.TextFile:
        {
          pipelineModule.fs_writeFile((input.data as TextFile).path, (input.data as TextFile).data)
          break
        }
        case InterfaceTypes.BinaryFile:
        {
          pipelineModule.fs_writeFile((input.data as BinaryFile).path, (input.data as BinaryFile).data)
          break
        }
        case InterfaceTypes.Image:
        {
          const image = input.data as Image
          const dataPtr = setPipelineModuleInputArray(pipelineModule, image.data, index, 0)
          const directionPtr = setPipelineModuleInputArray(pipelineModule, image.direction, index, 1)
          const imageJSON = {
            imageType: image.imageType,
            name: image.name,
            origin: image.origin,
            spacing: image.spacing,
            direction: `data:application/vnd.itk.address,0:${directionPtr}`,
            size: image.size,
            data: `data:application/vnd.itk.address,0:${dataPtr}`
          }
          setPipelineModuleInputJSON(pipelineModule, imageJSON, index)
          break
        }
        case InterfaceTypes.Mesh:
        {
          const mesh = input.data as Mesh
          const pointsPtr = setPipelineModuleInputArray(pipelineModule, mesh.points, index, 0)
          const cellsPtr = setPipelineModuleInputArray(pipelineModule, mesh.cells, index, 1)
          const pointDataPtr = setPipelineModuleInputArray(pipelineModule, mesh.pointData, index, 2)
          const cellDataPtr = setPipelineModuleInputArray(pipelineModule, mesh.pointData, index, 3)
          const meshJSON = {
            meshType: mesh.meshType,
            name: mesh.name,

            numberOfPoints: mesh.numberOfPoints,
            points: `data:application/vnd.itk.address,0:${pointsPtr}`,

            numberOfCells: mesh.numberOfCells,
            cells: `data:application/vnd.itk.address,0:${cellsPtr}`,
            cellBufferSize: mesh.cellBufferSize,

            numberOfPointPixels: mesh.numberOfPointPixels,
            pointData: `data:application/vnd.itk.address,0:${pointDataPtr}`,

            numberOfCellPixels: mesh.numberOfCellPixels,
            cellData: `data:application/vnd.itk.address,0:${cellDataPtr}`
          }
          setPipelineModuleInputJSON(pipelineModule, meshJSON, index)
          break
        }
        case IOTypes.Text:
        {
          pipelineModule.fs_writeFile(input.path, input.data as string)
          break
        }
        case IOTypes.Binary:
        {
          pipelineModule.fs_writeFile(input.path, input.data as Uint8Array)
          break
        }
        case IOTypes.Image:
        {
          const image = input.data as Image
          const imageJSON = {
            imageType: image.imageType,
            name: image.name,
            origin: image.origin,
            spacing: image.spacing,
            direction: 'data:application/vnd.itk.path,data/direction.raw',
            size: image.size,
            data: 'data:application/vnd.itk.path,data/data.raw'
          }
          pipelineModule.fs_mkdirs(`${input.path}/data`)
          pipelineModule.fs_writeFile(`${input.path}/index.json`, JSON.stringify(imageJSON))
          if (image.data === null) {
            throw Error('image.data is null')
          }
          pipelineModule.fs_writeFile(`${input.path}/data/data.raw`, new Uint8Array(image.data.buffer))
          pipelineModule.fs_writeFile(`${input.path}/data/direction.raw`, new Uint8Array(image.direction.buffer))
          break
        }
        case IOTypes.Mesh:
        {
          const mesh = input.data as Mesh
          const meshJSON = {
            meshType: mesh.meshType,
            name: mesh.name,

            numberOfPoints: mesh.numberOfPoints,
            points: 'data:application/vnd.itk.path,data/points.raw',

            numberOfPointPixels: mesh.numberOfPointPixels,
            pointData: 'data:application/vnd.itk.path,data/pointData.raw',

            numberOfCells: mesh.numberOfCells,
            cells: 'data:application/vnd.itk.path,data/cells.raw',

            numberOfCellPixels: mesh.numberOfCellPixels,
            cellData: 'data:application/vnd.itk.path,data/cellData.raw',
            cellBufferSize: mesh.cellBufferSize

          }
          pipelineModule.fs_mkdirs(`${input.path}/data`)
          pipelineModule.fs_writeFile(`${input.path}/index.json`, JSON.stringify(meshJSON))
          if (meshJSON.numberOfPoints > 0) {
            if (mesh.points === null) {
              throw Error('mesh.points is null')
            }
            pipelineModule.fs_writeFile(`${input.path}/data/points.raw`, new Uint8Array(mesh.points.buffer))
          }
          if (meshJSON.numberOfPointPixels > 0) {
            if (mesh.pointData === null) {
              throw Error('mesh.pointData is null')
            }
            pipelineModule.fs_writeFile(`${input.path}/data/pointData.raw`, new Uint8Array(mesh.pointData.buffer))
          }
          if (meshJSON.numberOfCells > 0) {
            if (mesh.cells === null) {
              throw Error('mesh.cells is null')
            }
            pipelineModule.fs_writeFile(`${input.path}/data/cells.raw`, new Uint8Array(mesh.cells.buffer))
          }
          if (meshJSON.numberOfCellPixels > 0) {
            if (mesh.cellData === null) {
              throw Error('mesh.cellData is null')
            }
            pipelineModule.fs_writeFile(`${input.path}/data/cellData.raw`, new Uint8Array(mesh.cellData.buffer))
          }
          break
        }
        default:
          throw Error('Unsupported input InterfaceType')
      }
    })
  }

  pipelineModule.resetModuleStdout()
  pipelineModule.resetModuleStderr()
  let returnValue = 0
  try {
    returnValue = pipelineModule.callMain(args)
  } catch (exception) {
    // Note: Module must be built with CMAKE_BUILD_TYPE set to Debug.
    // e.g.: itk-wasm build my/project -- -DCMAKE_BUILD_TYPE:STRING=Debug
    if (typeof exception === 'number') {
      console.log('Exception while running pipeline:')
      console.log('stdout:', pipelineModule.getModuleStdout())
      console.error('stderr:', pipelineModule.getModuleStderr())
      if (typeof pipelineModule.getExceptionMessage !== 'undefined') {
        console.error('exception:', pipelineModule.getExceptionMessage(exception))
      } else {
        console.error('Build module in Debug mode for exception message information.')
      }
    }
    throw exception
  }
  const stdout = pipelineModule.getModuleStdout()
  const stderr = pipelineModule.getModuleStderr()

  const populatedOutputs: PipelineOutput[] = []
  if (!(outputs == null) && outputs.length > 0 && returnValue === 0) {
    outputs.forEach(function (output, index) {
      let outputData: any = null
      switch (output.type) {
        case InterfaceTypes.TextStream:
        {
          // const jsonPtr = pipelineModule.ccall('itk_wasm_output_json_address', 'number', ['number', 'number'], [0, index])
          // const jsonSize = pipelineModule.ccall('itk_wasm_output_json_size', 'number', ['number', 'number'], [0, index])
          // const jsonArray = pipelineModule.HEAPU8.slice(jsonPtr, jsonPtr + jsonSize)
          // const dataJSON = JSON.parse(decoder.decode(jsonArray))
          const dataPtr = pipelineModule.ccall('itk_wasm_output_array_address', 'number', ['number', 'number', 'number'], [0, index, 0])
          const dataSize = pipelineModule.ccall('itk_wasm_output_array_size', 'number', ['number', 'number', 'number'], [0, index, 0])
          const dataArrayView = new Uint8Array(pipelineModule.HEAPU8.buffer, dataPtr, dataSize)
          outputData = { data: decoder.decode(dataArrayView) }
          break
        }
        case InterfaceTypes.BinaryStream:
        {
          // const jsonPtr = pipelineModule.ccall('itk_wasm_output_json_address', 'number', ['number', 'number'], [0, index])
          // const jsonSize = pipelineModule.ccall('itk_wasm_output_json_size', 'number', ['number', 'number'], [0, index])
          // const jsonArray = pipelineModule.HEAPU8.slice(jsonPtr, jsonPtr + jsonSize)
          // const dataJSON = JSON.parse(decoder.decode(jsonArray))
          const dataPtr = pipelineModule.ccall('itk_wasm_output_array_address', 'number', ['number', 'number', 'number'], [0, index, 0])
          const dataSize = pipelineModule.ccall('itk_wasm_output_array_size', 'number', ['number', 'number', 'number'], [0, index, 0])
          outputData = { data: memoryUint8SharedArray(pipelineModule, dataPtr, dataSize) }
          break
        }
        case InterfaceTypes.TextFile:
        {
          outputData = { path: (output.data as TextFile).path, data: pipelineModule.fs_readFile((output.data as TextFile).path, { encoding: 'utf8' }) as string }
          break
        }
        case InterfaceTypes.BinaryFile:
        {
          outputData = { path: (output.data as BinaryFile).path, data: readFileSharedArray(pipelineModule, (output.data as BinaryFile).path) }
          break
        }
        case InterfaceTypes.Image:
        {
          const image = getPipelineModuleOutputJSON(pipelineModule, index) as Image
          image.data = getPipelineModuleOutputArray(pipelineModule, index, 0, image.imageType.componentType)
          image.direction = getPipelineModuleOutputArray(pipelineModule, index, 1, FloatTypes.Float64) as Float64Array
          outputData = image
          break
        }
        case InterfaceTypes.Mesh:
        {
          const mesh = getPipelineModuleOutputJSON(pipelineModule, index) as Mesh
          if (mesh.numberOfPoints > 0) {
            mesh.points = getPipelineModuleOutputArray(pipelineModule, index, 0, mesh.meshType.pointComponentType)
          } else {
            mesh.points = bufferToTypedArray(mesh.meshType.pointComponentType, new ArrayBuffer(0))
          }
          if (mesh.numberOfCells > 0) {
            mesh.cells = getPipelineModuleOutputArray(pipelineModule, index, 1, mesh.meshType.cellComponentType)
          } else {
            mesh.cells = bufferToTypedArray(mesh.meshType.cellComponentType, new ArrayBuffer(0))
          }
          if (mesh.numberOfPointPixels > 0) {
            mesh.pointData = getPipelineModuleOutputArray(pipelineModule, index, 2, mesh.meshType.pointPixelComponentType)
          } else {
            mesh.pointData = bufferToTypedArray(mesh.meshType.pointPixelComponentType, new ArrayBuffer(0))
          }
          if (mesh.numberOfCellPixels > 0) {
            mesh.cellData = getPipelineModuleOutputArray(pipelineModule, index, 3, mesh.meshType.cellPixelComponentType)
          } else {
            mesh.cellData = bufferToTypedArray(mesh.meshType.cellPixelComponentType, new ArrayBuffer(0))
          }
          outputData = mesh
          break
        }
        case IOTypes.Text:
        {
          if (typeof output.path === 'undefined') {
            throw new Error('output.path not defined')
          }
          outputData = pipelineModule.fs_readFile(output.path, { encoding: 'utf8' }) as string
          break
        }
        case IOTypes.Binary:
        {
          if (typeof output.path === 'undefined') {
            throw new Error('output.path not defined')
          }
          outputData = readFileSharedArray(pipelineModule, output.path)
          break
        }
        case IOTypes.Image:
        {
          if (typeof output.path === 'undefined') {
            throw new Error('output.path not defined')
          }
          const imageJSON = pipelineModule.fs_readFile(`${output.path}/index.json`, { encoding: 'utf8' }) as string
          const image = JSON.parse(imageJSON)
          const dataUint8 = readFileSharedArray(pipelineModule, `${output.path}/data/data.raw`)
          image.data = bufferToTypedArray(image.imageType.componentType, dataUint8.buffer)
          const directionUint8 = readFileSharedArray(pipelineModule, `${output.path}/data/direction.raw`)
          image.direction = bufferToTypedArray(FloatTypes.Float64, directionUint8.buffer)
          outputData = image as Image
          break
        }
        case IOTypes.Mesh:
        {
          if (typeof output.path === 'undefined') {
            throw new Error('output.path not defined')
          }
          const meshJSON = pipelineModule.fs_readFile(`${output.path}/index.json`, { encoding: 'utf8' }) as string
          const mesh = JSON.parse(meshJSON)
          if (mesh.numberOfPoints > 0) {
            const dataUint8Points = readFileSharedArray(pipelineModule, `${output.path}/data/points.raw`)
            mesh.points = bufferToTypedArray(mesh.meshType.pointComponentType, dataUint8Points.buffer)
          } else {
            mesh.points = bufferToTypedArray(mesh.meshType.pointComponentType, new ArrayBuffer(0))
          }
          if (mesh.numberOfPointPixels > 0) {
            const dataUint8PointData = readFileSharedArray(pipelineModule, `${output.path}/data/pointData.raw`)
            mesh.pointData = bufferToTypedArray(mesh.meshType.pointPixelComponentType, dataUint8PointData.buffer)
          } else {
            mesh.pointData = bufferToTypedArray(mesh.meshType.pointPixelComponentType, new ArrayBuffer(0))
          }
          if (mesh.numberOfCells > 0) {
            const dataUint8Cells = readFileSharedArray(pipelineModule, `${output.path}/data/cells.raw`)
            mesh.cells = bufferToTypedArray(mesh.meshType.cellComponentType, dataUint8Cells.buffer)
          } else {
            mesh.cells = bufferToTypedArray(mesh.meshType.cellComponentType, new ArrayBuffer(0))
          }
          if (mesh.numberOfCellPixels > 0) {
            const dataUint8CellData = readFileSharedArray(pipelineModule, `${output.path}/data/cellData.raw`)
            mesh.cellData = bufferToTypedArray(mesh.meshType.cellPixelComponentType, dataUint8CellData.buffer)
          } else {
            mesh.cellData = bufferToTypedArray(mesh.meshType.cellPixelComponentType, new ArrayBuffer(0))
          }
          outputData = mesh as Mesh
          break
        }
        case IOTypes.vtkPolyData:
        {
          if (typeof output.path === 'undefined') {
            throw new Error('output.path not defined')
          }
          const polyWASMDataObject = pipelineModule.fs_readFile(`${output.path}/index.json`, { encoding: 'utf8' }) as string
          const polyData = JSON.parse(polyWASMDataObject)
          const cellTypes = ['points', 'verts', 'lines', 'polys', 'strips']
          cellTypes.forEach((cellName) => {
            if (polyData[cellName] !== undefined) {
              const cell = polyData[cellName]
              if (cell.ref !== null) {
                const dataUint8 = readFileSharedArray(pipelineModule, `${output.path}/${cell.ref.basepath}/${cell.ref.id}`) // eslint-disable-line
                polyData[cellName].buffer = dataUint8.buffer
                polyData[cellName].values = typedArrayForBuffer(polyData[cellName].dataType, dataUint8.buffer)
                delete cell.ref
              }
            }
          })

          const dataSetType = ['pointData', 'cellData', 'fieldData']
          dataSetType.forEach((dataName) => {
            if (polyData[dataName] !== undefined) {
              const data = polyData[dataName]
              data.arrays.forEach((array: { data: { ref?: { basepath: string, id: string }, buffer: ArrayBuffer, values: TypedArray, dataType: string }}) => {
                if (array.data.ref !== null && array.data.ref !== undefined) {
                  if (typeof output.path === 'undefined') {
                    throw new Error('output.path not defined')
                  }
                  const dataUint8 = readFileSharedArray(pipelineModule, `${output.path}/${array.data.ref.basepath}/${array.data.ref.id}`)
                  array.data.buffer = dataUint8.buffer
                  array.data.values = typedArrayForBuffer(array.data.dataType, dataUint8.buffer)
                  delete array.data.ref
                }
              })
            }
          })
          outputData = polyData as PolyData
          break
        }
        default:
          throw Error('Unsupported output InterfaceType')
      }
      const populatedOutput = {
        type: output.type,
        data: outputData
      }
      populatedOutputs.push(populatedOutput)
    })
  }

  return { returnValue, stdout, stderr, outputs: populatedOutputs }
}

export default runPipelineEmscripten
