import path from 'path'
import mime from 'mime-types'
import fs from 'fs'

import mimeToIO from './internal/MimeToPolyDataIO.js'
import getFileExtension from './getFileExtension.js'
import extensionToIO from './internal/extensionToPolyDataIO.js'
import IOTypes from '../core/IOTypes.js'
import PolyData from '../core/vtkPolyData.js'

import loadEmscriptenModule from '../core/internal/loadEmscriptenModuleNode.js'
import runPipelineEmscripten from '../pipeline/internal/runPipelineEmscripten.js'
import PipelineEmscriptenModule from '../pipeline/PipelineEmscriptenModule.js'
import localPathRelativeToModule from './localPathRelativeToModule.js'

async function readPolyDataLocalFile(filePath: string): Promise<PolyData> {
  const polyDataIOsPath = localPathRelativeToModule(import.meta.url, '../polydata-io')
  if (!fs.existsSync(polyDataIOsPath)) {
    throw Error("Cannot find path to itk polyData IO's")
  }
  const absoluteFilePath = path.resolve(filePath)
  const filePathBasename = path.basename(filePath)
  const mimeType = mime.lookup(absoluteFilePath)
  const extension = getFileExtension(absoluteFilePath)

  let io = null
  if (mimeToIO.has(mimeType)) {
    io = mimeToIO.get(mimeType)
  } else if (extensionToIO.has(extension)) {
    io = extensionToIO.get(extension)
  }
  if (io === null) {
    throw Error('Could not find IO for: ' + absoluteFilePath)
  }

  const modulePath = path.join(polyDataIOsPath, io as string + '.js')
  const Module = await loadEmscriptenModule(modulePath) as PipelineEmscriptenModule
  const fileContents = new Uint8Array(fs.readFileSync(absoluteFilePath))

  const args = [filePathBasename, filePathBasename + '.output.json']
  const desiredOutputs = [
    { path: args[1], type: IOTypes.vtkPolyData }
  ]
  const inputs = [
    { path: args[0], type: IOTypes.Binary, data: fileContents }
  ]
  const { outputs } = runPipelineEmscripten(Module, args, desiredOutputs, inputs)

  return outputs[0].data as PolyData
}

export default readPolyDataLocalFile
