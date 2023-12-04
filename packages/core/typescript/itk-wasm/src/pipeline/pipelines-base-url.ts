let pipelinesBaseUrl: string | URL | undefined

export function setPipelinesBaseUrl (baseUrl: string | URL): void {
  pipelinesBaseUrl = baseUrl
}

export function getPipelinesBaseUrl (): string | URL | undefined {
  return pipelinesBaseUrl
}
