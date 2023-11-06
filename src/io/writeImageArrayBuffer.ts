import * as Comlink from 'comlink'

import createWorkerProxy from '../core/create-worker-proxy.js'

import Image from '../core/interface-types/image.js'

import config from '../itkConfig.js'
import PipelineInput from '../pipeline/PipelineInput.js'
import PipelineOutput from '../pipeline/PipelineOutput.js'
import InterfaceTypes from '../core/InterfaceTypes.js'
import getTransferables from '../core/get-transferables.js'
import castImage from '../core/castImage.js'
import WriteImagePipelineResult from '../core/web-workers/write-image-pipeline-result.js'

import WriteImageOptions from './WriteImageOptions.js'
import WriteArrayBufferResult from './WriteArrayBufferResult.js'
import imageTransferables from '../core/internal/imageTransferables.js'

async function writeImageArrayBuffer (webWorker: Worker | null, image: Image, fileName: string, options?: WriteImageOptions | string, useCompressionBackwardsCompatibility?: boolean
): Promise<WriteArrayBufferResult> {
  if (typeof image === 'boolean') {
    throw new Error('useCompression is now at the last argument position in itk-wasm')
  }

  let mimeType = ''
  if (typeof options === 'string') {
    mimeType = options
  }
  let useCompression = false
  if (typeof useCompressionBackwardsCompatibility === 'boolean') {
    useCompression = useCompressionBackwardsCompatibility
  }
  if (typeof options === 'object' && typeof options.useCompression !== 'undefined') {
    useCompression = options.useCompression
  }

  let worker = webWorker
  const { workerProxy, worker: usedWorker } = await createWorkerProxy(worker, null)
  worker = usedWorker

  const filePath = `./${fileName}`
  const args = ['0', filePath, '--memory-io', '--quiet']
  if (useCompression) {
    args.push('--use-compression')
  }
  const outputs = [
    { data: { path: filePath }, type: InterfaceTypes.BinaryFile }
  ] as PipelineOutput[]
  let inputImage = image
  if (typeof options === 'object' && (typeof options.componentType !== 'undefined' || typeof options.pixelType !== 'undefined')) {
    inputImage = castImage(image, options)
  }
  const inputs = [
    { type: InterfaceTypes.Image, data: inputImage }
  ] as PipelineInput[]

  const transferables = imageTransferables(image)

  const result: WriteImagePipelineResult = await workerProxy.writeImage(
    config,
    mimeType,
    fileName,
    args,
    outputs,
    Comlink.transfer(inputs, getTransferables(transferables))
  )
  return { arrayBuffer: result.outputs[0].data.data.buffer as ArrayBuffer, webWorker: worker }
}

export default writeImageArrayBuffer
