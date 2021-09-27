import { readAsArrayBuffer } from 'promise-file-reader'

import createWebworkerPromise from "../core/internal/createWebworkerPromise.js"
import vtkPolyData from "../core/vtkPolyData.js"

import mimeToIO from './internal/MimeToPolyDataIO.js'
import getFileExtension from './getFileExtension.js'
import extensionToIO from './internal/extensionToPolyDataIO.js'
import IOTypes from '../core/IOTypes.js'

import config from '../itkConfig.js'

import ReadPolyDataResult from "./ReadPolyDataResult.js"

function readPolyDataBlob(webWorker: Worker | null, blob: Blob, fileName: string, mimeType: string): Promise<ReadPolyDataResult> {
  let worker = webWorker
  return createWebworkerPromise('Pipeline', worker)
    .then(({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      return readAsArrayBuffer(blob)
        .then((arrayBuffer) => {
          const extension = getFileExtension(fileName)
          let pipelinePath = null
          if (mimeToIO.has(mimeType)) {
            pipelinePath = mimeToIO.get(mimeType)
          } else if (extensionToIO.has(extension)) {
            pipelinePath = extensionToIO.get(extension)
          }
          if (pipelinePath === null) {
            Promise.reject(Error('Could not find IO for: ' + fileName))
          }

          const args = [fileName, fileName + '.output.json']
          const outputs = [
            { path: args[1], type: IOTypes.vtkPolyData }
          ]
          const inputs = [
            { path: args[0], type: IOTypes.Binary, data: new Uint8Array(arrayBuffer) }
          ]
          const transferables: ArrayBuffer[] = []
          inputs.forEach(function (input) {
          // Binary data
            if (input.type === IOTypes.Binary) {
              if (input.data.buffer) {
                transferables.push(input.data.buffer)
              } else if (input.data.byteLength) {
                transferables.push(input.data)
              }
            }
          })
          interface RunPolyDataIOPipelineResult {
            stdout: string
            stderr: string
            outputs: any[]
          }
          return webworkerPromise.postMessage(
            {
              operation: 'runPolyDataIOPipeline',
              config: config,
              pipelinePath,
              args,
              outputs,
              inputs
            },
            transferables
          ).then(function (result: RunPolyDataIOPipelineResult) {
            return Promise.resolve({ polyData: result.outputs[0].data as vtkPolyData, webWorker: worker })
          })
        })
    })
}

export default readPolyDataBlob
