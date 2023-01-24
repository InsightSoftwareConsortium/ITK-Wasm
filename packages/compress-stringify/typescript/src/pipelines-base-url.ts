import packageJson from '../package.json'
let pipelinesBaseUrl: string | URL = `https://cdn.jsdelivr.net/npm/itk-compress-stringify@${packageJson.version}/dist/pipelines`

export function setPipelinesBaseUrl (baseUrl: string | URL): void {
  pipelinesBaseUrl = baseUrl
}

export function getPipelinesBaseUrl (): string | URL {
  return pipelinesBaseUrl
}
