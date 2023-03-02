// @ts-ignore: TS2305: Module '"itk-wasm"' has no exported member 'getPipelinesBaseUrl'.
import { getPipelinesBaseUrl as itkWasmGetPipelinesBaseUrl } from 'itk-wasm'
import packageJson from '../package.json'

let pipelinesBaseUrl: string | URL | undefined
const defaultPipelinesBaseUrl = `https://cdn.jsdelivr.net/npm/@itk-wasm/compress-stringify@${packageJson.version}/dist/pipelines`

export function setPipelinesBaseUrl (baseUrl: string | URL): void {
  pipelinesBaseUrl = baseUrl
}

export function getPipelinesBaseUrl (): string | URL {
  if (typeof pipelinesBaseUrl !== 'undefined') {
    return pipelinesBaseUrl
  }
  const itkWasmPipelinesBaseUrl = itkWasmGetPipelinesBaseUrl()
  if (typeof itkWasmPipelinesBaseUrl !== 'undefined') {
    return itkWasmPipelinesBaseUrl
  }
  return defaultPipelinesBaseUrl
}
