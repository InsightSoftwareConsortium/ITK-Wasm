import InterfaceTypes from '../../interface-types/interface-types.js'
import bufferToTypedArray from '../../buffer-to-typed-array.js'
import TypedArray from '../../typed-array.js'
import TextStream from '../../interface-types/text-stream.js'
import BinaryStream from '../../interface-types/binary-stream.js'
import TextFile from '../../interface-types/text-file.js'
import BinaryFile from '../../interface-types/binary-file.js'
import Image from '../../interface-types/image.js'
import Mesh from '../../interface-types/mesh.js'
import PointSet from '../../interface-types/point-set.js'
import PolyData from '../../interface-types/poly-data.js'
import TransformList from '../../interface-types/transform-list.js'
import FloatTypes from '../../interface-types/float-types.js'
import IntTypes from '../../interface-types/int-types.js'

import PipelineEmscriptenModule from '../pipeline-emscripten-module.js'
import PipelineInput from '../pipeline-input.js'
import PipelineOutput from '../pipeline-output.js'
import RunPipelineResult from '../run-pipeline-result.js'

const haveSharedArrayBuffer = typeof globalThis.SharedArrayBuffer === 'function'
const encoder = new TextEncoder()
const decoder = new TextDecoder('utf-8')

function readFileSharedArray (
  emscriptenModule: PipelineEmscriptenModule,
  path: string
): Uint8Array {
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

function memoryUint8SharedArray (
  emscriptenModule: PipelineEmscriptenModule,
  byteOffset: number,
  length: number
): Uint8Array {
  let arrayBufferData = null
  if (haveSharedArrayBuffer) {
    arrayBufferData = new SharedArrayBuffer(length) // eslint-disable-line
  } else {
    arrayBufferData = new ArrayBuffer(length)
  }
  const array = new Uint8Array(arrayBufferData)
  const dataArrayView = new Uint8Array(
    emscriptenModule.HEAPU8.buffer,
    byteOffset,
    length
  )
  array.set(dataArrayView)
  return array
}

function setPipelineModuleInputArray (
  emscriptenModule: PipelineEmscriptenModule,
  dataArray: TypedArray | null,
  inputIndex: number,
  subIndex: number
): number {
  let dataPtr = 0
  if (dataArray !== null) {
    dataPtr = emscriptenModule.ccall(
      'itk_wasm_input_array_alloc',
      'number',
      ['number', 'number', 'number', 'number'],
      [0, inputIndex, subIndex, dataArray.buffer.byteLength]
    )
    emscriptenModule.HEAPU8.set(new Uint8Array(dataArray.buffer), dataPtr)
  }
  return dataPtr
}

function setPipelineModuleInputJSON (
  emscriptenModule: PipelineEmscriptenModule,
  dataObject: object,
  inputIndex: number
): void {
  const dataJSON = JSON.stringify(dataObject)
  const length = emscriptenModule.lengthBytesUTF8(dataJSON) + 1
  const jsonPtr = emscriptenModule.ccall(
    'itk_wasm_input_json_alloc',
    'number',
    ['number', 'number', 'number'],
    [0, inputIndex, length]
  )
  emscriptenModule.stringToUTF8(dataJSON, jsonPtr, length)
}

function getPipelineModuleOutputArray (
  emscriptenModule: PipelineEmscriptenModule,
  outputIndex: number,
  subIndex: number,
  componentType:
  | (typeof IntTypes)[keyof typeof IntTypes]
  | (typeof FloatTypes)[keyof typeof FloatTypes]
): TypedArray | Float32Array | Uint32Array | null {
  const dataPtr = emscriptenModule.ccall(
    'itk_wasm_output_array_address',
    'number',
    ['number', 'number', 'number'],
    [0, outputIndex, subIndex]
  )
  const dataSize = emscriptenModule.ccall(
    'itk_wasm_output_array_size',
    'number',
    ['number', 'number', 'number'],
    [0, outputIndex, subIndex]
  )
  const dataUint8 = memoryUint8SharedArray(emscriptenModule, dataPtr, dataSize)
  const data = bufferToTypedArray(componentType, dataUint8.buffer)
  return data
}

function getPipelineModuleOutputJSON (
  emscriptenModule: PipelineEmscriptenModule,
  outputIndex: number
): object {
  const jsonPtr = emscriptenModule.ccall(
    'itk_wasm_output_json_address',
    'number',
    ['number', 'number'],
    [0, outputIndex]
  )
  const dataJSON = emscriptenModule.UTF8ToString(jsonPtr)
  const dataObject = JSON.parse(dataJSON)
  return dataObject
}

function runPipelineEmscripten (
  pipelineModule: PipelineEmscriptenModule,
  args: string[],
  outputs: PipelineOutput[] | null,
  inputs: PipelineInput[] | null
): RunPipelineResult {
  if (!(inputs == null) && inputs.length > 0) {
    inputs.forEach(function (input, index) {
      switch (input.type) {
        case InterfaceTypes.TextStream: {
          const dataArray = encoder.encode((input.data as TextStream).data)
          const arrayPtr = setPipelineModuleInputArray(
            pipelineModule,
            dataArray,
            index,
            0
          )
          const dataJSON = {
            size: dataArray.buffer.byteLength,
            data: `data:application/vnd.itk.address,0:${arrayPtr}`
          }
          setPipelineModuleInputJSON(pipelineModule, dataJSON, index)
          break
        }
        case InterfaceTypes.JsonCompatible: {
          const dataArray = encoder.encode(JSON.stringify(input.data))
          const arrayPtr = setPipelineModuleInputArray(
            pipelineModule,
            dataArray,
            index,
            0
          )
          const dataJSON = {
            size: dataArray.buffer.byteLength,
            data: `data:application/vnd.itk.address,0:${arrayPtr}`
          }
          setPipelineModuleInputJSON(pipelineModule, dataJSON, index)
          break
        }
        case InterfaceTypes.BinaryStream: {
          const dataArray = (input.data as BinaryStream).data
          const arrayPtr = setPipelineModuleInputArray(
            pipelineModule,
            dataArray,
            index,
            0
          )
          const dataJSON = {
            size: dataArray.buffer.byteLength,
            data: `data:application/vnd.itk.address,0:${arrayPtr}`
          }
          setPipelineModuleInputJSON(pipelineModule, dataJSON, index)
          break
        }
        case InterfaceTypes.TextFile: {
          pipelineModule.fs_writeFile(
            (input.data as TextFile).path,
            (input.data as TextFile).data
          )
          break
        }
        case InterfaceTypes.BinaryFile: {
          pipelineModule.fs_writeFile(
            (input.data as BinaryFile).path,
            (input.data as BinaryFile).data
          )
          break
        }
        case InterfaceTypes.Image: {
          const image = input.data as Image
          const dataPtr = setPipelineModuleInputArray(
            pipelineModule,
            image.data,
            index,
            0
          )
          const directionPtr = setPipelineModuleInputArray(
            pipelineModule,
            image.direction,
            index,
            1
          )
          const metadata =
            typeof image.metadata?.entries !== 'undefined'
              ? Array.from(image.metadata.entries())
              : []
          const imageJSON = {
            imageType: image.imageType,
            name: image.name,
            origin: image.origin,
            spacing: image.spacing,
            direction: `data:application/vnd.itk.address,0:${directionPtr}`,
            size: image.size,
            data: `data:application/vnd.itk.address,0:${dataPtr}`,
            metadata
          }
          setPipelineModuleInputJSON(pipelineModule, imageJSON, index)
          break
        }
        case InterfaceTypes.Mesh: {
          const mesh = input.data as Mesh
          const pointsPtr = setPipelineModuleInputArray(
            pipelineModule,
            mesh.points,
            index,
            0
          )
          const cellsPtr = setPipelineModuleInputArray(
            pipelineModule,
            mesh.cells,
            index,
            1
          )
          const pointDataPtr = setPipelineModuleInputArray(
            pipelineModule,
            mesh.pointData,
            index,
            2
          )
          const cellDataPtr = setPipelineModuleInputArray(
            pipelineModule,
            mesh.cellData,
            index,
            3
          )
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
        case InterfaceTypes.PointSet: {
          const pointSet = input.data as PointSet
          const pointsPtr = setPipelineModuleInputArray(
            pipelineModule,
            pointSet.points,
            index,
            0
          )
          const pointDataPtr = setPipelineModuleInputArray(
            pipelineModule,
            pointSet.pointData,
            index,
            1
          )
          const pointSetJSON = {
            pointSetType: pointSet.pointSetType,
            name: pointSet.name,

            numberOfPoints: pointSet.numberOfPoints,
            points: `data:application/vnd.itk.address,0:${pointsPtr}`,

            numberOfPointPixels: pointSet.numberOfPointPixels,
            pointData: `data:application/vnd.itk.address,0:${pointDataPtr}`
          }
          setPipelineModuleInputJSON(pipelineModule, pointSetJSON, index)
          break
        }
        case InterfaceTypes.TransformList: {
          const transformList = input.data as TransformList
          const transformListJSON: any = []
          transformList.forEach((transform, transformIndex) => {
            const fixedParameterPtr = setPipelineModuleInputArray(
              pipelineModule,
              transform.fixedParameters,
              index,
              transformIndex * 2
            )
            const fixedParameters = `data:application/vnd.itk.address,0:${fixedParameterPtr}`
            const parameterPtr = setPipelineModuleInputArray(
              pipelineModule,
              transform.parameters,
              index,
              transformIndex * 2 + 1
            )
            const parameters = `data:application/vnd.itk.address,0:${parameterPtr}`
            const transformJSON = {
              transformType: transform.transformType,
              numberOfFixedParameters: transform.numberOfFixedParameters,
              numberOfParameters: transform.numberOfParameters,

              name: transform.name,

              inputSpaceName: transform.inputSpaceName,
              outputSpaceName: transform.outputSpaceName,

              parameters,
              fixedParameters
            }
            transformListJSON.push(transformJSON)
          })
          setPipelineModuleInputJSON(pipelineModule, transformListJSON, index)
          break
        }
        case InterfaceTypes.PolyData: {
          const polyData = input.data as PolyData
          const pointsPtr = setPipelineModuleInputArray(
            pipelineModule,
            polyData.points,
            index,
            0
          )
          const verticesPtr = setPipelineModuleInputArray(
            pipelineModule,
            polyData.vertices,
            index,
            1
          )
          const linesPtr = setPipelineModuleInputArray(
            pipelineModule,
            polyData.lines,
            index,
            2
          )
          const polygonsPtr = setPipelineModuleInputArray(
            pipelineModule,
            polyData.polygons,
            index,
            3
          )
          const triangleStripsPtr = setPipelineModuleInputArray(
            pipelineModule,
            polyData.triangleStrips,
            index,
            4
          )
          const pointDataPtr = setPipelineModuleInputArray(
            pipelineModule,
            polyData.pointData,
            index,
            5
          )
          const cellDataPtr = setPipelineModuleInputArray(
            pipelineModule,
            polyData.pointData,
            index,
            6
          )
          const polyDataJSON = {
            polyDataType: polyData.polyDataType,
            name: polyData.name,

            numberOfPoints: polyData.numberOfPoints,
            points: `data:application/vnd.itk.address,0:${pointsPtr}`,

            verticesBufferSize: polyData.verticesBufferSize,
            vertices: `data:application/vnd.itk.address,0:${verticesPtr}`,

            linesBufferSize: polyData.linesBufferSize,
            lines: `data:application/vnd.itk.address,0:${linesPtr}`,

            polygonsBufferSize: polyData.polygonsBufferSize,
            polygons: `data:application/vnd.itk.address,0:${polygonsPtr}`,

            triangleStripsBufferSize: polyData.triangleStripsBufferSize,
            triangleStrips: `data:application/vnd.itk.address,0:${triangleStripsPtr}`,

            numberOfPointPixels: polyData.numberOfPointPixels,
            pointData: `data:application/vnd.itk.address,0:${pointDataPtr}`,

            numberOfCellPixels: polyData.numberOfCellPixels,
            cellData: `data:application/vnd.itk.address,0:${cellDataPtr}`
          }
          setPipelineModuleInputJSON(pipelineModule, polyDataJSON, index)
          break
        }
        default:
          throw Error('Unsupported input InterfaceType')
      }
    })
  }

  pipelineModule.resetModuleStdout()
  pipelineModule.resetModuleStderr()
  const stackPtr = pipelineModule.stackSave()
  let returnValue = 0
  try {
    returnValue = pipelineModule.callMain(args.slice())
  } catch (exception) {
    // Note: Module must be built with CMAKE_BUILD_TYPE set to Debug.
    // e.g.: itk-wasm build my/project -- -DCMAKE_BUILD_TYPE:STRING=Debug
    if (typeof exception === 'number') {
      console.log('Exception while running pipeline:')
      console.log('stdout:', pipelineModule.getModuleStdout())
      console.error('stderr:', pipelineModule.getModuleStderr())
      if (typeof pipelineModule.getExceptionMessage !== 'undefined') {
        console.error(
          'exception:',
          pipelineModule.getExceptionMessage(exception)
        )
      } else {
        console.error(
          'Build module in Debug mode for exception message information.'
        )
      }
    }
    throw exception
  } finally {
    pipelineModule.stackRestore(stackPtr)
  }
  const stdout = pipelineModule.getModuleStdout()
  const stderr = pipelineModule.getModuleStderr()

  const populatedOutputs: PipelineOutput[] = []
  if (!(outputs == null) && outputs.length > 0 && returnValue === 0) {
    outputs.forEach(function (output, index) {
      let outputData: any = null
      switch (output.type) {
        case InterfaceTypes.TextStream: {
          const dataPtr = pipelineModule.ccall(
            'itk_wasm_output_array_address',
            'number',
            ['number', 'number', 'number'],
            [0, index, 0]
          )
          const dataSize = pipelineModule.ccall(
            'itk_wasm_output_array_size',
            'number',
            ['number', 'number', 'number'],
            [0, index, 0]
          )
          const dataArrayView = new Uint8Array(
            pipelineModule.HEAPU8.buffer,
            dataPtr,
            dataSize
          )
          outputData = { data: decoder.decode(dataArrayView) }
          break
        }
        case InterfaceTypes.JsonCompatible: {
          const dataPtr = pipelineModule.ccall(
            'itk_wasm_output_array_address',
            'number',
            ['number', 'number', 'number'],
            [0, index, 0]
          )
          const dataSize = pipelineModule.ccall(
            'itk_wasm_output_array_size',
            'number',
            ['number', 'number', 'number'],
            [0, index, 0]
          )
          const dataArrayView = new Uint8Array(
            pipelineModule.HEAPU8.buffer,
            dataPtr,
            dataSize
          )
          outputData = JSON.parse(decoder.decode(dataArrayView))
          break
        }
        case InterfaceTypes.BinaryStream: {
          const dataPtr = pipelineModule.ccall(
            'itk_wasm_output_array_address',
            'number',
            ['number', 'number', 'number'],
            [0, index, 0]
          )
          const dataSize = pipelineModule.ccall(
            'itk_wasm_output_array_size',
            'number',
            ['number', 'number', 'number'],
            [0, index, 0]
          )
          outputData = {
            data: memoryUint8SharedArray(pipelineModule, dataPtr, dataSize)
          }
          break
        }
        case InterfaceTypes.TextFile: {
          outputData = {
            path: (output.data as TextFile).path,
            data: pipelineModule.fs_readFile((output.data as TextFile).path, {
              encoding: 'utf8'
            }) as string
          }
          break
        }
        case InterfaceTypes.BinaryFile: {
          outputData = {
            path: (output.data as BinaryFile).path,
            data: readFileSharedArray(
              pipelineModule,
              (output.data as BinaryFile).path
            )
          }
          break
        }
        case InterfaceTypes.Image: {
          const image = getPipelineModuleOutputJSON(
            pipelineModule,
            index
          ) as Image
          image.data = getPipelineModuleOutputArray(
            pipelineModule,
            index,
            0,
            image.imageType.componentType
          )
          image.direction = getPipelineModuleOutputArray(
            pipelineModule,
            index,
            1,
            FloatTypes.Float64
          ) as Float64Array
          image.metadata = new Map(image.metadata)
          outputData = image
          break
        }
        case InterfaceTypes.Mesh: {
          const mesh = getPipelineModuleOutputJSON(
            pipelineModule,
            index
          ) as Mesh
          if (mesh.numberOfPoints > 0) {
            mesh.points = getPipelineModuleOutputArray(
              pipelineModule,
              index,
              0,
              mesh.meshType.pointComponentType
            )
          } else {
            mesh.points = bufferToTypedArray(
              mesh.meshType.pointComponentType,
              new ArrayBuffer(0)
            )
          }
          if (mesh.numberOfCells > 0) {
            mesh.cells = getPipelineModuleOutputArray(
              pipelineModule,
              index,
              1,
              mesh.meshType.cellComponentType
            )
          } else {
            mesh.cells = bufferToTypedArray(
              mesh.meshType.cellComponentType,
              new ArrayBuffer(0)
            )
          }
          if (mesh.numberOfPointPixels > 0) {
            mesh.pointData = getPipelineModuleOutputArray(
              pipelineModule,
              index,
              2,
              mesh.meshType.pointPixelComponentType
            )
          } else {
            mesh.pointData = bufferToTypedArray(
              mesh.meshType.pointPixelComponentType,
              new ArrayBuffer(0)
            )
          }
          if (mesh.numberOfCellPixels > 0) {
            mesh.cellData = getPipelineModuleOutputArray(
              pipelineModule,
              index,
              3,
              mesh.meshType.cellPixelComponentType
            )
          } else {
            mesh.cellData = bufferToTypedArray(
              mesh.meshType.cellPixelComponentType,
              new ArrayBuffer(0)
            )
          }
          outputData = mesh
          break
        }
        case InterfaceTypes.PointSet: {
          const pointSet = getPipelineModuleOutputJSON(
            pipelineModule,
            index
          ) as PointSet
          if (pointSet.numberOfPoints > 0) {
            pointSet.points = getPipelineModuleOutputArray(
              pipelineModule,
              index,
              0,
              pointSet.pointSetType.pointComponentType
            )
          } else {
            pointSet.points = bufferToTypedArray(
              pointSet.pointSetType.pointComponentType,
              new ArrayBuffer(0)
            )
          }
          if (pointSet.numberOfPointPixels > 0) {
            pointSet.pointData = getPipelineModuleOutputArray(
              pipelineModule,
              index,
              1,
              pointSet.pointSetType.pointPixelComponentType
            )
          } else {
            pointSet.pointData = bufferToTypedArray(
              pointSet.pointSetType.pointPixelComponentType,
              new ArrayBuffer(0)
            )
          }
          outputData = pointSet
          break
        }
        case InterfaceTypes.TransformList: {
          const transformList = getPipelineModuleOutputJSON(
            pipelineModule,
            index
          ) as TransformList
          transformList.forEach((transform, transformIndex) => {
            if (transform.numberOfFixedParameters > 0) {
              transformList[transformIndex].fixedParameters =
                getPipelineModuleOutputArray(
                  pipelineModule,
                  index,
                  transformIndex * 2,
                  transform.transformType.parametersValueType
                ) as TypedArray
            }
            if (transform.numberOfFixedParameters > 0) {
              transformList[transformIndex].parameters =
                getPipelineModuleOutputArray(
                  pipelineModule,
                  index,
                  transformIndex * 2 + 1,
                  transform.transformType.parametersValueType
                ) as TypedArray
            }
          })
          outputData = transformList
          break
        }
        case InterfaceTypes.PolyData: {
          const polyData = getPipelineModuleOutputJSON(
            pipelineModule,
            index
          ) as PolyData
          if (polyData.numberOfPoints > 0) {
            polyData.points = getPipelineModuleOutputArray(
              pipelineModule,
              index,
              0,
              FloatTypes.Float32
            ) as Float32Array
          } else {
            polyData.points = new Float32Array()
          }
          if (polyData.verticesBufferSize > 0) {
            polyData.vertices = getPipelineModuleOutputArray(
              pipelineModule,
              index,
              1,
              IntTypes.UInt32
            ) as Uint32Array
          } else {
            polyData.vertices = new Uint32Array()
          }
          if (polyData.linesBufferSize > 0) {
            polyData.lines = getPipelineModuleOutputArray(
              pipelineModule,
              index,
              2,
              IntTypes.UInt32
            ) as Uint32Array
          } else {
            polyData.lines = new Uint32Array()
          }
          if (polyData.polygonsBufferSize > 0) {
            polyData.polygons = getPipelineModuleOutputArray(
              pipelineModule,
              index,
              3,
              IntTypes.UInt32
            ) as Uint32Array
          } else {
            polyData.polygons = new Uint32Array()
          }
          if (polyData.triangleStripsBufferSize > 0) {
            polyData.triangleStrips = getPipelineModuleOutputArray(
              pipelineModule,
              index,
              4,
              IntTypes.UInt32
            ) as Uint32Array
          } else {
            polyData.triangleStrips = new Uint32Array()
          }
          if (polyData.numberOfPointPixels > 0) {
            polyData.pointData = getPipelineModuleOutputArray(
              pipelineModule,
              index,
              5,
              polyData.polyDataType.pointPixelComponentType
            )
          } else {
            polyData.pointData = bufferToTypedArray(
              polyData.polyDataType.pointPixelComponentType,
              new ArrayBuffer(0)
            )
          }
          if (polyData.numberOfCellPixels > 0) {
            polyData.cellData = getPipelineModuleOutputArray(
              pipelineModule,
              index,
              6,
              polyData.polyDataType.cellPixelComponentType
            )
          } else {
            polyData.cellData = bufferToTypedArray(
              polyData.polyDataType.cellPixelComponentType,
              new ArrayBuffer(0)
            )
          }
          outputData = polyData
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
