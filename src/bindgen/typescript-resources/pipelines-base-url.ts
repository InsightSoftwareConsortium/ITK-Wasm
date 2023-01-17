let pipelinesBaseUrl: string | URL = new URL('/pipelines', document.location.origin).href

export function setPipelinesBaseUrl (baseUrl: string | URL): void {
  pipelinesBaseUrl = baseUrl
}

export function getPipelinesBaseUrl (): string | URL {
  return pipelinesBaseUrl
}
