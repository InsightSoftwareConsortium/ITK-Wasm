import path from 'path'
import mime from 'mime-types'
import fs from 'fs'

import mimeToIO from './internal/MimeToPolyDataIO.js'
import getFileExtension from './getFileExtension.js'
import extensionToIO from './internal/extensionToPolyDataIO.js'
import IOTypes from '../core/IOTypes.js'
import PolyData from '../core/vtkPolyData.js'

import loadEmscriptenModule from '../core/internal/loadEmscriptenModuleNode.js'
import runPipelineEmscripten from '../core/internal/runPipelineEmscripten.js'
import CLIEmscriptenModule from '../core/CLIEmscriptenModule.js'

function readPolyDataLocalFileSync(filePath: string): PolyData {
  const polyDataIOsPath = path.resolve(__dirname, 'PolyDataIOs')
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

  const modulePath = path.join(polyDataIOsPath, io as string)
  const Module = loadEmscriptenModule(modulePath) as CLIEmscriptenModule
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

export default readPolyDataLocalFileSync
