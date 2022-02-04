import createWebWorkerPromise from '../core/internal/createWebWorkerPromise.js'
import { readAsArrayBuffer } from 'promise-file-reader'
import PipelineInput from '../pipeline/PipelineInput.js'
import TextStream from '../core/TextStream.js'

import config from '../itkConfig.js'

import ReadDICOMTagsResult from './ReadDICOMTagsResult.js'
import InterfaceTypes from '../core/InterfaceTypes.js'

async function readDICOMTags (webWorker: Worker, file: File, tags: string[] | null = null): Promise<ReadDICOMTagsResult> {
  let worker = webWorker
  const { webworkerPromise, worker: usedWorker } = await createWebWorkerPromise(
    'pipeline',
    worker
  )
  worker = usedWorker

  const arrayBuffer = await readAsArrayBuffer(file)
  const dataArray = new Uint8Array(arrayBuffer)

  const path = `./${file.name}`
  const args = [path, '0', '--memory-io']
  const inputs = [
    { type: InterfaceTypes.BinaryFile, data: { data: dataArray, path } }
  ] as PipelineInput[]
  if (tags != null) {
    args.push('--tags-to-read')
    args.push('1')
    inputs.push({ type: InterfaceTypes.TextStream, data: { data: JSON.stringify({ tags: tags }) } })
  }
  const outputs = [
    { type: InterfaceTypes.TextStream }
  ]

  interface PipelineResult {
    stdout: string
    stderr: string
    outputs: any[]
  }

  const result: PipelineResult = await webworkerPromise.postMessage(
    {
      operation: 'readDICOMTags',
      config: config,
      pipelinePath: 'ReadDICOMTags', // placeholder
      args,
      outputs,
      inputs
    },
    [arrayBuffer]
  )
  const tagsJSON = (result.outputs[0].data as TextStream).data
  const tagsResult = JSON.parse(tagsJSON)
  const tagsMap: Map<string, string> = new Map(tagsResult.tags)
  return { tags: tagsMap, webWorker: worker }
}

export default readDICOMTags
