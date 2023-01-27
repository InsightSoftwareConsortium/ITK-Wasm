// @ts-expect-error error TS2732: Cannot find module '../package.json'. Consider using '--resolveJsonModule' to import module with '.json' extension.
import packageJson from '../package.json'
let pipelinesBaseUrl: string | URL = `https://cdn.jsdelivr.net/npm/itk-dicom@${packageJson.version as string}/dist/pipelines`

export function setPipelinesBaseUrl (baseUrl: string | URL): void {
  pipelinesBaseUrl = baseUrl
}

export function getPipelinesBaseUrl (): string | URL {
  return pipelinesBaseUrl
}
