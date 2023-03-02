// @ts-ignore: TS2305: Module '"itk-wasm"' has no exported member 'getPipelineWorkerUrl'.
import { getPipelineWorkerUrl as itkWasmGetPipelineWorkerUrl } from 'itk-wasm'
import packageJson from '../package.json'

let pipelineWorkerUrl: string | URL | null | undefined
let defaultPipelineWorkerUrl: string | URL | null = `https://cdn.jsdelivr.net/npm/@itk-wasm/compress-stringify@${packageJson.version}/dist/web-workers/pipeline.worker.js`

export function setPipelineWorkerUrl (workerUrl: string | URL | null): void {
  pipelineWorkerUrl = workerUrl
}

export function getPipelineWorkerUrl (): string | URL | null {
  if (typeof pipelineWorkerUrl !== 'undefined') {
    return pipelineWorkerUrl
  }
  const itkWasmPipelineWorkerUrl = itkWasmGetPipelineWorkerUrl()
  if (typeof itkWasmPipelineWorkerUrl !== 'undefined') {
    return itkWasmPipelineWorkerUrl
  }
  return defaultPipelineWorkerUrl
}
