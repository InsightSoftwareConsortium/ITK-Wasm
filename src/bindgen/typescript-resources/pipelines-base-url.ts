let pipelinesBaseUrl: string | URL = new URL('/pipelines', document.location.origin).href

export function setPipelinesBaseUrl(baseUrl: string | URL)  {
  pipelinesBaseUrl = baseUrl
}

export function getPipelinesBaseUrl() {
  return pipelinesBaseUrl
}