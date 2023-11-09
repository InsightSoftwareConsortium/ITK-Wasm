import * as Comlink from 'comlink'

import createWorkerProxy from '../core/create-worker-proxy.js'
import getTransferables from '../core/get-transferables.js'
import ReadImagePipelineResult from '../core/web-workers/read-image-pipeline-result.js'
import Image from '../core/interface-types/image.js'
import InterfaceTypes from '../core/InterfaceTypes.js'
import PipelineInput from '../pipeline/PipelineInput.js'
import castImage from '../core/castImage.js'

import config from '../itkConfig.js'

import ReadImageResult from './ReadImageResult.js'
import ReadImageArrayBufferOptions from './ReadImageArrayBufferOptions.js'

async function readImageArrayBuffer (webWorker: Worker | null, arrayBuffer: ArrayBuffer, fileName: string, options?: ReadImageArrayBufferOptions | string): Promise<ReadImageResult> {
  let worker = webWorker
  const { workerProxy, worker: usedWorker } = await createWorkerProxy(worker, null)
  worker = usedWorker

  const filePath = `./${fileName}`
  const args = [filePath, '0', '--memory-io', '--quiet']
  const outputs = [
    { type: InterfaceTypes.Image }
  ]
  const inputs = [
    { type: InterfaceTypes.BinaryFile, data: { path: filePath, data: new Uint8Array(arrayBuffer) } }
  ] as PipelineInput[]

  const transferables: ArrayBuffer[] = [arrayBuffer]
  let mimeType
  if (typeof options === 'string') {
    // backwards compatibility
    mimeType = options
  } else if (typeof options === 'object') {
    if (typeof options.mimeType === 'string') {
      mimeType = options.mimeType
    }
  }
  const mimeTypeString = mimeType?.toString() ?? ''
  const result: ReadImagePipelineResult = await workerProxy.readImage(
    config,
    mimeTypeString,
    fileName,
    args,
    outputs,
    Comlink.transfer(inputs, getTransferables(transferables))
  )
  let image = result.outputs[0].data as Image
  if (typeof options === 'object' && (typeof options.componentType !== 'undefined' || typeof options.pixelType !== 'undefined')) {
    image = castImage(image, options)
  }

  return { image, webWorker: worker }
}

export default readImageArrayBuffer
